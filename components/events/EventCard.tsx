import Image from "next/image";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";

interface Props {
  slug:          string;
  title:         string;
  description?:  string | null;
  coverImageUrl?: string | null;
  startsAt:      Date | string;
  endsAt:        Date | string;
  location?:     string | null;
  priceInr?:     number | null;
  capacity?:     number | null;
  past?:         boolean;
}

const TZ = "Asia/Kolkata";

export function EventCard({ slug, title, description, coverImageUrl, startsAt, location, priceInr, past }: Props) {
  const start  = new Date(startsAt);
  const dayStr = formatInTimeZone(start, TZ, "EEE, d MMM");
  const time   = formatInTimeZone(start, TZ, "h:mm aa");

  return (
    <Link
      href={`/events/${slug}`}
      className={`group flex flex-col sm:flex-row gap-0 rounded-2xl overflow-hidden transition-shadow hover:shadow-lg ${past ? "opacity-50 grayscale" : ""}`}
      style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}
    >
      {/* Cover image */}
      <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
        <Image
          src={coverImageUrl ?? "/images/placeholders/event-cover-1.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center gap-3 p-5 flex-1">
        {/* Date pill */}
        <span
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide w-fit px-3 py-1 rounded-full"
          style={{ background: "var(--ubasti-blush-light)", color: "var(--ubasti-ink)" }}
        >
          {dayStr} · {time}
        </span>

        <h3
          className="text-xl leading-snug"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
        >
          {title}
        </h3>

        {description && (
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--ubasti-sage)" }}>
            {description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-1">
          {location && (
            <span className="text-xs" style={{ color: "var(--ubasti-sage)" }}>📍 {location}</span>
          )}
          {priceInr !== null && priceInr !== undefined && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: priceInr === 0 ? "var(--ubasti-success)" : "var(--ubasti-mustard)", color: priceInr === 0 ? "white" : "var(--ubasti-ink)" }}
            >
              {priceInr === 0 ? "Free" : `₹${priceInr}`}
            </span>
          )}
          <span
            className="ml-auto text-sm font-medium group-hover:underline"
            style={{ color: "var(--ubasti-olive-dark)" }}
          >
            Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
