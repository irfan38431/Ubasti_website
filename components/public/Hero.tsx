import Image from "next/image";
import { ScallopDivider } from "@/components/decorative/ScallopDivider";

export function Hero() {
  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{ height: "clamp(220px, 45vh, 520px)" }}
      >
        {/* Background photo */}
        <Image
          src="/images/placeholders/offering-cats.svg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(44,46,31,0.48)" }}
          aria-hidden="true"
        />

        {/* Centered Ubasti wordmark */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
          <div className="relative w-full max-w-[560px] h-32 md:h-44">
            <Image
              src="/images/decorative/ubasti-lounge-wordmark.svg"
              alt="Ubasti Cat Cafe & Lounge"
              fill
              className="object-contain"
              style={{ filter: "invert(1) brightness(2)" }}
            />
          </div>
        </div>
      </section>

      {/* Wavy transition into dark headline block */}
      <ScallopDivider
        top="rgba(44,46,31,0.48)"
        bottom="var(--ubasti-ink)"
      />
    </>
  );
}
