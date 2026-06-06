"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type PriceRow = { label: string; price: string };
type PetPrices = { cats?: PriceRow[]; dogs?: PriceRow[] };
type FlatPrices = { flat: string };
type Prices = PetPrices | FlatPrices;

export type GroomingService = {
  name: string;
  desc?: string;
  prices: Prices;
  highlight?: boolean;
};

type Pet = "cats" | "dogs";

function isFlat(p: Prices): p is FlatPrices {
  return "flat" in p;
}

/** Portrait photo selector — pick Cats or Dogs by tapping their picture.
 *  The chosen pet lifts up in full colour with an olive ring + ✓ badge;
 *  the other is gently dimmed, inviting a tap. Drives the price filtering. */
function PetSelector({ value, onChange }: { value: Pet; onChange: (p: Pet) => void }) {
  const options: { key: Pet; label: string; img: string; alt: string }[] = [
    { key: "cats", label: "Cats", img: "/images/placeholders/Grooming_cat.jpeg", alt: "A cat being groomed at Ubasti" },
    { key: "dogs", label: "Dogs", img: "/images/placeholders/Grooming_dog.jpeg", alt: "A freshly groomed dog dressed up at Ubasti" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Choose pet type"
      className="flex justify-center items-stretch gap-4 md:gap-8 mb-12"
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            role="tab"
            aria-selected={active}
            aria-label={`Show ${opt.label} prices`}
            onClick={() => onChange(opt.key)}
            className="group relative overflow-hidden rounded-3xl transition-all duration-300 focus:outline-none"
            style={{
              width: "clamp(150px, 36vw, 280px)",
              aspectRatio: "4 / 5",
              padding: 0,
              border: "none",
              cursor: "pointer",
              transform: active ? "translateY(-6px)" : "translateY(0)",
              boxShadow: active
                ? "0 0 0 4px var(--ubasti-olive-dark), 0 18px 40px rgba(44,46,31,0.28)"
                : "0 8px 24px rgba(44,46,31,0.12)",
            }}
          >
            <Image
              src={opt.img}
              alt={opt.alt}
              fill
              sizes="(max-width: 768px) 36vw, 280px"
              className="object-cover transition-all duration-300 group-hover:scale-105"
              style={{
                filter: active ? "none" : "grayscale(0.55) brightness(0.78)",
                transform: active ? "scale(1.04)" : "scale(1)",
              }}
            />
            {/* Bottom scrim + label */}
            <div
              className="absolute inset-0 flex items-end justify-center"
              style={{
                background: active
                  ? "linear-gradient(0deg, rgba(44,46,31,0.80) 0%, rgba(44,46,31,0.04) 58%)"
                  : "linear-gradient(0deg, rgba(44,46,31,0.62) 0%, rgba(44,46,31,0.10) 62%)",
              }}
            >
              <div className="flex flex-col items-center gap-0.5 pb-4 md:pb-5">
                <span
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    color: "#fff",
                    fontSize: "clamp(0.95rem, 2.4vw, 1.3rem)",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {opt.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: active ? "var(--ubasti-mustard)" : "transparent",
                    transition: "color 0.3s",
                  }}
                >
                  Viewing prices
                </span>
              </div>
            </div>
            {/* Active check badge */}
            {active && (
              <span
                aria-hidden
                className="absolute top-3 right-3 flex items-center justify-center rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  background: "var(--ubasti-olive-dark)",
                  color: "var(--ubasti-cream)",
                  fontSize: "0.8rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PriceBlock({
  prices,
  pet,
  highlight = false,
}: {
  prices: Prices;
  pet: Pet;
  highlight?: boolean;
}) {
  if (isFlat(prices)) {
    return (
      <p
        className="text-2xl font-bold"
        style={{
          fontFamily: "var(--font-cinzel)",
          color: highlight ? "var(--ubasti-mustard)" : "var(--ubasti-olive-dark)",
        }}
      >
        {prices.flat}
      </p>
    );
  }
  const rows = pet === "cats" ? prices.cats : prices.dogs;
  if (!rows) return null;
  return (
    <div className="flex flex-col gap-1">
      <p
        className="text-xs font-bold uppercase tracking-widest mb-1"
        style={{ color: "var(--ubasti-mustard)" }}
      >
        {pet === "cats" ? "Cats" : "Dogs"}
      </p>
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between text-sm">
          <span
            style={{
              color: highlight ? "rgba(255,255,255,0.7)" : "var(--ubasti-sage)",
            }}
          >
            {r.label}
          </span>
          <span
            className="font-bold"
            style={{
              fontFamily: "var(--font-cinzel)",
              color: highlight ? "var(--ubasti-cream)" : "var(--ubasti-olive-dark)",
            }}
          >
            {r.price}
          </span>
        </div>
      ))}
    </div>
  );
}

