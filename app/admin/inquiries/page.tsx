"use client";

import { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

const TZ = "Asia/Kolkata";

const STATUS_OPTIONS = ["all", "new", "contacted", "booked", "declined", "expired"];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:       { bg: "var(--ubasti-mustard)",    color: "var(--ubasti-ink)" },
  contacted: { bg: "var(--ubasti-sage)",       color: "white" },
  booked:    { bg: "var(--ubasti-success)",    color: "white" },
  declined:  { bg: "var(--ubasti-danger)",     color: "white" },
  expired:   { bg: "var(--ubasti-blush-light)", color: "var(--ubasti-sage)" },
};

interface Inquiry {
  id:            string;
  fullName:      string;
  phoneE164:     string;
  email:         string | null;
  requestedDate: string;
  partySize:     number;
  occasion:      string;
  message:       string | null;
  status:        string;
  adminNotes:    string | null;
  createdAt:     string;
}

export default function AdminInquiries() {
  const [filter,   setFilter]   = useState("all");
  const [rows,     setRows]     = useState<Inquiry[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [notes,    setNotes]    = useState("");
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res  = await fetch(`/api/admin/inquiries?status=${filter}`);
        const data = await res.json();
        if (!cancelled) { setRows(data.inquiries ?? []); setSelected(null); }
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRows((rs) => rs.map((r) => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null);
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, adminNotes: notes }),
      });
      setSelected((s) => s ? { ...s, adminNotes: notes } : null);
      setRows((rs) => rs.map((r) => r.id === selected.id ? { ...r, adminNotes: notes } : r));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
        Party Inquiries
      </h1>

      {/* Filter */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-sm font-medium capitalize border transition-colors"
            style={{
              background:   filter === s ? "var(--ubasti-olive-dark)" : "transparent",
              borderColor:  filter === s ? "var(--ubasti-olive-dark)" : "var(--ubasti-sage-light)",
              color:        filter === s ? "var(--ubasti-cream)"       : "var(--ubasti-ink)",
            }}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 overflow-auto rounded-2xl" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
          {loading ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--ubasti-sage)" }}>Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--ubasti-sage)" }}>No inquiries in this filter.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                  {["Name", "Date", "Occasion", "Status", "Received"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} onClick={() => { setSelected(r); setNotes(r.adminNotes ?? ""); }}
                    className="cursor-pointer hover:bg-[var(--ubasti-cream)] transition-colors"
                    style={{
                      background:   selected?.id === r.id ? "var(--ubasti-blush-light)" : i % 2 === 0 ? "var(--ubasti-white)" : "var(--ubasti-paper)",
                      borderBottom: "1px solid var(--ubasti-blush-light)",
                    }}>
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: "var(--ubasti-ink)" }}>{r.fullName}</div>
                      <div className="text-xs" style={{ color: "var(--ubasti-sage)" }}>{r.phoneE164}</div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--ubasti-sage)" }}>
                      {formatInTimeZone(new Date(r.requestedDate), TZ, "d MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 capitalize" style={{ color: "var(--ubasti-ink)" }}>{r.occasion}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                        style={STATUS_COLORS[r.status] ?? { bg: "var(--ubasti-blush-light)", color: "var(--ubasti-sage)" }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--ubasti-sage)" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Side panel */}
        {selected && (
          <div className="w-72 shrink-0 rounded-2xl p-5 flex flex-col gap-4 overflow-y-auto"
            style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: "var(--ubasti-ink)" }}>Inquiry Detail</h3>
              <button onClick={() => setSelected(null)} className="text-xl leading-none" style={{ color: "var(--ubasti-sage)" }}>×</button>
            </div>
            <dl className="flex flex-col gap-2 text-sm">
              {[
                ["Name",     selected.fullName],
                ["Phone",    selected.phoneE164],
                selected.email ? ["Email", selected.email] : null,
                ["Date",     formatInTimeZone(new Date(selected.requestedDate), TZ, "EEEE, d MMM yyyy")],
                ["Party",    `${selected.partySize} guests`],
                ["Occasion", selected.occasion],
                selected.message ? ["Message", selected.message] : null,
              ].filter(Boolean).map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--ubasti-sage)" }}>{k}</dt>
                  <dd style={{ color: "var(--ubasti-ink)" }}>{v as string}</dd>
                </div>
              ))}
            </dl>

            {/* Quick actions */}
            <div className="flex gap-2 flex-wrap">
              <a href={`tel:${selected.phoneE164}`} className="text-xs px-3 py-1.5 rounded-full border"
                style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}>Call</a>
              <a href={`https://wa.me/${selected.phoneE164.replace("+", "")}`} target="_blank" rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full border"
                style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}>WhatsApp</a>
            </div>

            {/* Status update */}
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Update Status</label>
              <div className="flex flex-wrap gap-1">
                {["contacted", "booked", "declined"].map((s) => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className="text-xs px-3 py-1.5 rounded-full capitalize"
                    style={{ background: selected.status === s ? "var(--ubasti-olive-dark)" : "var(--ubasti-blush-light)", color: selected.status === s ? "var(--ubasti-cream)" : "var(--ubasti-ink)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Admin Notes</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl border px-3 py-2 text-sm resize-none outline-none"
                style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }} />
              <button onClick={saveNotes} disabled={saving}
                className="h-9 rounded-full text-sm font-medium"
                style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
                {saving ? "Saving…" : "Save Notes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
