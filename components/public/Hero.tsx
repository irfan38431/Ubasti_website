"use client";

import Image from "next/image";
import { ScallopDivider } from "@/components/decorative/ScallopDivider";
import { BRAND, HERO } from "@/lib/replacements";

export function Hero() {
  return (
    <>
      <section
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          height: "clamp(340px, 55vh, 600px)",
          minHeight: 340,
        }}
      >
        {/* Background image */}
        <Image
          src={HERO.banner}
          alt="Cozy interior of Ubasti Cat Cafe"
          fill
          className="object-cover"
          style={{ objectPosition: "center 80%" }}
          priority
          sizes="100vw"
        />

        {/* Dark overlay for contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,22,14,0.3) 0%, rgba(20,22,14,0.5) 100%)",
          }}
          aria-hidden="true"
        />


        {/* Frosted glass logo card */}
        <div
          className="relative z-10 flex items-center justify-center px-10 py-8 md:px-16 md:py-10"
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
          {/* Official Ubasti logo (symbol + text) */}
          <div
            className="relative"
            style={{ width: 280, height: 140 }}
          >
            <Image
              src={BRAND.logoGreenPink}
              alt={BRAND.name}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Wavy transition into dark headline block */}
      <ScallopDivider
        top="var(--ubasti-ink)"
        bottom="var(--ubasti-ink)"
      />
    </>
  );
}
