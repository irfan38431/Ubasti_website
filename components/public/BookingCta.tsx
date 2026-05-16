import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArchImage } from "@/components/decorative/ArchImage";

export function BookingCta() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ background: "var(--ubasti-paper)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-8 text-center">
            <h2
              className="text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
            >
              Book your snuggle time now
            </h2>

            {/* Arch-framed photograph */}
            <div className="relative w-full max-w-[400px]" style={{ aspectRatio: "3/4", maxHeight: "480px" }}>
              <ArchImage
                src="/images/placeholders/offering-coffee.svg"
                alt="A cozy session at Ubasti"
                className="w-full h-full"
              />
            </div>

            <p
              className="text-xl max-w-md"
              style={{ fontFamily: "var(--font-caveat)", color: "var(--ubasti-sage)", fontSize: "1.3rem" }}
            >
              Come hang out with our little fur babies, and maybe try to adopt one?!
            </p>

            <Link
              href="/book"
              className="inline-flex h-14 items-center px-10 rounded-full font-medium text-base transition-opacity hover:opacity-90"
              style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
            >
              Book Now
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
