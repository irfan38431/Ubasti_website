"use client";

import { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

const TZ   = "Asia/Kolkata";
const TABS = ["today", "upcoming", "past", "cancelled"] as const;
type Tab   = typeof TABS[number];

interface Appt {
  id:          string;
  slotStart:   string;
  slotEnd:     string;
  partySize:   number;
  status:      string;
  notes:       string | null;
  adminNotes:  string | null;
  userName:    string | null;
  userPhone:   string | null;
  createdAt:   string;
  cancelReason: string | null;
}

export default function AppointmentsAdmin() {
  const [tab,     setTab]     = useState<Tab>("today");
  const [rows,    setRows]    = useState<Appt[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Appt | null>(null);
  const [notes,   setNotes]   = useState("");
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res  = await fetch(`/api/admin/appointments?tab=${tab}`);
        const data = await res.json();
        if (!cancelled) { setRows(data.appointments ?? []); setSelected(null); }
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [tab]);

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch("/api/admin/appointments", {
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
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          Appointments
        </h1>
        <a
          href={`/api/admin/appointments?tab=${tab}&format=csv`}
          className="inline-flex items-center h-9 px-4 rounded-full text-sm font-medium border"
          style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}
        >
          Export CSV
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--ubasti-blush-light)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors"
            style={{
              background: tab === t ? "var(--ubasti-white)" : "transparent",
              color:      tab === t ? "var(--ubasti-ink)"   : "var(--ubasti-sage)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Table */}
        <div className="flex-1 overflow-auto rounded-2xl" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
          {loading ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--ubasti-sage)" }}>Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--ubasti-sage)" }}>No appointments in this tab.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                  {["Guest", "Slot", "Party", "Status", "Notes"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={r.id}
                    onClick={() => { setSelected(r); setNotes(r.adminNotes ?? ""); }}
                    className="cursor-pointer transition-colors hover:bg-[var(--ubasti-cream)]"
                    style={{
                      background:   selected?.id === r.id ? "var(--ubasti-blush-light)" : i % 2 === 0 ? "var(--ubasti-white)" : "var(--ubasti-paper)",
                      borderBottom: "1px solid var(--ubasti-blush-light)",
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: "var(--ubasti-ink)" }}>{r.userName ?? "—"}</div>
                      <div className="text-xs" style={{ color: "var(--ubasti-sage)" }}>{r.userPhone ?? ""}</div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--ubasti-ink)" }}>
                      {formatInTimeZone(new Date(r.slotStart), TZ, "d MMM · h:mm aa")}
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: "var(--ubasti-ink)" }}>{r.partySize}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                        style={{
                          background: r.status === "confirmed" ? "var(--ubasti-success)" : r.status === "cancelled" ? "var(--ubasti-danger)" : "var(--ubasti-mustard)",
                          color:      r.status === "confirmed" ? "white"                 : r.status === "cancelled" ? "white"                 : "var(--ubasti-ink)",
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[140px] truncate text-xs" style={{ color: "var(--ubasti-sage)" }}>
                      {r.adminNotes ?? r.notes ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Side panel */}
        {selected && (
          <div
            className="w-72 shrink-0 rounded-2xl p-5 flex flex-col gap-4 overflow-y-auto"
            style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: "var(--ubasti-ink)" }}>Detail</h3>
              <button onClick={() => setSelected(null)} className="text-xl leading-none" style={{ color: "var(--ubasti-sage)" }}>×</button>
            </div>
            <dl className="flex flex-col gap-2 text-sm">
              {[
                ["Guest",  selected.userName ?? "—"],
                ["Phone",  selected.userPhone ?? "—"],
                ["Slot",   formatInTimeZone(new Date(selected.slotStart), TZ, "EEEE, d MMM yyyy · h:mm aa")],
                ["Party",  `${selected.partySize} guest${selected.partySize > 1 ? "s" : ""}`],
                ["Status", selected.status],
                selected.notes ? ["Notes", selected.notes] : null,
                selected.cancelReason ? ["Cancel reason", selected.cancelReason] : null,
              ].filter((x): x is [string, string] => x !== null).map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--ubasti-sage)" }}>{k}</dt>
                  <dd style={{ color: "var(--ubasti-ink)" }}>{v as string}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Admin Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl border px-3 py-2 text-sm resize-none outline-none"
                style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
              />
              <button
                onClick={saveNotes}
                disabled={saving}
                className="h-9 rounded-full text-sm font-medium"
                style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
              >
                {saving ? "Saving…" : "Save Notes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
