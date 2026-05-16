"use client";
import { useRef, useEffect, useState } from "react";
import { useInView, animate } from "framer-motion";
import { SITE_STATS } from "@/lib/site-stats";

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

export function CountersBlock() {
  const cards = [
    { label: "Cats Rescued",     target: SITE_STATS.rescued, bg: "var(--ubasti-sage)",       color: "var(--ubasti-cream)" },
    { label: "Cats at the Cafe", target: SITE_STATS.atCafe,  bg: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" },
    { label: "Cats Adopted",     target: SITE_STATS.adopted, bg: "var(--ubasti-blush)",      color: "var(--ubasti-ink)" },
  ];
  return (
    <section className="py-16 md:py-24" style={{ background: "var(--ubasti-paper)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((c) => <Counter key={c.label} {...c} />)}
        </div>
      </div>
    </section>
  );
}
