"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

const VIDEOS = [
  "/videos/cafe-1.mp4",
  "/videos/cafe-2.mp4",
  "/videos/cafe-3.mp4",
  "/videos/cafe-4.mp4",
  "/videos/cafe-5.mp4",
].filter(Boolean);

export function VideoBackgroundBlock() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % VIDEOS.length);
    setHasError(false);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [index]);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "clamp(280px, 60vh, 600px)", background: "var(--ubasti-ink)" }}
    >
      {/* Fallback when no videos loaded yet */}
      <Image
        src="/images/placeholders/offering-community.svg"
        alt=""
        fill
        className="object-cover"
        aria-hidden="true"
      />

      {VIDEOS.length > 0 && !hasError && (
        <video
          ref={videoRef}
          key={VIDEOS[index]}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={advance}
          onError={() => { setHasError(true); advance(); }}
          aria-hidden="true"
        >
          <source src={VIDEOS[index]} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(44,46,31,0.55)" }}
        aria-hidden="true"
      />

      {/* Logo overlay — centered */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
        <div className="relative w-full max-w-[520px] h-28 md:h-40">
          <Image
            src="/images/logo.png"
            alt="Ubasti Cat Cafe & Lounge"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
