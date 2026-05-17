"use client";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { SLIDESHOW_IMAGES as IMAGES } from "@/lib/replacements";

export function SlideshowStrip() {
  const shouldReduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (shouldReduce) return;
    const track = trackRef.current;
    if (!track) return;
    let start: number | null = null;
    let raf: number;
    const speed = track.scrollWidth / 2 / (60 * 300);

    function step(ts: number) {
      if (!start) start = ts;
      if (!paused && track) {
        const halfW = track.scrollWidth / 2;
        const elapsed = (ts - start) * speed;
        const offset = elapsed % halfW;
        track.style.transform = `translateX(-${offset}px)`;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shouldReduce, paused]);

  const doubled = [...IMAGES, ...IMAGES];

  return (
    <section className="overflow-hidden py-10" style={{ background: "var(--ubasti-paper)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div ref={trackRef} className="flex gap-4" style={{ width: "max-content" }}>
        {doubled.map((src, i) => (
          <div key={i} className="relative rounded-2xl overflow-hidden shrink-0"
            style={{ width: 280, height: 360, background: "var(--ubasti-cream)" }}>
            <Image src={src} alt="" fill className="object-cover" sizes="280px" />
          </div>
        ))}
      </div>
    </section>
  );
}
