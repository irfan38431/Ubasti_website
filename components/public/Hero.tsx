"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { ScallopDivider } from "@/components/decorative/ScallopDivider";

const VIDEOS = [
  "/videos/cafe-1.mp4",
  "/videos/cafe-2.mp4",
  "/videos/cafe-3.mp4",
  "/videos/cafe-4.mp4",
  "/videos/cafe-5.mp4",
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % VIDEOS.length);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [index]);

  return (
    <>
      <section
        className="relative overflow-hidden flex items-center justify-center"
        style={{ height: "max(100svh, 133vw)", minHeight: 480 }}
      >
        {/* Placeholder background while no video loaded */}
        <div
          className="absolute inset-0"
          style={{ background: "var(--ubasti-ink)" }}
          aria-hidden="true"
        />

        {/* Cycling video background */}
        <video
          ref={videoRef}
          key={VIDEOS[index]}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={advance}
          onError={advance}
          aria-hidden="true"
        >
          <source src={VIDEOS[index]} type="video/mp4" />
        </video>

        {/* Light overlay — keeps video visible but adds depth */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(20,22,14,0.35)" }}
          aria-hidden="true"
        />

        {/* Frosted glass logo card */}
        <div
          className="relative z-10 flex items-center justify-center px-8 py-6 md:px-12 md:py-8"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "1.5rem",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          <div className="relative w-[220px] h-[90px] md:w-[320px] md:h-[130px]">
            <Image
              src="/images/logo.png"
              alt="Ubasti Cat Cafe & Lounge"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Wavy transition into dark headline block */}
      <ScallopDivider
        top="var(--ubasti-ink)"
        bottom="var(--ubasti-ink)"
      />
    </>
  );
}
