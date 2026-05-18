"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface KittyRow {
  id:          string;
  slug:        string;
  name:        string;
  age:         string | null;
  sex:         string | null;
  status:      string;
  sortOrder:   number | null;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  available: { bg: "var(--ubasti-success)",      color: "white" },
  "on-hold": { bg: "var(--ubasti-mustard)",      color: "var(--ubasti-ink)" },
  reserved:  { bg: "var(--ubasti-blush)",        color: "var(--ubasti-ink)" },
  adopted:   { bg: "var(--ubasti-sage)",         color: "white" },
};

export default function AdminKitties() {
  const router           = useRouter();
  const [rows, setRows]  = useState<KittyRow[]>([]);
  const [loading, setL]  = useState(true);
  const [deleting, setD] = useState<string | null>(null);

  async function load() {
    try {
      const res  = await fetch("/api/admin/kitties");
      const data = await res.json();
      setRows(data.kitties ?? []);
    } catch {} finally {
      setL(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setD(id);
    try {
      await fetch(`/api/admin/kitties/${id}`, { method: "DELETE" });
      setRows((r) => r.filter((k) => k.id !== id));
    } finally {
      setD(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          Kitties
        </h1>
        <Link
          href="/admin/kitties/new"
          className="inline-flex items-center h-9 px-5 rounded-full text-sm font-medium"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
        >
          + Add Kitty
        </Link>
      </div>

      {loading ? (
        <div className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
      ) : rows.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>No kitties yet. Add your first one!</p>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                {["Name", "Age", "Sex", "Status", "Sort", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const sc = STATUS_COLORS[r.status] ?? { bg: "var(--ubasti-paper)", color: "var(--ubasti-ink)" };
                return (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? "var(--ubasti-white)" : "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--ubasti-ink)" }}>{r.name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--ubasti-sage)" }}>{r.age ?? "—"}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--ubasti-sage)" }}>{r.sex ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase capitalize" style={sc}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-center" style={{ color: "var(--ubasti-sage)" }}>{r.sortOrder ?? 0}</td>
                    <td className="px-4 py-3 text-right flex items-center gap-3 justify-end">
                      <Link href={`/admin/kitties/${r.id}`} className="text-xs font-medium hover:underline" style={{ color: "var(--ubasti-olive-dark)" }}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(r.id, r.name)}
                        disabled={deleting === r.id}
                        className="text-xs font-medium hover:underline disabled:opacity-40"
                        style={{ color: "var(--ubasti-danger)" }}
                      >
                        {deleting === r.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
