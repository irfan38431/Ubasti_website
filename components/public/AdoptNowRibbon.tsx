"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const BG_COLORS = [
  "#c9a99c", // blush
  "#5a6b4e", // sage
  "#c9a99c", // blush
  "#3a4230", // olive-dark
];

export function AdoptNowRibbon() {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  if (pathname === "/adoption") return null;

  return (
    <div className="hidden md:block fixed left-0 top-1/2 z-40" style={{ transform: "translateY(-50%)" }}>
      {/* Animated cat pointer — appears to the right of the ribbon */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ right: -36, top: "50%", transform: "translateY(-50%)", width: 32, height: 32 }}
        aria-hidden="true"
        animate={shouldReduce ? {} : {
          rotate: [0, 15, -5, 10, 0],
          y: [0, -4, 0, -2, 0],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/images/decorative/cat-outline.svg"
          alt=""
          fill
          className="object-contain"
          style={{ filter: "invert(0.3) sepia(0.5)" }}
        />
      </motion.div>

      {/* Ribbon button */}
      <motion.div
        animate={shouldReduce ? {} : {
          backgroundColor: BG_COLORS,
          opacity: [0.9, 0.7, 1, 0.8, 0.9],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          borderRadius: "0 0.75rem 0.75rem 0",
          boxShadow: "2px 0 12px rgba(44,46,31,0.18)",
        }}
      >
        <Link
          href="/adoption"
          aria-label="Adopt Now"
          className="flex items-center justify-center"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            color: "var(--ubasti-cream)",
            padding: "1rem 0.6rem",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "var(--font-inter)",
          }}
        >
          Adopt Now
        </Link>
      </motion.div>
    </div>
  );
}
