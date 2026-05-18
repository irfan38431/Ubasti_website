"use client";

import { useEffect, useState } from "react";
import { getAuditLabel, formatAuditTime } from "@/lib/audit-labels";

interface Kpis {
  todayBookings:    number;
  upcomingEvents:   number;
  newInquiries:     number;
  totalUsers:       number;
  activeAdoptions:  number;
  subscribers:      number;
}

interface AuditEntry {
  id:          number;
  action:      string;
  targetType:  string | null;
  targetId:    string | null;
  actorUserId: string | null;
  actorName:   string | null;
  createdAt:   string;
}

const TILES = (k: Kpis) => [
  { label: "Bookings Today",   value: k.todayBookings,    href: "/admin/appointments", color: "var(--ubasti-mustard)" },
  { label: "Upcoming Events",  value: k.upcomingEvents,   href: "/admin/events",       color: "var(--ubasti-sage)" },
  { label: "New Inquiries",    value: k.newInquiries,     href: "/admin/inquiries",    color: k.newInquiries > 0 ? "var(--ubasti-danger)" : "var(--ubasti-sage)" },
  { label: "Adoptions",        value: k.activeAdoptions,  href: "/admin/adoptions",    color: "var(--ubasti-blush)" },
  { label: "Subscribers",      value: k.subscribers,      href: "/admin/subscribers",  color: "var(--ubasti-olive-dark)" },
  { label: "Total Members",    value: k.totalUsers,        href: "/admin/team",         color: "var(--ubasti-sage)" },
];

export default function AdminDashboard() {
  const [kpis,  setKpis]  = useState<Kpis | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [err,   setErr]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (!cancelled) {
          setKpis(data.kpis);
          setAudit(data.recentAudit ?? []);
        }
      } catch {
        if (!cancelled) setErr(true);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
        Dashboard
      </h1>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis ? TILES(kpis).map((tile) => (
          <a
            key={tile.label}
            href={tile.href}
            className="rounded-2xl p-5 flex flex-col gap-2 hover:shadow-md transition-shadow"
            style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: tile.color }}>
              {tile.label}
            </span>
            <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>
              {tile.value}
            </span>
          </a>
        )) : Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-5 h-[88px] animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
        ))}
      </div>

      {err && (
        <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>
          Could not load stats — database may be unavailable.
        </p>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "New Event",         href: "/admin/events/new" },
          { label: "Add Kitty",         href: "/admin/kitties/new" },
          { label: "View Appointments", href: "/admin/appointments" },
          { label: "Adoptions",         href: "/admin/adoptions" },
        ].map((a) => (
          <a
            key={a.label}
            href={a.href}
            className="inline-flex items-center h-9 px-4 rounded-full text-sm font-medium border transition-colors hover:bg-[var(--ubasti-cream)]"
            style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}
          >
            {a.label}
          </a>
        ))}
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-lg mb-3 font-medium" style={{ color: "var(--ubasti-ink)" }}>
          Recent Activity
        </h2>
        {audit.length === 0 && !err ? (
          <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>No activity yet.</p>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
            {audit.map((entry, i) => {
              const { icon, label } = getAuditLabel(entry.action);
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-5 py-3"
                  style={{
                    background: i % 2 === 0 ? "var(--ubasti-white)" : "var(--ubasti-paper)",
                    borderBottom: i < audit.length - 1 ? "1px solid var(--ubasti-blush-light)" : "none",
                  }}
                >
                  <span className="text-base shrink-0">{icon}</span>
                  <span className="flex-1 text-sm" style={{ color: "var(--ubasti-ink)" }}>{label}</span>
                  {entry.actorName && (
                    <span className="text-xs shrink-0" style={{ color: "var(--ubasti-sage)" }}>by {entry.actorName}</span>
                  )}
                  <span className="text-xs shrink-0" style={{ color: "var(--ubasti-sage)" }}>
                    {formatAuditTime(entry.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
