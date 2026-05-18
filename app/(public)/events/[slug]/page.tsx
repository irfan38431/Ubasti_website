import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { events, eventRegistrations } from "@/lib/db/schema";
import { and, eq, count } from "drizzle-orm";
import { TiptapRenderer } from "@/lib/cms/tiptap-render";
import { formatInTimeZone } from "date-fns-tz";
import { Suspense } from "react";
import { RegisterButton } from "./RegisterButton";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

const TZ = "Asia/Kolkata";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const [row] = await db.select({
      title: events.title,
      description: events.description,
      coverImageUrl: events.coverImageUrl,
      startsAt: events.startsAt,
      updatedAt: events.updatedAt,
    }).from(events).where(and(eq(events.slug, slug), eq(events.isPublished, true))).limit(1);

    if (row) {
      return buildMetadata({
        title: row.title,
        description: row.description?.slice(0, 155) ?? "Join us at Ubasti Cat Cafe for this event in Chennai.",
        path: `/events/${slug}`,
        image: row.coverImageUrl ? { url: row.coverImageUrl, alt: row.title } : undefined,
        type: "article",
        publishedTime: new Date(row.startsAt).toISOString(),
        modifiedTime: row.updatedAt?.toISOString(),
      });
    }
  } catch {}
  return buildMetadata({ title: "Event", description: "Ubasti Cat Cafe event.", path: `/events/${slug}` });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  let event: typeof events.$inferSelect | null = null;
  let regCount = 0;
  try {
    const [row] = await db.select().from(events)
      .where(and(eq(events.slug, slug), eq(events.isPublished, true))).limit(1);
    event = row ?? null;
    if (event?.capacity) {
      const [{ value }] = await db.select({ value: count() })
        .from(eventRegistrations)
        .where(and(eq(eventRegistrations.eventId, event.id), eq(eventRegistrations.status, "confirmed")));
      regCount = Number(value);
    }
  } catch {}

  if (!event) notFound();

  const start  = new Date(event.startsAt);
  const end    = new Date(event.endsAt);
  const isFree = !event.priceInr || event.priceInr === 0;
  const isFull = !!event.capacity && regCount >= event.capacity;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://ubasticats.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "Event",
    name:       event.title,
    description: event.description ?? "",
    startDate:  new Date(event.startsAt).toISOString(),
    endDate:    new Date(event.endsAt).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location ?? "Ubasti Cat Cafe & Lounge",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    },
    image: event.coverImageUrl ? [event.coverImageUrl] : [`${appUrl}/og/default.png`],
    organizer: { "@id": `${appUrl}/#business` },
    offers: event.priceInr
      ? {
          "@type": "Offer",
          url: `${appUrl}/events/${slug}`,
          price: event.priceInr,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[320px]">
        <Image src={event.coverImageUrl ?? "/images/placeholders/event-cover-1.svg"}
          alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: "var(--ubasti-overlay)" }} />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-3xl">
          <span className="inline-flex items-center text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full w-fit mb-4"
            style={{ background: isFree ? "var(--ubasti-success)" : "var(--ubasti-mustard)", color: isFree ? "white" : "var(--ubasti-ink)" }}>
            {isFree ? "Free Entry" : `₹${event.priceInr}`}
          </span>
          <h1 className="text-4xl md:text-5xl leading-tight mb-3"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}>
            {event.title}
          </h1>
          <p className="text-sm" style={{ color: "var(--ubasti-cream)", opacity: 0.85 }}>
            {formatInTimeZone(start, TZ, "EEEE, d MMMM yyyy")} · {formatInTimeZone(start, TZ, "h:mm aa")} – {formatInTimeZone(end, TZ, "h:mm aa")}
          </p>
        </div>
      </div>

      {/* Body + sidebar */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Rich text body */}
          <div className="lg:col-span-2">
            {event.description && (
              <p className="text-xl mb-8 pb-8 leading-relaxed"
                style={{ fontFamily: "var(--font-caveat)", color: "var(--ubasti-sage)", fontSize: "1.3rem", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                {event.description}
              </p>
            )}
            {event.bodyRichtext && (
              <TiptapRenderer content={
                (typeof event.bodyRichtext === "string"
                  ? JSON.parse(event.bodyRichtext)
                  : event.bodyRichtext) as unknown as Record<string, unknown>
              } />
            )}
            <Link href="/events" className="inline-block mt-10 text-sm font-medium hover:underline"
              style={{ color: "var(--ubasti-olive-dark)" }}>
              ← Back to Events
            </Link>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Date card */}
            <div className="rounded-2xl p-5 flex flex-col gap-2"
              style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>Date & Time</p>
              <p className="font-medium" style={{ color: "var(--ubasti-ink)" }}>
                {formatInTimeZone(start, TZ, "EEEE, d MMMM yyyy")}
              </p>
              <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
                {formatInTimeZone(start, TZ, "h:mm aa")} – {formatInTimeZone(end, TZ, "h:mm aa")} IST
              </p>
            </div>

            {/* Location */}
            <div className="rounded-2xl p-5 flex flex-col gap-1"
              style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>Location</p>
              <p className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
                {event.location ?? "Ubasti Lounge, Chennai"}
              </p>
            </div>

            {/* Capacity */}
            {event.capacity && (
              <div className="rounded-2xl p-5 flex flex-col gap-1"
                style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>Capacity</p>
                <p className="text-sm" style={{ color: isFull ? "var(--ubasti-danger)" : "var(--ubasti-ink)" }}>
                  {isFull ? "Fully booked" : `${regCount} of ${event.capacity} spots filled`}
                </p>
              </div>
            )}

            {/* Register */}
            {event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full font-medium text-sm transition-opacity hover:opacity-90"
                style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
              >
                Register via Google Forms →
              </a>
            ) : (
              <Suspense fallback={null}>
                <RegisterButton
                  eventSlug={slug}
                  isFull={isFull}
                  isFree={isFree}
                  priceInr={event.priceInr}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
