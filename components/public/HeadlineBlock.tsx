"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ScallopDivider } from "@/components/decorative/ScallopDivider";

export function HeadlineBlock() {
  const shouldReduce = useReducedMotion();

  return (
    <>
      <section
        className="relative overflow-hidden py-28 md:py-40 flex items-center justify-center"
        style={{ background: "var(--ubasti-ink)" }}
      >
        {/* Top-left: sparkles (smaller) */}
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

      {/* Wavy transition into cream about section */}
      <ScallopDivider
        top="var(--ubasti-ink)"
        bottom="var(--ubasti-cream)"
        flip
      />
    </>
  );
}
