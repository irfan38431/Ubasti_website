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
        {/* Top-right: cat-yawn (largest) */}
        <motion.div
          className="absolute top-4 right-[3%] md:right-[8%] w-32 h-32 md:w-56 md:h-56 opacity-75 hidden sm:block"
          style={{ transform: "rotate(-8deg)", zIndex: 0 }}
          aria-hidden="true"
          animate={shouldReduce ? {} : { y: [0, -6, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/decorative/cat_outline_1.png"
            alt=""
            fill
            className="object-contain"
            style={{ mixBlendMode: "screen" }}
          />
        </motion.div>

        {/* Bottom-left: cat-outline */}
        <motion.div
          className="absolute bottom-4 left-[3%] md:left-[8%] w-28 h-28 md:w-52 md:h-52 opacity-70"
          style={{ transform: "rotate(6deg)", zIndex: 0 }}
          aria-hidden="true"
          animate={shouldReduce ? {} : { y: [0, -6, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
          transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/decorative/cat_outline_2.png"
            alt=""
            fill
            className="object-contain"
            style={{ mixBlendMode: "screen" }}
          />
        </motion.div>

        {/* Right-center: cat-pspsps (medium, rotated) */}
        <motion.div
          className="absolute bottom-8 right-[4%] md:right-[12%] w-24 h-24 md:w-44 md:h-44 opacity-65 hidden sm:block"
          style={{ transform: "rotate(12deg)", zIndex: 0 }}
          aria-hidden="true"
          animate={shouldReduce ? {} : { y: [0, -6, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/decorative/cat_outline_3.png"
            alt=""
            fill
            className="object-contain"
            style={{ mixBlendMode: "screen" }}
          />
        </motion.div>

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
