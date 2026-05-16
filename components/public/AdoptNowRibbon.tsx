"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export function AdoptNowRibbon() {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  if (pathname === "/adoption") return null;

  return (
    <Link
      href="/adoption"
      aria-label="Adopt Now"
      className="hidden md:flex fixed left-0 top-1/2 z-40 items-center justify-center"
      style={{
        transform: "translateY(-50%)",
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        background: "var(--ubasti-blush)",
        color: "var(--ubasti-ink)",
        padding: "1rem 0.6rem",
        borderRadius: "0 0.75rem 0.75rem 0",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontFamily: "var(--font-inter)",
        boxShadow: "2px 0 12px rgba(44,46,31,0.12)",
        transition: shouldReduce ? "none" : "opacity 0.2s",
        opacity: 0.9,
      }}
      onMouseEnter={(e) => { if (!shouldReduce) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
      onMouseLeave={(e) => { if (!shouldReduce) (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
    >
      Adopt Now
    </Link>
  );
}
