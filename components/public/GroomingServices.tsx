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

function PetToggle({ value, onChange }: { value: Pet; onChange: (p: Pet) => void }) {
  const options: { key: Pet; label: string }[] = [
    { key: "cats", label: "Cats" },
    { key: "dogs", label: "Dogs" },
  ];
  return (
    <div className="flex justify-center mb-10">
      <div
        role="tablist"
        aria-label="Choose pet type"
        className="inline-flex items-center gap-1"
        style={{
          background: "var(--ubasti-cream)",
          border: "1px solid var(--ubasti-blush)",
          borderRadius: "9999px",
          padding: "0.25rem",
          boxShadow: "0 4px 14px rgba(44,46,31,0.08)",
        }}
      >
        {options.map((opt) => {
          const active = opt.key === value;
          return (
            <button
              key={opt.key}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt.key)}
              className="transition-colors duration-200"
              style={{
                background: active ? "var(--ubasti-olive-dark)" : "transparent",
                color: active ? "var(--ubasti-cream)" : "var(--ubasti-sage)",
                borderRadius: "9999px",
                padding: "0.55rem 1.5rem",
                fontFamily: "var(--font-inter)",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "none",
                minWidth: "100px",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
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

          <PetToggle value={pet} onChange={setPet} />

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