function visibleForPet(svc: GroomingService, pet: Pet): boolean {
  if (isFlat(svc.prices)) return true;
  return Boolean(pet === "cats" ? svc.prices.cats : svc.prices.dogs);
}

function SectionBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl mb-10"
      style={{ height: "280px" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 1280px"
        className="object-cover"
        style={{ filter: "brightness(0.85) saturate(1.1)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(44,46,31,0.05) 0%, rgba(44,46,31,0.35) 100%)",
        }}
      />
    </div>
  );
}

export function GroomingServices({
  mainPackages,
  spaServices,
}: {
  mainPackages: GroomingService[];
  spaServices: GroomingService[];
}) {
  const [pet, setPet] = useState<Pet>("cats");

  const filteredMain = mainPackages.filter((s) => visibleForPet(s, pet));
  const filteredSpa = spaServices.filter((s) => visibleForPet(s, pet));

  return (
    <>
      {/* Main Packages */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal>
            <SectionBanner
              src="/images/grooming/packages.png"
              alt="Freshly groomed cat and dog on a premium grooming table"
            />
            <SectionTitle eyebrow="Grooming Packages" title="Main Services" className="mb-6" />
          </ScrollReveal>

          <PetSelector value={pet} onChange={setPet} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMain.map((svc, i) => (
              <ScrollReveal key={svc.name} delay={i * 0.07}>
                <div
                  className="rounded-2xl p-6 flex flex-col gap-3 h-full"
                  style={{
                    background: "var(--ubasti-cream)",
                    boxShadow: "0 8px 24px rgba(44,46,31,0.08)",
                  }}
                >
                  <h3
                    className="text-xl"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      color: "var(--ubasti-ink)",
                      fontWeight: 600,
                    }}
                  >
                    {svc.name}
                  </h3>
                  {svc.desc && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--ubasti-sage)" }}
                    >
                      {svc.desc}
                    </p>
                  )}
                  <div
                    className="mt-auto pt-3 border-t"
                    style={{ borderColor: "var(--ubasti-blush)" }}
                  >
                    <PriceBlock prices={svc.prices} pet={pet} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Spa Services */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal>
            <SectionBanner
              src="/images/grooming/spa.png"
              alt="Cat enjoying a luxurious spa massage treatment"
            />
            <SectionTitle eyebrow="Spa" title="Spa Services" className="mb-10" />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpa.map((svc, i) => (
              <ScrollReveal key={svc.name} delay={i * 0.07}>
                <div
                  className="rounded-2xl p-6 flex flex-col gap-3 h-full"
                  style={{
                    background: svc.highlight
                      ? "var(--ubasti-olive-dark)"
                      : "var(--ubasti-cream)",
                    color: svc.highlight ? "var(--ubasti-cream)" : "inherit",
                    boxShadow: "0 8px 24px rgba(44,46,31,0.08)",
                  }}
                >
                  <h3
                    className="text-xl"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      color: svc.highlight ? "var(--ubasti-cream)" : "var(--ubasti-ink)",
                      fontWeight: 600,
                    }}
                  >
                    {svc.name}
                  </h3>
                  {svc.desc && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: svc.highlight
                          ? "rgba(255,255,255,0.75)"
                          : "var(--ubasti-sage)",
                      }}
                    >
                      {svc.desc}
                    </p>
                  )}
                  <div
                    className="mt-auto pt-3 border-t"
                    style={{
                      borderColor: svc.highlight
                        ? "rgba(255,255,255,0.2)"
                        : "var(--ubasti-blush)",
                    }}
                  >
                    <PriceBlock prices={svc.prices} pet={pet} highlight={svc.highlight} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
