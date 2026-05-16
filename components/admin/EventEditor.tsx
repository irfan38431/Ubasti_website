"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RichTextEditor = dynamic(
  () => import("./RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false, loading: () => <div className="h-48 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} /> }
);

interface EventData {
  id?:           string;
  title:         string;
  slug:          string;
  description:   string;
  bodyRichtext:  string;
  startsAt:      string;
  endsAt:        string;
  location:      string;
  capacity:      string;
  priceInr:      string;
  coverImageUrl: string;
  isPublished:   boolean;
}

const EMPTY: EventData = {
  title: "", slug: "", description: "", bodyRichtext: "",
  startsAt: "", endsAt: "", location: "Ubasti Cat Cafe, Chennai",
  capacity: "", priceInr: "0", coverImageUrl: "", isPublished: false,
};

function toIsoLocal(dt: string) {
  if (!dt) return "";
  return new Date(dt).toISOString().slice(0, 16);
}

interface Registration {
  id: string; partySize: number; status: string; createdAt: string;
  userName: string | null; userPhone: string | null;
}

export function EventEditor({ eventId }: { eventId?: string }) {
  const router = useRouter();
  const isNew  = !eventId;

  const [form,    setForm]    = useState<EventData>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState<"details" | "registrations">("details");
  const [regs,    setRegs]    = useState<Registration[]>([]);
  const [regsLoading, setRegsLoading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res  = await fetch(`/api/admin/events/${eventId}`);
        const data = await res.json();
        const e    = data.event;
        if (!cancelled) setForm({
          id:            e.id,
          title:         e.title ?? "",
          slug:          e.slug ?? "",
          description:   e.description ?? "",
          bodyRichtext:  typeof e.bodyRichtext === "string" ? e.bodyRichtext : JSON.stringify(e.bodyRichtext ?? {}),
          startsAt:      toIsoLocal(e.startsAt),
          endsAt:        toIsoLocal(e.endsAt),
          location:      e.location ?? "",
          capacity:      e.capacity ? String(e.capacity) : "",
          priceInr:      e.priceInr != null ? String(e.priceInr) : "0",
          coverImageUrl: e.coverImageUrl ?? "",
          isPublished:   !!e.isPublished,
        });
      } catch {
        if (!cancelled) setError("Failed to load event.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [eventId, isNew]);

  useEffect(() => {
    if (!eventId || tab !== "registrations") return;
    let cancelled = false;
    async function loadRegs() {
      setRegsLoading(true);
      try {
        const res  = await fetch(`/api/admin/events/${eventId}/registrations`);
        const data = await res.json();
        if (!cancelled) setRegs(data.registrations ?? []);
      } catch {} finally {
        if (!cancelled) setRegsLoading(false);
      }
    }
    void loadRegs();
    return () => { cancelled = true; };
  }, [eventId, tab]);

  function set(k: keyof EventData, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError("");
    try {
      const body = {
        title:         form.title,
        slug:          form.slug,
        description:   form.description || undefined,
        bodyRichtext:  form.bodyRichtext || undefined,
        startsAt:      new Date(form.startsAt).toISOString(),
        endsAt:        new Date(form.endsAt).toISOString(),
        location:      form.location || undefined,
        capacity:      form.capacity ? parseInt(form.capacity) : undefined,
        priceInr:      form.priceInr ? parseInt(form.priceInr) : 0,
        coverImageUrl: form.coverImageUrl || undefined,
        isPublished:   publish ?? form.isPublished,
      };

      if (isNew) {
        const res  = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.formErrors?.[0] ?? "Failed");
        router.push(`/admin/events/${data.event.id}`);
      } else {
        const res = await fetch(`/api/admin/events/${eventId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        if (publish !== undefined) setForm((f) => ({ ...f, isPublished: publish }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!eventId || !confirm("Delete this event? This cannot be undone.")) return;
    await fetch(`/api/admin/events/${eventId}`, { method: "DELETE" });
    router.push("/admin/events");
  }

  if (loading) return <div className="h-96 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />;

  const field = "rounded-xl border px-3 py-2 text-sm outline-none w-full";
  const fieldStyle = { borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          {isNew ? "New Event" : "Edit Event"}
        </h1>
        <div className="flex gap-2">
          {!isNew && (
            <button
              onClick={handleDelete}
              className="h-9 px-4 rounded-full text-sm border"
              style={{ borderColor: "var(--ubasti-danger)", color: "var(--ubasti-danger)" }}
            >
              Delete
            </button>
          )}
          <button
            onClick={() => handleSave(form.isPublished ? false : undefined)}
            disabled={saving}
            className="h-9 px-4 rounded-full text-sm border"
            style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}
          >
            {form.isPublished ? "Unpublish" : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(!isNew ? undefined : true)}
            disabled={saving}
            className="h-9 px-4 rounded-full text-sm font-medium"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
          >
            {saving ? "Saving…" : isNew ? "Create & Publish" : form.isPublished ? "Save" : "Publish"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{error}</p>}

      {/* Tabs (only for existing events) */}
      {!isNew && (
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--ubasti-blush-light)" }}>
          {(["details", "registrations"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize"
              style={{ background: tab === t ? "var(--ubasti-white)" : "transparent", color: tab === t ? "var(--ubasti-ink)" : "var(--ubasti-sage)" }}>
              {t}
            </button>
          ))}
        </div>
      )}

      {tab === "details" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Title *</label>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={field} style={fieldStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Slug *</label>
              <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} className={field} style={fieldStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Short description</label>
              <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${field} resize-none`} style={fieldStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Body</label>
              <RichTextEditor
                content={form.bodyRichtext}
                onChange={(v) => set("bodyRichtext", v)}
                placeholder="Event details…"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Starts at (IST)</label>
                <input type="datetime-local" value={form.startsAt} onChange={(e) => set("startsAt", e.target.value)} className={field} style={fieldStyle} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Ends at (IST)</label>
                <input type="datetime-local" value={form.endsAt} onChange={(e) => set("endsAt", e.target.value)} className={field} style={fieldStyle} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Location</label>
                <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} className={field} style={fieldStyle} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Capacity</label>
                  <input type="number" min={1} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} className={field} style={fieldStyle} placeholder="∞" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Price (₹)</label>
                  <input type="number" min={0} value={form.priceInr} onChange={(e) => set("priceInr", e.target.value)} className={field} style={fieldStyle} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Cover image URL</label>
                <input type="text" value={form.coverImageUrl} onChange={(e) => set("coverImageUrl", e.target.value)} className={field} style={fieldStyle} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Registrations tab */
        <div>
          {regsLoading ? (
            <div className="h-32 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
          ) : regs.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>No registrations yet.</p>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                    {["Guest", "Phone", "Party", "Status", "Registered"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{h}</th>
                    ))}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {regs.map((r, i) => (
                    <tr key={r.id} style={{ background: i % 2 === 0 ? "var(--ubasti-white)" : "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                      <td className="px-4 py-3" style={{ color: "var(--ubasti-ink)" }}>{r.userName ?? "—"}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--ubasti-sage)" }}>{r.userPhone ?? "—"}</td>
                      <td className="px-4 py-3 text-center" style={{ color: "var(--ubasti-ink)" }}>{r.partySize}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                          style={{ background: r.status === "confirmed" ? "var(--ubasti-success)" : "var(--ubasti-mustard)", color: r.status === "confirmed" ? "white" : "var(--ubasti-ink)" }}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--ubasti-sage)" }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3">
                        {r.status === "confirmed" && (
                          <button
                            onClick={async () => {
                              await fetch(`/api/admin/events/${eventId}/registrations`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ registrationId: r.id, status: "attended" }),
                              });
                              setRegs((rs) => rs.map((x) => x.id === r.id ? { ...x, status: "attended" } : x));
                            }}
                            className="text-xs px-3 py-1 rounded-full border"
                            style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-sage)" }}
                          >
                            Mark attended
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
