"use client";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const IMAGES = [
  "/images/slideshow_images/Image-1.jpeg",
  "/images/slideshow_images/image-2.jpeg",
  "/images/slideshow_images/image-3.jpeg",
  "/images/slideshow_images/image-4.jpeg",
  "/images/slideshow_images/image-5.jpeg",
  "/images/slideshow_images/image-6.jpeg",
  "/images/slideshow_images/image-7.jpeg",
  "/images/slideshow_images/image-8.jpeg",
  "/images/slideshow_images/image-9.jpeg",
  "/images/slideshow_images/image-10.jpeg",
];

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
    const speed = track.scrollWidth / 2 / (60 * 60);

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
