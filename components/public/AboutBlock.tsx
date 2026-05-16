import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArchImage } from "@/components/decorative/ArchImage";
import { WavyUnderline } from "@/components/decorative/WavyUnderline";

export function AboutBlock() {
  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: "var(--ubasti-cream)" }}
    >
      {/* Cat-outline peeking from the top (overlaps the scallop divider above) */}
      <div
        className="absolute -top-16 left-[5%] w-28 h-28 md:w-40 md:h-40 opacity-60 hidden md:block"
        style={{ transform: "rotate(5deg)", zIndex: 1 }}
        aria-hidden="true"
      >
        <Image
          src="/images/decorative/cat-outline.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Sparkles top-right */}
      <div
        className="absolute top-8 right-[4%] w-16 h-16 md:w-24 md:h-24 opacity-55 hidden sm:block"
        style={{ transform: "rotate(10deg)", zIndex: 0 }}
        aria-hidden="true"
      >
        <Image
          src="/images/decorative/sparkles.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left — text */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h2
                  className="text-4xl md:text-5xl"
                  style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
                >
                  Welcome, furriends
                </h2>
                <WavyUnderline color="var(--ubasti-blush)" width={200} />
              </div>

              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "var(--ubasti-sage)", fontFamily: "var(--font-cormorant)", fontSize: "1.15rem" }}
              >
                Ubasti is a cat cafe and adoption lounge in Chennai. We believe every cat
                deserves a forever home, and every person deserves a few minutes of purring.
                Come for the coffee, stay for the cats, leave with a friend.
              </p>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "var(--ubasti-sage)", fontFamily: "var(--font-cormorant)", fontSize: "1.15rem" }}
              >
                Whether you&apos;re looking for a peaceful escape from the hustle of the city
                or simply want to unwind in the company of playful felines, our cafe is a
                space for cat lovers of every kind. Come for the coffee, stay for the cats,
                and leave with a smile (and maybe a kitty)!
              </p>
            </div>

            {/* Right — arch-framed photo */}
            <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: "520px" }}>
              <ArchImage
                src="/images/placeholders/offering-cats.svg"
                alt="A cat lounging at Ubasti"
                className="w-full h-full"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
