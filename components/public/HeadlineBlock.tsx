import Image from "next/image";
import { ScallopDivider } from "@/components/decorative/ScallopDivider";

export function HeadlineBlock() {
  return (
    <>
      <section
        className="relative overflow-hidden py-28 md:py-40 flex items-center justify-center"
        style={{ background: "var(--ubasti-ink)" }}
      >
        {/* Top-right: cat-yawn (largest) */}
        <div
          className="absolute top-4 right-[3%] md:right-[8%] w-32 h-32 md:w-56 md:h-56 opacity-75 hidden sm:block"
          style={{ transform: "rotate(-8deg)", zIndex: 0 }}
          aria-hidden="true"
        >
          <Image
            src="/images/decorative/cat-yawn.svg"
            alt=""
            fill
            className="object-contain"
            style={{ filter: "invert(1) brightness(1.6)" }}
          />
        </div>

        {/* Bottom-left: cat-outline */}
        <div
          className="absolute bottom-4 left-[3%] md:left-[8%] w-28 h-28 md:w-52 md:h-52 opacity-70"
          style={{ transform: "rotate(6deg)", zIndex: 0 }}
          aria-hidden="true"
        >
          <Image
            src="/images/decorative/cat-outline.svg"
            alt=""
            fill
            className="object-contain"
            style={{ filter: "invert(1) brightness(1.6)" }}
          />
        </div>

        {/* Right-center: cat-pspsps (medium, rotated) */}
        <div
          className="absolute bottom-8 right-[4%] md:right-[12%] w-24 h-24 md:w-44 md:h-44 opacity-65 hidden sm:block"
          style={{ transform: "rotate(12deg)", zIndex: 0 }}
          aria-hidden="true"
        >
          <Image
            src="/images/decorative/cat-pspsps.svg"
            alt=""
            fill
            className="object-contain"
            style={{ filter: "invert(1) brightness(1.6)" }}
          />
        </div>

        {/* Top-left: sparkles (smaller) */}
        <div
          className="absolute top-8 left-[4%] md:left-[10%] w-20 h-20 md:w-36 md:h-36 opacity-60"
          style={{ transform: "rotate(-5deg)", zIndex: 0 }}
          aria-hidden="true"
        >
          <Image
            src="/images/decorative/sparkles.svg"
            alt=""
            fill
            className="object-contain"
            style={{ filter: "invert(1) brightness(1.6)" }}
          />
        </div>

        {/* Headline */}
        <div className="relative z-10 text-center px-6">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl leading-[1.05]"
            style={{
              fontFamily: "var(--font-cinzel)",
              color: "var(--ubasti-cream)",
              fontWeight: 700,
            }}
          >
            Chennai&apos;s furrst<br />cat lounge
          </h1>
        </div>
      </section>

      {/* Wavy transition into cream about section */}
      <ScallopDivider
        top="var(--ubasti-ink)"
        bottom="var(--ubasti-cream)"
        flip
      />
    </>
  );
}
