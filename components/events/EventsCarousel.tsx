"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";

interface EventRow {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  startsAt: string | Date;
  endsAt: string | Date;
  location?: string | null;
  priceInr?: number | null;
}

const TZ = "Asia/Kolkata";

/** Horizontal, snap-scrolling carousel of vertical event cards. */
export function EventsCarousel({ events, past = false }: { events: EventRow[]; past?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative group/carousel">
      {/* Prev / Next arrows */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Previous events"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center transition-all hover:scale-110"
        style={{ background: "var(--ubasti-white)", color: "var(--ubasti-olive-dark)", boxShadow: "0 4px 14px rgba(44,46,31,0.18)" }}
      >
        ←
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Next events"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center transition-all hover:scale-110"
        style={{ background: "var(--ubasti-white)", color: "var(--ubasti-olive-dark)", boxShadow: "0 4px 14px rgba(44,46,31,0.18)" }}
      >
        →
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-1 px-1"
        style={{ scrollbarWidth: "none" }}
      >
        {events.map((ev) => (
          <CarouselCard key={ev.id} ev={ev} past={past} />
        ))}
      </div>
    </div>
  );
}

function CarouselCard({ ev, past }: { ev: EventRow; past?: boolean }) {
  const start = new Date(ev.startsAt);
  const dayStr = formatInTimeZone(start, TZ, "EEE, d MMM");
  const time = formatInTimeZone(start, TZ, "h:mm aa");

  return (
    <Link
      href={`/events/${ev.slug}`}
      className={`group/card snap-start shrink-0 w-[280px] sm:w-[320px] flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${past ? "opacity-50 grayscale" : ""}`}
      style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}
    >
      {/* Cover */}
      <div className="relative w-full h-44 shrink-0 overflow-hidden">
        <Image
          src={ev.coverImageUrl ?? "/images/placeholders/event-cover-1.svg"}
          alt={ev.title}
          fill
          sizes="320px"
          className="object-cover transition-transform duration-500 group-hover/card:scale-110"
        />
        {/* Date badge */}
        <span
          className="absolute top-3 left-3 inline-flex items-center text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full"
          style={{ background: "var(--ubasti-cream)", color: "var(--ubasti-ink)", boxShadow: "0 2px 8px rgba(44,46,31,0.18)" }}
        >
          {dayStr}
        </span>
        {ev.priceInr !== null && ev.priceInr !== undefined && (
          <span
            className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: ev.priceInr === 0 ? "var(--ubasti-success)" : "var(--ubasti-mustard)",
              color: ev.priceInr === 0 ? "white" : "var(--ubasti-ink)",
            }}
          >
            {ev.priceInr === 0 ? "Free" : `₹${ev.priceInr}`}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <span className="text-xs font-medium" style={{ color: "var(--ubasti-mustard)" }}>{time}</span>
        <h3 className="text-xl leading-snug line-clamp-2" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          {ev.title}
        </h3>
        {ev.description && (
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--ubasti-sage)" }}>
            {ev.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          {ev.location ? (
            <span className="text-xs truncate" style={{ color: "var(--ubasti-sage)" }}>📍 {ev.location}</span>
          ) : <span />}
          <span className="text-sm font-medium group-hover/card:underline shrink-0 ml-2" style={{ color: "var(--ubasti-olive-dark)" }}>
            Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
