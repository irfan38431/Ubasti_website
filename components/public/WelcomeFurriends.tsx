import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function WelcomeFurriends() {
  return (
    <section
      className="py-16 md:py-24 overflow-hidden"
      style={{ background: "var(--ubasti-cream)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="relative flex flex-col items-center gap-8">
            {/* Heading with sparkle decoration */}
            <div className="relative">
              <h2
                className="text-4xl md:text-5xl text-center"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
              >
                Welcome!              </h2>
              {/* Sparkles near heading */}
              <div
                className="absolute -top-6 -right-10 w-12 h-12 md:w-16 md:h-16 opacity-60 hidden sm:block"
                style={{ transform: "rotate(15deg)" }}
                aria-hidden="true"
              >
                <Image src="/images/decorative/sparkles.svg" alt="" fill className="object-contain" />
              </div>
            </div>

            {/* Feature photograph */}
            <div className="relative w-full max-w-[800px] rounded-2xl overflow-hidden aspect-[16/9]">
              <Image
                src="/images/placeholders/offering-cats.svg"
                alt="Cats lounging at Ubasti Cat Cafe"
                fill
                className="object-cover"
                sizes="(max-width: 800px) 100vw, 800px"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
