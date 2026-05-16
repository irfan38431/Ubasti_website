import Image from "next/image";

export function Hero() {
  return (
    <section
      className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden min-h-[60vh]"
      style={{ background: "var(--ubasti-paper)" }}
    >
      {/* Decorative illustrations — absolutely positioned, aria-hidden */}
      <div
        className="absolute top-8 left-[6%] md:left-[10%] w-24 h-24 md:w-36 md:h-36 opacity-70 hidden sm:block"
        style={{ transform: "rotate(-12deg)" }}
        aria-hidden="true"
      >
        <Image src="/images/decorative/cat-yawn.svg" alt="" fill className="object-contain" />
      </div>

      <div
        className="absolute top-4 right-[8%] md:right-[14%] w-20 h-20 md:w-32 md:h-32 opacity-65 hidden sm:block"
        style={{ transform: "rotate(8deg)" }}
        aria-hidden="true"
      >
        <Image src="/images/decorative/cat-pspsps.svg" alt="" fill className="object-contain" />
      </div>

      <div
        className="absolute bottom-10 left-[4%] md:left-[8%] w-16 h-16 md:w-28 md:h-28 opacity-60"
        style={{ transform: "rotate(6deg)" }}
        aria-hidden="true"
      >
        <Image src="/images/decorative/sparkles.svg" alt="" fill className="object-contain" />
      </div>

      <div
        className="absolute bottom-6 right-[5%] md:right-[10%] w-20 h-20 md:w-32 md:h-32 opacity-65 hidden sm:block"
        style={{ transform: "rotate(-6deg)" }}
        aria-hidden="true"
      >
        <Image src="/images/decorative/cat-outline.svg" alt="" fill className="object-contain" />
      </div>

      <div
        className="absolute top-1/2 left-2 w-14 h-14 md:w-20 md:h-20 opacity-50 -translate-y-1/2 hidden md:block"
        style={{ transform: "translateY(-50%) rotate(15deg)" }}
        aria-hidden="true"
      >
        <Image src="/images/decorative/sparkles.svg" alt="" fill className="object-contain" />
      </div>

      {/* Headline */}
      <div className="relative z-10 text-center px-6">
        <h1
          className="text-5xl md:text-7xl lg:text-8xl leading-[1.05]"
          style={{
            fontFamily: "var(--font-cinzel)",
            color: "var(--ubasti-ink)",
            fontWeight: 700,
          }}
        >
          Chennai&apos;s furrst<br />cat lounge
        </h1>
      </div>
    </section>
  );
}
