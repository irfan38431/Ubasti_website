import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function BookingCta() {
  return (
    <section
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: "var(--ubasti-blush-light)" }}
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

            {/* Brand wordmark */}
            <div className="relative w-full max-w-[560px] h-28 md:h-36">
              <Image
                src="/images/decorative/ubasti-lounge-wordmark.svg"
                alt="Ubasti Cat Cafe & Lounge"
                fill
                className="object-contain"
              />
            </div>

            {/* Feature photo */}
            <div className="relative w-full max-w-[600px] rounded-2xl overflow-hidden aspect-video">
              <Image
                src="/images/placeholders/offering-community.svg"
                alt="Relaxing at Ubasti"
                fill
                className="object-cover"
                sizes="(max-width: 600px) 100vw, 600px"
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
