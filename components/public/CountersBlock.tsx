"use client";
import { useRef, useEffect, useState } from "react";
import { useInView, animate, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface CounterProps { label: string; target: number; bg: string; color: string; }

function Counter({ label, target, bg, color }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <div ref={ref} className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center"
      style={{ background: bg, color }}>
      <span className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "var(--font-cinzel)" }}>
        {value}
      </span>
      <p className="text-sm font-medium uppercase tracking-widest opacity-80">{label}</p>
    </div>
  );
}

const CAT_DECORATIONS = [
  { src: "/images/decorative/cat-outline.svg", style: { top: -32, left: -24, rotate: -12 }, dur: 4.2 },
  { src: "/images/decorative/cat-yawn.svg",    style: { top: -28, right: -20, rotate: 10 },  dur: 3.7 },
  { src: "/images/decorative/cat-pspsps.svg",  style: { bottom: -28, right: 40, rotate: 6 }, dur: 5.1 },
  { src: "/images/decorative/sparkles.svg",    style: { bottom: -24, left: 48, rotate: -8 }, dur: 2.9 },
];

interface CountersBlockProps { rescued: number; atCafe: number; adopted: number }

export function CountersBlock({ rescued, atCafe, adopted }: CountersBlockProps) {
  const shouldReduce = useReducedMotion();

  const cards = [
    { label: "Cats Rescued",     target: rescued, bg: "var(--ubasti-sage)",       color: "var(--ubasti-cream)" },
    { label: "Cats at the Cafe", target: atCafe,  bg: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" },
    { label: "Cats Adopted",     target: adopted, bg: "var(--ubasti-blush)",      color: "var(--ubasti-ink)" },
  ];

  return (
    <section className="relative py-16 md:py-24" style={{ background: "var(--ubasti-paper)" }}>
      {/* Flanking beige cat symbols */}
      <div className="absolute left-0 bottom-0 w-32 h-40 md:w-48 md:h-60 pointer-events-none select-none" aria-hidden="true">
        <Image src="/images/Ubasti Cat Symbol_Beige.png" alt="" fill className="object-contain object-bottom" />
      </div>
      <div className="absolute right-0 bottom-0 w-32 h-40 md:w-48 md:h-60 pointer-events-none select-none" aria-hidden="true" style={{ transform: "scaleX(-1)" }}>
        <Image src="/images/Ubasti Cat Symbol_Beige.png" alt="" fill className="object-contain object-bottom" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Arched box container */}
        <div
          className="relative px-6 pt-10 pb-8"
          style={{
            background: "var(--ubasti-cream)",
            borderRadius: "6rem 6rem 2rem 2rem",
            border: "2px solid var(--ubasti-blush)",
            boxShadow: "0 8px 40px rgba(44,46,31,0.10)",
          }}
        >
          {/* Floating cat decorations */}
          {CAT_DECORATIONS.map((cat, i) => (
            <motion.div
              key={i}
              className="absolute w-14 h-14 md:w-20 md:h-20 opacity-50 pointer-events-none"
              style={{ ...cat.style, position: "absolute" }}
              aria-hidden="true"
              animate={shouldReduce ? {} : { y: [0, -8, 0], rotate: [cat.style.rotate, (cat.style.rotate as number) + 5, cat.style.rotate] }}
              transition={{ duration: cat.dur, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src={cat.src} alt="" fill className="object-contain" />
            </motion.div>
          ))}

          {/* Arch label */}
          <p
            className="text-center text-xs font-bold uppercase tracking-widest mb-8"
            style={{ color: "var(--ubasti-sage)", fontFamily: "var(--font-cinzel)" }}
          >
            Our Impact
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {cards.map((c) => <Counter key={c.label} {...c} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
