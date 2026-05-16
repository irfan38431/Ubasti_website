import { Suspense } from "react";
import { EventsList } from "./EventsList";
import { SectionTitle } from "@/components/ui/SectionTitle";
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
        className="py-20 md:py-28 relative overflow-hidden text-center"
        style={{ background: "var(--ubasti-sage)" }}
      >
        <div className="absolute top-6 right-10 hidden md:block">
          <Badge variant="purrfect-partners" size={100} rotate={8} />
        </div>
        <div className="max-w-[1280px] mx-auto px-6">
          <SectionTitle
            eyebrow="What's On"
            title="Calendar of Events"
            subtitle="what's happening at the lounge"
          />
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
