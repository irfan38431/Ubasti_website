"use client";

import { useState, useEffect } from "react";
import { EventsCarousel } from "@/components/events/EventsCarousel";
import { EventsCalendar } from "@/components/events/EventsCalendar";
import { INSTAGRAM_URL } from "@/lib/constants/social";

type Filter = "upcoming" | "this-month" | "next-month" | "free";
type ViewMode = "calendar" | "cards";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "upcoming",   label: "All" },
  { value: "this-month", label: "This Month" },
  { value: "next-month", label: "Next Month" },
  { value: "free",       label: "Free Events" },
];

// On the calendar, month navigation already handles time — so only the
// non-time filters are offered there. The card view gets the full set.
const CALENDAR_FILTERS: Filter[] = ["upcoming", "free"];

interface EventRow {
  id: string; slug: string; title: string; description?: string | null;
  coverImageUrl?: string | null; startsAt: string; endsAt: string;
  location?: string | null; priceInr?: number | null; capacity?: number | null;
}

export function EventsList() {
  const [view,    setView]    = useState<ViewMode>("calendar");
  const [filter,  setFilter]  = useState<Filter>("upcoming");
  const [events,  setEvents]  = useState<EventRow[]>([]);
  const [past,    setPast]    = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const r = await fetch(`/api/events?filter=${filter}`);
        const d = await r.json();
        if (!cancelled) setEvents(d.events ?? []);
      } catch { if (!cancelled) setEvents([]); }
      finally  { if (!cancelled) setLoading(false); }
    }
    void load();
    return () => { cancelled = true; };
  }, [filter]);

  useEffect(() => {
    fetch("/api/events?filter=past")
      .then((r) => r.json())
      .then((d) => setPast(d.events ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 py-10">
      {/* Toolbar: view toggle + filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sticky top-[72px] z-20 py-3"
        style={{ background: "var(--ubasti-paper)" }}>
        {/* View toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setView("calendar");
              if (!CALENDAR_FILTERS.includes(filter)) setFilter("upcoming");
            }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
            style={{
              background:  view === "calendar" ? "var(--ubasti-olive-dark)" : "transparent",
              color:       view === "calendar" ? "var(--ubasti-cream)"      : "var(--ubasti-sage)",
              borderColor: view === "calendar" ? "var(--ubasti-olive-dark)" : "var(--ubasti-sage-light)",
            }}
          >
            Calendar
          </button>
          <button
            onClick={() => setView("cards")}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
            style={{
              background:  view === "cards" ? "var(--ubasti-olive-dark)" : "transparent",
              color:       view === "cards" ? "var(--ubasti-cream)"      : "var(--ubasti-sage)",
              borderColor: view === "cards" ? "var(--ubasti-olive-dark)" : "var(--ubasti-sage-light)",
            }}
          >
            Cards
          </button>
        </div>

        {/* Filter pills — shown in both views (calendar gets a reduced set) */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.filter((f) => view === "cards" || CALENDAR_FILTERS.includes(f.value)).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
              style={{
                background:  filter === f.value ? "var(--ubasti-sage)" : "transparent",
                color:       filter === f.value ? "var(--ubasti-cream)" : "var(--ubasti-sage)",
                borderColor: filter === f.value ? "var(--ubasti-sage)" : "var(--ubasti-sage-light)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
          {!loading && view === "cards" && `Showing ${events.length} event${events.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Calendar view */}
      {view === "calendar" && (
        loading ? (
          <div className="h-96 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-cream)" }} />
        ) : (
          <EventsCalendar events={events} />
        )
      )}

      {/* Cards (carousel) view */}
      {view === "cards" && (
        <>
          {loading ? (
            <div className="flex gap-5 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[280px] sm:w-[320px] h-80 rounded-3xl animate-pulse shrink-0" style={{ background: "var(--ubasti-cream)" }} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="py-20 text-center">
              <p style={{ color: "var(--ubasti-sage)" }}>
                No events to show. Check back soon or{" "}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                  className="underline" style={{ color: "var(--ubasti-olive-dark)" }}>
                  follow us on Instagram
                </a>.
              </p>
            </div>
          ) : (
            <EventsCarousel events={events} />
          )}

          {/* Past events collapsible */}
          {past.length > 0 && (
            <div className="mt-12">
              <button
                onClick={() => setShowPast((v) => !v)}
                className="text-sm font-medium flex items-center gap-2 mb-4"
                style={{ color: "var(--ubasti-sage)" }}
              >
                Past Events {showPast ? "↑" : "↓"}
              </button>
              {showPast && <EventsCarousel events={past} past />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
