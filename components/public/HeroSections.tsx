"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { HERO, OFFERINGS, SLIDESHOW_IMAGES } from "@/lib/replacements";

/** Photo for the "Book your snuggle time" panel — swap the index for a different guest+cat shot. */
const SNUGGLE_IMG = SLIDESHOW_IMAGES[3] ?? HERO.lounge;

/** Builds the SVG path for a cream-coloured scalloped awning strip.
 *  Flat top edge (flatH px tall) followed by downward half-circle bumps. */
function scallopPath(w: number, flatH: number, n: number): string {
  const segW = w / n;
  const r = segW / 2;
  let d = `M0,0 L${w},0 L${w},${flatH}`;
  for (let i = n - 1; i >= 0; i--) {
    d += ` A${r},${r} 0 0 1 ${i * segW},${flatH}`;
  }
  return d + " Z";
}

const TILES = [
  { label: "COFFEE",  href: "/",         img: OFFERINGS.coffee  },
  { label: "CATS",    href: "/kitties",   img: OFFERINGS.cats    },
  { label: "CUDDLES", href: "/boarding",  img: OFFERINGS.cuddles },
];

export function HeroSections() {
  const textRef   = useRef<HTMLDivElement>(null);
  const loungeRef = useRef<HTMLElement>(null);
  const rafRef    = useRef<number>(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!textRef.current || !loungeRef.current) return;
        const rect     = loungeRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
        textRef.current.style.transform = `translateY(${progress * -50}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [shouldReduce]);

  return (
    <>
      {/* Wave clip definition reused by BookPanel */}
      <svg
        width="0" height="0"
        aria-hidden focusable="false"
        style={{ position: "absolute", overflow: "hidden" }}
      >
        <defs>
          <clipPath id="ubasti-wave-top" clipPathUnits="objectBoundingBox">
            <path d="M0,0.055 C0.125,0 0.25,0.11 0.375,0.055 C0.5,0 0.625,0.11 0.75,0.055 C0.875,0 1,0.11 1,0.055 L1,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ── Panel 1: Offerings ──────────────────────────────── z:3 ── */}
      <section
        style={{
          position: "sticky",
          top: 0,
          height: "70vh",
          zIndex: 3,
          background: "var(--ubasti-cream)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(0.75rem, 1.5vh, 1.25rem)",
        }}
      >
        {/* Decorative whisker-and-starburst ornament — an artful divider that
           introduces the section. Same motif used under the offering tiles,
           so it reads as native to the brand and stays tied to the heading. */}
        <svg
          viewBox="0 0 120 48"
          aria-hidden
          style={{
            width: "clamp(130px, 22vw, 230px)",
            color: "var(--ubasti-olive-dark)",
            opacity: 0.8,
          }}
        >
          <g stroke="currentColor" strokeWidth="1.2" fill="none">
            <line x1="60" y1="6" x2="60" y2="34" />
            <line x1="46" y1="20" x2="74" y2="20" />
            <line x1="50" y1="10" x2="70" y2="30" />
            <line x1="70" y1="10" x2="50" y2="30" />
            <path d="M54,20 Q40,14 28,20 Q20,24 14,20" strokeLinecap="round" />
            <path d="M38,16 Q34,10 30,14" strokeLinecap="round" />
            <path d="M28,20 Q24,14 20,18" strokeLinecap="round" />
            <path d="M66,20 Q80,14 92,20 Q100,24 106,20" strokeLinecap="round" />
            <path d="M82,16 Q86,10 90,14" strokeLinecap="round" />
            <path d="M92,20 Q96,14 100,18" strokeLinecap="round" />
            <circle cx="14" cy="20" r="1.6" fill="currentColor" />
            <circle cx="106" cy="20" r="1.6" fill="currentColor" />
          </g>
        </svg>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            color: "var(--ubasti-blush)",
            fontSize: "clamp(2rem, 5.5vw, 4rem)",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1,
            margin: 0,
          }}
        >
          Our Offerings
        </h2>

        {/* Arch tiles */}
        <div
          style={{
            display: "flex",
            gap: "clamp(1.25rem, 4vw, 4rem)",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "0 1.5rem",
          }}
        >
          {TILES.map(({ label, href, img }) => (
            <Link
              key={label}
              href={href}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, textDecoration: "none" }}
            >
              {/* Arch */}
              <div
                style={{
                  width: "clamp(110px, 17vw, 210px)",
                  height: "clamp(170px, 28vw, 330px)",
                  borderRadius: "999px 999px 0 0",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 8px 32px rgba(44,46,31,0.18)",
                }}
              >
                <Image src={img} alt={label} fill className="object-cover" sizes="(max-width:768px) 40vw, 25vw" />
                {/* Label overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(0deg, rgba(20,22,14,0.72) 0%, transparent 55%)",
                    paddingBottom: "1rem",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    minHeight: "45%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      color: "#fff",
                      fontSize: "clamp(0.65rem, 1.6vw, 0.95rem)",
                      letterSpacing: "0.22em",
                      fontWeight: 700,
                    }}
                  >
                    {label}
                  </span>
                </div>
              </div>

              {/* Decorative ornament */}
              <svg
                viewBox="0 0 120 48"
                aria-hidden
                style={{ width: "clamp(80px, 14vw, 160px)", marginTop: "0.25rem", color: "var(--ubasti-ink)", opacity: 0.7 }}
              >
                <g stroke="currentColor" strokeWidth="1.2" fill="none">
                  <line x1="60" y1="10" x2="60" y2="30" />
                  <line x1="50" y1="20" x2="70" y2="20" />
                  <line x1="53" y1="13" x2="67" y2="27" />
                  <line x1="67" y1="13" x2="53" y2="27" />
                  <path d="M54,20 Q40,14 28,20 Q20,24 14,20" strokeLinecap="round" />
                  <path d="M38,16 Q34,10 30,14" strokeLinecap="round" />
                  <path d="M28,20 Q24,14 20,18" strokeLinecap="round" />
                  <path d="M66,20 Q80,14 92,20 Q100,24 106,20" strokeLinecap="round" />
                  <path d="M82,16 Q86,10 90,14" strokeLinecap="round" />
                  <path d="M92,20 Q96,14 100,18" strokeLinecap="round" />
                  <circle cx="14" cy="20" r="1.5" fill="currentColor" />
                  <circle cx="106" cy="20" r="1.5" fill="currentColor" />
                </g>
              </svg>
            </Link>
          ))}
        </div>

      </section>

      {/* ── Panel 2: Lounge Banner ──────────────────────────── z:4 ── */}
      <section
        ref={loungeRef}
        style={{
          position: "sticky",
          top: 0,
          height: "70vh",
          zIndex: 4,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Cream scallop — hangs down from Panel 1 into the lounge photo */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, lineHeight: 0, zIndex: 5 }}>
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "clamp(45px, 6vw, 75px)" }}
            aria-hidden
          >
            <path d={scallopPath(1440, 0, 12)} fill="var(--ubasti-cream)" />
          </svg>
        </div>
        <Image
          src={HERO.lounge}
          alt="Ubasti cat lounge interior"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(20,22,14,0.3) 0%, rgba(20,22,14,0.62) 100%)",
          }}
          aria-hidden
        />
        <div
          ref={textRef}
          style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 1.5rem" }}
        >
          {/* Frosted glass card — matches the home-top logo card */}
          <div
            className="inline-flex items-center justify-center px-10 py-8 md:px-16 md:py-10"
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
            <h2
              style={{
                fontFamily: "var(--font-cinzel)",
                color: "var(--ubasti-cream)",
                fontSize: "clamp(1.9rem, 6.5vw, 5rem)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              A LOUNGE FOR<br />COOL CATS
            </h2>
          </div>
        </div>
      </section>

      {/* ── Panel 3: Book your snuggle time ─────────────────── z:5 ── */}
      <section
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          zIndex: 5,
          clipPath: "url(#ubasti-wave-top)",
          /* Overlap the lounge panel so the wave sits on the photo, not a band */
          marginTop: "-7rem",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          /* Soft blush bokeh — built from the brand palette */
          background: `
            radial-gradient(circle at 12% 24%, rgba(255,255,255,0.55) 0, rgba(255,255,255,0) 9%),
            radial-gradient(circle at 80% 12%, rgba(255,255,255,0.45) 0, rgba(255,255,255,0) 7%),
            radial-gradient(circle at 92% 58%, rgba(255,255,255,0.5) 0, rgba(255,255,255,0) 8%),
            radial-gradient(circle at 28% 82%, rgba(255,255,255,0.4) 0, rgba(255,255,255,0) 11%),
            radial-gradient(circle at 55% 38%, rgba(255,255,255,0.32) 0, rgba(255,255,255,0) 6%),
            radial-gradient(circle at 6% 66%, rgba(255,255,255,0.42) 0, rgba(255,255,255,0) 7%),
            radial-gradient(circle at 70% 88%, rgba(228,182,174,0.55) 0, rgba(228,182,174,0) 9%),
            linear-gradient(135deg, var(--ubasti-blush-light) 0%, var(--ubasti-blush) 100%)
          `,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center w-full max-w-[1080px] px-6 md:px-10 py-16">
          {/* Left — copy + CTA */}
          <div className="flex flex-col gap-6 text-center md:text-left order-2 md:order-1">
            <h2
              style={{
                fontFamily: "var(--font-cinzel)",
                color: "var(--ubasti-ink)",
                fontSize: "clamp(2.1rem, 5.5vw, 4.25rem)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              BOOK YOUR<br />SNUGGLE<br />TIME NOW
            </h2>
            <p
              className="mx-auto md:mx-0"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: "var(--ubasti-olive-dark)",
                fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)",
                lineHeight: 1.4,
                maxWidth: "32ch",
              }}
            >
              Come hang out with our little fur babies, and maybe try to adopt one?!
            </p>
            <div className="flex justify-center md:justify-start">
              <Link
                href="/grooming"
                style={{
                  display: "inline-block",
                  padding: "1rem 3.25rem",
                  background: "var(--ubasti-ink)",
                  color: "var(--ubasti-cream)",
                  borderRadius: "9999px",
                  fontFamily: "var(--font-cinzel)",
                  letterSpacing: "0.18em",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                BOOK NOW
              </Link>
            </div>
          </div>

          {/* Right — arch-framed photo */}
          <div className="relative mx-auto w-full max-w-[400px] order-1 md:order-2" style={{ aspectRatio: "3 / 4" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "190px 28px 28px 28px",
                overflow: "hidden",
                boxShadow: "0 20px 55px rgba(44,46,31,0.28)",
              }}
            >
              <Image
                src={SNUGGLE_IMG}
                alt="A guest snuggling a rescue cat at Ubasti"
                fill
                className="object-cover"
                sizes="(max-width:768px) 80vw, 400px"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
