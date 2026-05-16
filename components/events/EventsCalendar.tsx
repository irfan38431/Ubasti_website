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
const DOT_COLORS = [
  "var(--ubasti-sage)",
  "var(--ubasti-blush)",
  "var(--ubasti-olive-dark)",
  "var(--ubasti-mustard)",
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
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--ubasti-cream)]"
          aria-label="Previous month"
          style={{ color: "var(--ubasti-sage)" }}
        >
          ←
        </button>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          {monthLabel}
        </h2>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--ubasti-cream)]"
          aria-label="Next month"
          style={{ color: "var(--ubasti-sage)" }}
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium py-2 uppercase tracking-wider"
            style={{ color: "var(--ubasti-sage)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-px" style={{ background: "var(--ubasti-blush-light)" }}>
        {cells.map((cell, i) => {
          if (!cell.day || !cell.dateKey) {
            return <div key={i} style={{ background: "var(--ubasti-paper)" }} className="min-h-[72px]" />;
          }
          const dayEvents = eventsByDate.get(cell.dateKey) ?? [];
          const isToday = cell.dateKey === todayKey;

          return (
            <div
              key={cell.dateKey}
              className="min-h-[72px] p-1.5 flex flex-col"
              style={{ background: "var(--ubasti-paper)" }}
            >
              <span
                className="text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center mb-1 shrink-0"
                style={{
                  background: isToday ? "var(--ubasti-olive-dark)" : "transparent",
                  color: isToday ? "var(--ubasti-cream)" : "var(--ubasti-sage)",
                }}
              >
                {cell.day}
              </span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {dayEvents.map((ev, di) => (
                  <button
                    key={ev.id}
                    onClick={() => setSelected(ev)}
                    className="text-left text-[10px] leading-tight px-1 py-0.5 rounded truncate w-full transition-opacity hover:opacity-80"
                    style={{
                      background: DOT_COLORS[di % DOT_COLORS.length],
                      color: di % DOT_COLORS.length === 1 ? "var(--ubasti-ink)" : "var(--ubasti-cream)",
                    }}
                    title={ev.title}
                  >
                    {ev.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
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
