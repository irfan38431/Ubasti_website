"use client";

import { useState, useEffect } from "react";
import { EventCard } from "@/components/events/EventCard";
import { EventsCalendar } from "@/components/events/EventsCalendar";
import { INSTAGRAM_URL } from "@/lib/constants/social";

type Filter = "upcoming" | "this-month" | "next-month" | "free";
type ViewMode = "calendar" | "list";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "upcoming",   label: "All" },
  { value: "this-month", label: "This Month" },
  { value: "next-month", label: "Next Month" },
  { value: "free",       label: "Free Events" },
];

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
            onClick={() => setView("calendar")}
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
            onClick={() => setView("list")}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
            style={{
              background:  view === "list" ? "var(--ubasti-olive-dark)" : "transparent",
              color:       view === "list" ? "var(--ubasti-cream)"      : "var(--ubasti-sage)",
              borderColor: view === "list" ? "var(--ubasti-olive-dark)" : "var(--ubasti-sage-light)",
            }}
          >
            List
          </button>
        </div>

        {/* Filter pills — only shown in list view */}
        {view === "list" && (
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
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
        )}

        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
          {!loading && view === "list" && `Showing ${events.length} upcoming event${events.length !== 1 ? "s" : ""}`}
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

      {/* List view */}
      {view === "list" && (
        <>
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-cream)" }} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="py-20 text-center">
              <p style={{ color: "var(--ubasti-sage)" }}>
                No upcoming events. Check back soon or{" "}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                  className="underline" style={{ color: "var(--ubasti-olive-dark)" }}>
                  follow us on Instagram
                </a>.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {events.map((e) => <EventCard key={e.id} {...e} startsAt={new Date(e.startsAt)} endsAt={new Date(e.endsAt)} />)}
            </div>
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
              {showPast && (
                <div className="flex flex-col gap-4">
                  {past.map((e) => <EventCard key={e.id} {...e} startsAt={new Date(e.startsAt)} endsAt={new Date(e.endsAt)} past />)}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
