"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { Modal } from "@/components/ui/Modal";

interface EventRow {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  startsAt: string;
  endsAt: string;
  location?: string | null;
  priceInr?: number | null;
}

interface Props {
  events: EventRow[];
}

const TZ = "Asia/Kolkata";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Soft pastel chips for events — cycles through the brand pastels.
const EVENT_COLORS: { bg: string; fg: string }[] = [
  { bg: "var(--ubasti-blush)",      fg: "var(--ubasti-ink)" },
  { bg: "var(--ubasti-sage-light)", fg: "var(--ubasti-ink)" },
  { bg: "var(--ubasti-gold)",       fg: "var(--ubasti-ink)" },
  { bg: "var(--ubasti-mustard)",    fg: "var(--ubasti-ink)" },
];

function toLocalDateKey(isoString: string): string {
  return formatInTimeZone(new Date(isoString), TZ, "yyyy-MM-dd");
}

export function EventsCalendar({ events }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selected, setSelected] = useState<EventRow | null>(null);

  // Build a map: dateKey → EventRow[]
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventRow[]>();
    for (const ev of events) {
      const key = toLocalDateKey(ev.startsAt);
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, ev]);
    }
    return map;
  }, [events]);

  // Calendar grid cells for the current month
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: Array<{ day: number | null; dateKey: string | null }> = [];

    for (let i = 0; i < firstDay; i++) result.push({ day: null, dateKey: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      result.push({ day: d, dateKey });
    }
    return result;
  }, [year, month]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const monthLabel = new Date(year, month, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
  const todayKey = formatInTimeZone(today, TZ, "yyyy-MM-dd");

  return (
    <>
      <div
        className="relative overflow-hidden rounded-[2rem] p-4 md:p-8"
        style={{
          background: "linear-gradient(135deg, var(--ubasti-paper) 0%, var(--ubasti-cream) 100%)",
          border: "1px solid var(--ubasti-blush-light)",
          boxShadow: "0 18px 50px rgba(44,46,31,0.10)",
        }}
      >
        {/* ── Abstract pastel decorations ── */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div style={{ position: "absolute", top: -70, right: -50, width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle, var(--ubasti-blush) 0%, transparent 70%)", opacity: 0.5, filter: "blur(6px)" }} />
          <div style={{ position: "absolute", bottom: -80, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, var(--ubasti-sage-light) 0%, transparent 70%)", opacity: 0.4, filter: "blur(8px)" }} />
          <div style={{ position: "absolute", top: "38%", left: -40, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, var(--ubasti-mustard) 0%, transparent 70%)", opacity: 0.18, filter: "blur(6px)" }} />
          {/* Dotted squiggle flourish, top-left */}
          <svg width="150" height="40" viewBox="0 0 150 40" className="absolute top-4 left-4" style={{ color: "var(--ubasti-blush)", opacity: 0.55 }}>
            <path d="M2,20 Q20,2 38,20 T74,20 T110,20 T146,20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              aria-label="Previous month"
              style={{ background: "var(--ubasti-white)", color: "var(--ubasti-olive-dark)", boxShadow: "0 3px 10px rgba(44,46,31,0.10)" }}
            >
              ←
            </button>
            <h2 className="text-2xl md:text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
              {monthLabel}
            </h2>
            <button
              onClick={nextMonth}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              aria-label="Next month"
              style={{ background: "var(--ubasti-white)", color: "var(--ubasti-olive-dark)", boxShadow: "0 3px 10px rgba(44,46,31,0.10)" }}
            >
              →
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d, di) => (
              <div key={d} className="text-center text-[11px] md:text-xs font-bold py-2 uppercase tracking-[0.15em]"
                style={{ color: di === 0 || di === 6 ? "var(--ubasti-blush)" : "var(--ubasti-sage)" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {cells.map((cell, i) => {
              if (!cell.day || !cell.dateKey) {
                return <div key={i} className="min-h-[68px] md:min-h-[92px]" />;
              }
              const dayEvents = eventsByDate.get(cell.dateKey) ?? [];
              const isToday = cell.dateKey === todayKey;
              const isWeekend = i % 7 === 0 || i % 7 === 6;
              const hasEvents = dayEvents.length > 0;

              return (
                <div
                  key={cell.dateKey}
                  className="min-h-[68px] md:min-h-[92px] p-1.5 md:p-2 flex flex-col rounded-xl md:rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: isToday
                      ? "var(--ubasti-blush-light)"
                      : isWeekend
                        ? "rgba(242,218,197,0.55)"
                        : "var(--ubasti-white)",
                    border: isToday ? "1.5px solid var(--ubasti-olive-dark)" : "1px solid rgba(229,182,174,0.35)",
                    boxShadow: hasEvents ? "0 5px 16px rgba(44,46,31,0.10)" : "0 1px 4px rgba(44,46,31,0.04)",
                  }}
                >
                  <span
                    className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mb-1 shrink-0"
                    style={{
                      background: isToday ? "var(--ubasti-olive-dark)" : "transparent",
                      color: isToday ? "var(--ubasti-cream)" : "var(--ubasti-ink)",
                    }}
                  >
                    {cell.day}
                  </span>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayEvents.map((ev, di) => {
                      const c = EVENT_COLORS[di % EVENT_COLORS.length];
                      return (
                        <button
                          key={ev.id}
                          onClick={() => setSelected(ev)}
                          className="text-left text-[10px] leading-tight px-1.5 py-0.5 rounded-full truncate w-full font-medium transition-transform hover:scale-[1.03]"
                          style={{ background: c.bg, color: c.fg }}
                          title={ev.title}
                        >
                          {ev.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event detail modal */}
      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title} size="lg">
        {selected && <EventDetail event={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </>
  );
}

function EventDetail({ event, onClose }: { event: EventRow; onClose: () => void }) {
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  const dayStr = formatInTimeZone(start, TZ, "EEEE, d MMMM yyyy");
  const timeStr = `${formatInTimeZone(start, TZ, "h:mm aa")} – ${formatInTimeZone(end, TZ, "h:mm aa")}`;

  return (
    <div className="flex flex-col gap-4">
      {event.coverImageUrl && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden">
          <Image src={event.coverImageUrl} alt={event.title} fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>
          {dayStr}
        </p>
        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>{timeStr}</p>
        {event.location && (
          <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>📍 {event.location}</p>
        )}
        {event.priceInr !== null && event.priceInr !== undefined && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full w-fit"
            style={{
              background: event.priceInr === 0 ? "var(--ubasti-success)" : "var(--ubasti-mustard)",
              color: event.priceInr === 0 ? "white" : "var(--ubasti-ink)",
            }}
          >
            {event.priceInr === 0 ? "Free" : `₹${event.priceInr}`}
          </span>
        )}
      </div>
      {event.description && (
        <p className="text-sm leading-relaxed" style={{ color: "var(--ubasti-ink)" }}>
          {event.description}
        </p>
      )}
      <div className="flex items-center gap-3 pt-2">
        <Link
          href={`/events/${event.slug}`}
          onClick={onClose}
          className="inline-flex h-10 items-center px-6 rounded-full font-medium text-sm transition-opacity hover:opacity-90"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
        >
          Register →
        </Link>
        <button
          onClick={onClose}
          className="text-sm"
          style={{ color: "var(--ubasti-sage)" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
