"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface AuditEntry {
  id:          number;
  action:      string;
  targetType:  string | null;
  targetId:    string | null;
  ipAddress:   string | null;
  createdAt:   string;
  actorName:   string | null;
  actorPhone:  string | null;
}

export default function AdminAudit() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page,    setPage]    = useState(0);
  const [action,  setAction]  = useState("");
  const [from,    setFrom]    = useState("");
  const [to,      setTo]      = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page) });
      if (action) params.set("action", action);
      if (from)   params.set("from", from);
      if (to)     params.set("to", to);
      try {
        const res  = await fetch(`/api/admin/audit?${params}`);
        const data = await res.json();
        if (!cancelled) setEntries(data.entries ?? []);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [page, action, from, to]);

  const field = "rounded-xl border px-3 py-2 text-sm outline-none";
  const fs    = { borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
        Audit Log
      </h1>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input type="text" placeholder="Filter by action…" value={action} onChange={(e) => { setAction(e.target.value); setPage(0); }}
          className={field} style={{ ...fs, minWidth: 200 }} />
        <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} className={field} style={fs} />
        <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} className={field} style={fs} />
        {(action || from || to) && (
          <button onClick={() => { setAction(""); setFrom(""); setTo(""); setPage(0); }}
            className="h-10 px-4 rounded-full text-sm border"
            style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-sage)" }}>
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
      ) : entries.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>No audit entries found.</p>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                {["Action", "Actor", "Target", "IP", "When"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id} style={{ background: i % 2 === 0 ? "var(--ubasti-white)" : "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                  <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--ubasti-olive-dark)" }}>{e.action}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: "var(--ubasti-ink)" }}>
                    {e.actorName ?? e.actorPhone ?? <span style={{ color: "var(--ubasti-sage)" }}>system</span>}
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: "var(--ubasti-sage)" }}>
                    {e.targetType ? `${e.targetType}${e.targetId ? ` · ${e.targetId.slice(0, 8)}` : ""}` : "—"}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--ubasti-sage)" }}>{e.ipAddress ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: "var(--ubasti-sage)" }}>
                    {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex gap-3 justify-center">
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0 || loading}
          className="h-9 px-4 rounded-full text-sm border disabled:opacity-40"
          style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}>
          ← Prev
        </button>
        <span className="flex items-center text-sm" style={{ color: "var(--ubasti-sage)" }}>Page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={entries.length < 50 || loading}
          className="h-9 px-4 rounded-full text-sm border disabled:opacity-40"
          style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}>
          Next →
        </button>
      </div>
    </div>
  );
}
