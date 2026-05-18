"use client";

import { useEffect, useState } from "react";

interface AdoptionRecord {
  id:           string;
  adopterName:  string;
  adopterPhone: string;
  adopterEmail: string | null;
  adoptionDate: string;
  notes:        string | null;
  kittyName:    string | null;
}

interface Checkup {
  id:               string;
  scheduledDate:    string;
  sentAt:           string | null;
  status:           string;
  response:         string | null;
  responseMediaUrl: string | null;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: "var(--ubasti-blush-light)", color: "var(--ubasti-sage)",        label: "Pending" },
  sent:      { bg: "var(--ubasti-sage-light)",  color: "var(--ubasti-olive-dark)",  label: "Sent" },
  responded: { bg: "var(--ubasti-mustard)",     color: "var(--ubasti-ink)",         label: "Replied ✓" },
};

function CheckupTimeline({ recordId }: { recordId: string }) {
  const [checkups, setCheckups] = useState<Checkup[] | null>(null);

  useEffect(() => {
    fetch(`/api/admin/adoptions/${recordId}`)
      .then((r) => r.json())
      .then((d) => setCheckups(d.checkups ?? []));
  }, [recordId]);

  if (!checkups) return <div className="h-6 rounded animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {checkups.map((c) => {
        const s = STATUS_STYLE[c.status] ?? STATUS_STYLE.pending;
        return (
          <div key={c.id} className="flex flex-col gap-1 p-2 rounded-xl text-xs" style={{ background: s.bg, minWidth: 90 }}>
            <span className="font-medium" style={{ color: s.color }}>{s.label}</span>
            <span style={{ color: "var(--ubasti-sage)" }}>
              {new Date(c.scheduledDate).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            {c.response && <span className="italic" style={{ color: "var(--ubasti-ink)" }}>"{c.response.slice(0, 60)}{c.response.length > 60 ? "…" : ""}"</span>}
            {c.responseMediaUrl && <span style={{ color: "var(--ubasti-olive-dark)" }}>📷 Photo received</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAdoptions() {
  const [records,    setRecords]    = useState<AdoptionRecord[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [expanded,   setExpanded]   = useState<string | null>(null);
  const [showModal,  setShowModal]  = useState(false);
  const [kitties,    setKitties]    = useState<{ id: string; name: string }[]>([]);
  const [form,       setForm]       = useState({ kittyId: "", adopterName: "", adopterPhone: "", adopterEmail: "", adoptionDate: "", notes: "" });
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    fetch("/api/admin/adoptions").then((r) => r.json()).then((d) => setRecords(d.records ?? [])).finally(() => setLoading(false));
    fetch("/api/admin/kitties").then((r) => r.json()).then((d) => setKitties((d.kitties ?? []).map((k: { id: string; name: string }) => ({ id: k.id, name: k.name }))));
  }, []);

  async function handleAdd() {
    if (!form.kittyId || !form.adopterName || !form.adopterPhone || !form.adoptionDate) {
      setError("Please fill all required fields"); return;
    }
    setSaving(true); setError("");
    try {
      const res  = await fetch("/api/admin/adoptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setRecords((r) => [data.record, ...r]);
      setShowModal(false);
      setForm({ kittyId: "", adopterName: "", adopterPhone: "", adopterEmail: "", adoptionDate: "", notes: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { background: "var(--ubasti-paper)", border: "1px solid var(--ubasti-blush-light)", color: "var(--ubasti-ink)", borderRadius: "0.75rem", padding: "0.5rem 0.75rem", width: "100%", fontSize: "0.875rem" } as const;
  const labelStyle = { fontSize: "0.75rem", fontWeight: 600 as const, color: "var(--ubasti-sage)", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.25rem", display: "block" };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>Adoptions</h1>
        <button onClick={() => setShowModal(true)} className="h-9 px-5 rounded-full text-sm font-medium" style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
          + Record Adoption
        </button>
      </div>

      {loading ? (
        <div className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
      ) : records.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>No adoptions recorded yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {records.map((r) => (
            <div key={r.id} className="rounded-2xl p-5" style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm" style={{ color: "var(--ubasti-ink)" }}>{r.adopterName}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--ubasti-sage)" }}>
                    Adopted <strong style={{ color: "var(--ubasti-ink)" }}>{r.kittyName ?? "—"}</strong> on {new Date(r.adoptionDate).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--ubasti-sage)" }}>{r.adopterPhone}{r.adopterEmail ? ` · ${r.adopterEmail}` : ""}</p>
                  {r.notes && <p className="text-xs mt-1 italic" style={{ color: "var(--ubasti-sage)" }}>{r.notes}</p>}
                </div>
                <button
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="text-xs px-3 py-1.5 rounded-full border shrink-0"
                  style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-sage)" }}
                >
                  {expanded === r.id ? "Hide checkups" : "View checkups"}
                </button>
              </div>
              {expanded === r.id && <CheckupTimeline recordId={r.id} />}
            </div>
          ))}
        </div>
      )}

      {/* Add Adoption Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--ubasti-white)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>Record Adoption</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl leading-none" style={{ color: "var(--ubasti-sage)" }}>×</button>
            </div>
            <div>
              <label style={labelStyle}>Cat *</label>
              <select style={inputStyle} value={form.kittyId} onChange={(e) => setForm((f) => ({ ...f, kittyId: e.target.value }))}>
                <option value="">Select a cat…</option>
                {kitties.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Adopter Name *</label>
                <input style={inputStyle} value={form.adopterName} onChange={(e) => setForm((f) => ({ ...f, adopterName: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <label style={labelStyle}>Adoption Date *</label>
                <input style={inputStyle} type="date" value={form.adoptionDate} onChange={(e) => setForm((f) => ({ ...f, adoptionDate: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>WhatsApp Number *</label>
                <input style={inputStyle} value={form.adopterPhone} onChange={(e) => setForm((f) => ({ ...f, adopterPhone: e.target.value }))} placeholder="+60123456789" />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" value={form.adopterEmail} onChange={(e) => setForm((f) => ({ ...f, adopterEmail: e.target.value }))} placeholder="optional" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any special notes…" />
            </div>
            {error && <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{error}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="h-9 px-5 rounded-full text-sm border" style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-sage)" }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} className="h-9 px-5 rounded-full text-sm font-medium disabled:opacity-50" style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
                {saving ? "Saving…" : "Record Adoption"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
