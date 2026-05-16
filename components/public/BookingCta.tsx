import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function BookingCta() {
  return (
    <section
      className="py-20 md:py-28 text-center"
      style={{ background: "var(--ubasti-sage)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-6">
            <h2
              className="text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}
            >
              Ready for some purrfect company?
            </h2>
            <p
              className="text-lg max-w-md"
              style={{ fontFamily: "var(--font-caveat)", color: "var(--ubasti-cream)", fontSize: "1.25rem", opacity: 0.9 }}
            >
              book a 60-minute lounge session — just you, a cup, and the cats
            </p>
            <Link
              href="/book"
              className="inline-flex h-14 items-center px-10 rounded-full font-medium text-base transition-opacity hover:opacity-90 mt-2"
              style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}
            >
              Book Now — it&apos;s free
            </Link>
            <p className="text-xs opacity-60" style={{ color: "var(--ubasti-cream)" }}>
              Pay on arrival · Cancel up to 24h before · No account needed to browse
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
