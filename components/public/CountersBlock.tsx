"use client";
import { useRef, useEffect, useState } from "react";
import { useInView, animate } from "framer-motion";

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


interface CountersBlockProps { rescued: number; atCafe: number; adopted: number }

export function CountersBlock({ rescued, atCafe, adopted }: CountersBlockProps) {
  const cards = [
    { label: "Cats Rescued",     target: rescued, bg: "var(--ubasti-sage)",       color: "var(--ubasti-cream)" },
    { label: "Cats at the Cafe", target: atCafe,  bg: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" },
    { label: "Cats Adopted",     target: adopted, bg: "var(--ubasti-blush)",      color: "var(--ubasti-ink)" },
  ];

  return (
    <section className="relative py-16 md:py-24" style={{ background: "var(--ubasti-paper)" }}>
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
