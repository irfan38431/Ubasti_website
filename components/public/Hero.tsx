"use client";

import Image from "next/image";
import { ScallopDivider } from "@/components/decorative/ScallopDivider";

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
          src="/images/hero-banner.png"
          alt="Cozy interior of Ubasti Cat Cafe"
          fill
          className="object-cover"
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
          className="relative z-10 flex flex-col items-center justify-center gap-3 px-10 py-8 md:px-16 md:py-10"
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
          {/* Brand mark (circular logo) */}
          <div
            className="relative"
            style={{ width: 72, height: 72 }}
          >
            <Image
              src="/images/decorative/ubasti-brand-mark.svg"
              alt=""
              fill
              className="object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
              aria-hidden="true"
            />
          </div>

          {/* Wordmark */}
          <div
            className="relative"
            style={{ width: 260, height: 80 }}
          >
            <Image
              src="/images/decorative/ubasti-lounge-wordmark.svg"
              alt="Ubasti — Cat Cafe & Lounge"
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
