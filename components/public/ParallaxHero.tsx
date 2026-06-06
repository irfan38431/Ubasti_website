"use client";

import { useEffect, useRef } from "react";

interface ParallaxHeroProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxHero({ children, className, style }: ParallaxHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number;

    const tick = () => {
      const section = sectionRef.current;
      if (!section) return;

      const scrolled = Math.max(0, window.scrollY - section.offsetTop);

      const bg   = section.querySelector<HTMLElement>("[data-parallax-bg]");
      const text = section.querySelector<HTMLElement>("[data-parallax-text]");

      if (bg)   bg.style.transform   = `translateY(${scrolled * 0.2}px)`;
      if (text) text.style.transform = `translateY(${scrolled * -0.1}px)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden${className ? ` ${className}` : ""}`}
      style={{ position: "sticky", top: 0, zIndex: 0, ...style }}
    >
      {children}
    </section>
  );
}
