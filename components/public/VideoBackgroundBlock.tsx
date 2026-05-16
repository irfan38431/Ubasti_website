import Image from "next/image";

export function VideoBackgroundBlock() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "clamp(280px, 60vh, 600px)", background: "var(--ubasti-ink)" }}
    >
      {/* TODO: replace src with actual cafe interior video when available */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/placeholders/offering-community.svg"
        aria-hidden="true"
      >
        {/* <source src="/videos/cafe-interior.mp4" type="video/mp4" /> */}
      </video>

      {/* Fallback poster fill for when video src is empty */}
      <Image
        src="/images/placeholders/offering-community.svg"
        alt=""
        fill
        className="object-cover"
        aria-hidden="true"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(44,46,31,0.82)" }}
        aria-hidden="true"
      />

      {/* Wordmark overlay — centered */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
        <div className="relative w-full max-w-[520px] h-28 md:h-40">
          <Image
            src="/images/decorative/ubasti-lounge-wordmark.svg"
            alt="Ubasti Cat Cafe & Lounge"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
