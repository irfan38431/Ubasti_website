"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function HeadlineBlock() {
  const shouldReduce = useReducedMotion();

  return (
    <>
      {/* SVG clip-path definition — must appear before the element that references it */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", overflow: "hidden" }}
      >
        <defs>
          <clipPath id="ubasti-wave-top" clipPathUnits="objectBoundingBox">
            {/* Two wave crests across width; amplitude 0–0.055 (≈ 0–50px on 900px height) */}
            <path d="M0,0.055 C0.125,0 0.25,0.11 0.375,0.055 C0.5,0 0.625,0.11 0.75,0.055 C0.875,0 1,0.11 1,0.055 L1,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <section
        className="relative flex items-center justify-center"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          minHeight: "100vh",
          background: "var(--ubasti-ink)",
          clipPath: "url(#ubasti-wave-top)",
          overflow: "hidden",
        }}
      >
        {/* Sparkles — top-left */}
        <motion.div
          className="absolute top-8 left-[4%] md:left-[10%] w-20 h-20 md:w-36 md:h-36 opacity-60"
          style={{ transform: "rotate(-5deg)", zIndex: 0 }}
          aria-hidden="true"
          animate={shouldReduce ? {} : { opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/decorative/sparkles.svg"
            alt=""
            fill
            className="object-contain"
            style={{ filter: "invert(1) brightness(1.6)" }}
          />
        </motion.div>

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
    </>
  );
}
