"use client";

import Image from "next/image";
import { ParallaxHero } from "@/components/public/ParallaxHero";
import { BRAND, HERO } from "@/lib/replacements";

export function Hero() {
  return (
    <ParallaxHero
      className="flex items-center justify-center"
      style={{
        height: "55vh",
        zIndex: 1,
      }}
    >
      {/* Background image — oversized so translate has travel room */}
      <div
        data-parallax-bg
        className="absolute inset-x-0"
        style={{ top: "-20%", height: "140%", zIndex: 0 }}
      >
        <Image
          src={HERO.banner}
          alt="Cozy interior of Ubasti Cat Cafe"
          fill
          className="object-cover"
          style={{ objectPosition: "center 100%" }}
          priority
          sizes="100vw"
        />
      </div>

      {/* Dark overlay — stays fixed over the bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,22,14,0.3) 0%, rgba(20,22,14,0.5) 100%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Frosted glass logo card — floats independently on scroll */}
      <div
        data-parallax-text
        className="relative flex items-center justify-center px-10 py-8 md:px-16 md:py-10"
        style={{
          zIndex: 2,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: "1.5rem",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <div className="relative" style={{ width: 280, height: 140 }}>
          <Image
            src={BRAND.logoGreenPink}
            alt={BRAND.name}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </ParallaxHero>
  );
}
