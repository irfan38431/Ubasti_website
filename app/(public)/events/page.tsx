import { Suspense } from "react";
import Image from "next/image";
import { EventsList } from "./EventsList";
import { Badge } from "@/components/ui/Badge";
import { FaqSection } from "@/components/public/FaqSection";
import { FAQ_BY_PAGE } from "@/lib/content/faqs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Events at Ubasti — Kitten Yoga, Workshops & More",
  description: "Kitten yoga, adoption drives, latte art classes, and cat-care workshops at Ubasti Cat Cafe in Chennai. Browse upcoming events.",
  path: "/events",
  keywords: ["cat cafe events chennai", "kitten yoga chennai", "cat adoption drive chennai"],
});

export const revalidate = 300;

export default function EventsPage() {
  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      {/* E1 — Hero strip */}
      <section
        className="py-24 md:py-36 relative overflow-hidden text-center"
        style={{ background: "var(--ubasti-sage)" }}
      >
        {/* Background photo */}
        <Image
          src="/images/placeholders/Calendar_hero.jpeg"
          alt="An art workshop at Ubasti Cat Cafe with a curious cat joining in"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 35%" }}
        />
        {/* Dark overlay for text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(44,46,31,0.45) 0%, rgba(44,46,31,0.6) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute top-6 right-10 hidden md:block z-10">
          <Badge variant="purrfect-partners" size={100} rotate={8} />
        </div>
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex justify-center">
          {/* Frosted glass card — matches the home-page hero */}
          <div
            className="inline-flex flex-col gap-3 items-center text-center px-10 py-8 md:px-16 md:py-10"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderRadius: "1.5rem",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <p
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--ubasti-mustard)", fontFamily: "var(--font-inter)" }}
            >
              What&apos;s On
            </p>
            <h1
              className="text-4xl md:text-6xl leading-tight"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}
            >
              Calendar of Events
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-caveat)", fontSize: "1.25rem" }}
            >
              what&apos;s happening at the lounge
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-96 animate-pulse m-8 rounded-2xl" style={{ background: "var(--ubasti-cream)" }} />}>
        <EventsList />
      </Suspense>

      {/* E5 — Private parties CTA */}
      <section className="py-16 md:py-20" style={{ background: "var(--ubasti-blush-light)" }}>
        <p className="text-center text-base" style={{ color: "var(--ubasti-ink)" }}>
          Want to host your own event?{" "}
          <a href="/private-parties" className="font-semibold underline underline-offset-2"
            style={{ color: "var(--ubasti-olive-dark)" }}>
            See our Private Parties options.
          </a>
        </p>
      </section>

      <FaqSection title="Event FAQs" items={FAQ_BY_PAGE.events} />
    </div>
  );
}
