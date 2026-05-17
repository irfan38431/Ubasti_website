import { Suspense } from "react";
import Image from "next/image";
import { BookWizard } from "../book/BookWizard";
import { getBookableDates } from "@/lib/booking/slots";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Grooming & Spa — Cats & Dogs",
  description: "Professional cat and dog grooming at Ubasti in Chennai. Baths, haircuts, nail trims, spa treatments, and more.",
  path: "/grooming",
  keywords: ["cat grooming chennai", "dog grooming chennai", "pet grooming near me", "pet spa chennai"],
});

const MAIN_PACKAGES = [
  {
    name: "Classic Bath",
    desc: "A refreshing shampoo wash, soft blow dry — all the essentials for a fresh, happy pet.",
    prices: {
      cats: [{ label: "Long Coat", price: "₹1,000" }, { label: "Short Coat", price: "₹850" }],
      dogs: [{ label: "Small", price: "₹1,000" }, { label: "Medium", price: "₹1,300" }, { label: "Large", price: "₹1,600" }],
    },
  },
  {
    name: "The Royal Treatment",
    desc: "Our premium combo with imported shampoo + conditioner, combing, ear clean, toothbrushing, and an anal cleanse — the ultimate head-to-tail care.",
    prices: {
      cats: [{ label: "Long Coat", price: "₹1,700" }, { label: "Short Coat", price: "₹1,600" }],
      dogs: [{ label: "Small", price: "₹1,300" }, { label: "Medium", price: "₹1,600" }, { label: "Large", price: "₹1,900" }],
    },
  },
  {
    name: "Signature Groom",
    desc: "A complete makeover with shampoo wash, soft blow dry, neat haircut, nail trim, and ear clean for a polished finish.",
    prices: {
      cats: [{ label: "Long Coat", price: "₹1,700" }, { label: "Short Coat", price: "₹1,600" }],
      dogs: [{ label: "Small", price: "₹1,600" }, { label: "Medium", price: "₹1,800" }, { label: "Large", price: "₹2,000" }],
    },
  },
  {
    name: "Couture Cut",
    desc: "Tailored haircuts to match your pet's unique paw-sonality, leaving them looking chic and charming.",
    prices: {
      dogs: [{ label: "Small", price: "₹1,000" }, { label: "Medium", price: "₹1,200" }, { label: "Large", price: "₹1,400" }],
    },
  },
  {
    name: "Neat & Tidy",
    desc: "A speedy spruce-up with a nail cut and ear clean — short, sweet, and oh-so-convenient.",
    prices: { flat: "₹450" },
  },
  {
    name: "The Detailed Groom",
    desc: "Because details matter: underpaws, underbelly, genitals, nail trim, ear clean, and a neat eye trim to keep your pet tidy and comfortable.",
    prices: { flat: "₹650" },
  },
];

const ADDONS = [
  { name: "Anal Gland Cleansing", price: "₹200" },
  { name: "Hair Brushing", price: "₹200" },
  { name: "Eye Trim", price: "₹200" },
  { name: "Eye Hair Removal", price: "₹200" },
  { name: "Paw Trim", price: "₹200" },
  { name: "Toothbrush", price: "₹200" },
];

const SPA_SERVICES = [
  {
    name: "Full Body Massage (30 Mins)",
    desc: "A soothing massage with nourishing oils to melt away tension, improve circulation, and leave your pet feeling calm, pampered, and refreshed.",
    prices: {
      cats: [{ label: "Cats", price: "₹600" }],
      dogs: [{ label: "Small", price: "₹600" }, { label: "Medium", price: "₹700" }, { label: "Large", price: "₹800" }],
    },
  },
  {
    name: "Pawdicure Massage (15 Mins)",
    desc: "A gentle paw massage that relaxes tired little feet, boosts comfort, and keeps those precious paws feeling their best. Perfect after walks or playtime!",
    prices: { flat: "₹400" },
  },
  {
    name: "The Healing Bath",
    desc: "A soothing spa session with your vet-prescribed shampoo, perfect for sensitive skin and special care needs. (Customer provides shampoo)",
    prices: {
      cats: [{ label: "Long Coat", price: "₹750" }, { label: "Short Coat", price: "₹650" }],
      dogs: [{ label: "Small", price: "₹1,300" }, { label: "Medium", price: "₹1,700" }, { label: "Large", price: "₹1,800" }],
    },
  },
  {
    name: "The Tick-Free Bath (1 Hr)",
    desc: "Protective treatment to keep your pet itch-free, comfortable, and ready for cuddles.",
    prices: { flat: "₹1,100" },
  },
  {
    name: "The Colour Pop",
    desc: "Safe, pet-friendly colouring for a stylish flair that makes your furry friend stand out.",
    prices: { flat: "₹600" },
  },
  {
    name: "Dematting (Min. 3 Hrs)",
    desc: "",
    prices: { flat: "₹600/hr" },
  },
  {
    name: "Deshedding (Min. 2 Hrs)",
    desc: "",
    prices: { flat: "₹600/hr" },
  },
  {
    name: "Signature Spa Combo",
    desc: "The Ultimate Indulgence — a complete head-to-tail luxury experience for the perfect spa day.",
    prices: { flat: "₹2,499" },
    highlight: true,
  },
];

function PriceBreakdown({ prices }: { prices: typeof MAIN_PACKAGES[0]["prices"] }) {
  if ("flat" in prices) {
    return (
      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}>
        {prices.flat}
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3 mt-1">
      {prices.cats && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--ubasti-mustard)" }}>Cats</p>
          <div className="flex flex-col gap-1">
            {prices.cats.map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span style={{ color: "var(--ubasti-sage)" }}>{r.label}</span>
                <span className="font-bold" style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}>{r.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {prices.dogs && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--ubasti-mustard)" }}>Dogs</p>
          <div className="flex flex-col gap-1">
            {prices.dogs.map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span style={{ color: "var(--ubasti-sage)" }}>{r.label}</span>
                <span className="font-bold" style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}>{r.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Section Banner ──────────────────────── */
function SectionBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-10" style={{ height: "280px" }}>
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
          background: "linear-gradient(to bottom, rgba(44,46,31,0.05) 0%, rgba(44,46,31,0.35) 100%)",
        }}
      />
    </div>
  );
}

export default async function GroomingPage() {
  let dates: string[] = [];
  try { dates = getBookableDates(); } catch {}

  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--ubasti-sage)" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/grooming/hero.png"
            alt="Professional cat and dog grooming at Ubasti"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.55) saturate(1.15)" }}
          />
        </div>
        <div className="relative py-24 md:py-36 text-center">
          <div className="max-w-[1280px] mx-auto px-6">
            <p
              className="text-sm font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--ubasti-mustard)", fontFamily: "var(--font-inter)" }}
            >
              Grooming &amp; Spa — Cats &amp; Dogs
            </p>
            <h1
              className="text-4xl md:text-6xl leading-tight"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}
            >
              Looking Good, Feeling Purr-fect
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl mx-auto mt-3"
              style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-caveat)", fontSize: "1.25rem" }}
            >
              professional grooming in a calm, cat-friendly environment
            </p>
          </div>
        </div>
      </section>

      {/* Main Packages */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal>
            <SectionBanner src="/images/grooming/packages.png" alt="Freshly groomed cat and dog on a premium grooming table" />
            <SectionTitle eyebrow="Grooming Packages" title="Main Services" className="mb-10" />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MAIN_PACKAGES.map((svc, i) => (
              <ScrollReveal key={svc.name} delay={i * 0.07}>
                <div className="rounded-2xl p-6 flex flex-col gap-3 h-full"
                  style={{ background: "var(--ubasti-cream)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
                  <h3 className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
                    {svc.name}
                  </h3>
                  {svc.desc && (
                    <p className="text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>{svc.desc}</p>
                  )}
                  <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--ubasti-blush)" }}>
                    <PriceBreakdown prices={svc.prices} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* À La Carte Add-ons */}
      <section className="py-16 md:py-20" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <SectionBanner src="/images/grooming/addons.png" alt="Close-up of professional cat paw trimming and ear cleaning" />
            <SectionTitle eyebrow="Add-ons" title="À La Carte Treatments" className="mb-8" />
          </ScrollReveal>
          <ScrollReveal>
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--ubasti-sage)", color: "var(--ubasti-cream)" }}>
                    <th className="text-left px-6 py-3 font-medium uppercase tracking-widest text-xs">Service</th>
                    <th className="text-right px-6 py-3 font-medium uppercase tracking-widest text-xs">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {ADDONS.map((addon, i) => (
                    <tr key={addon.name} style={{ background: i % 2 === 0 ? "var(--ubasti-paper)" : "white" }}>
                      <td className="px-6 py-3" style={{ color: "var(--ubasti-ink)" }}>{addon.name}</td>
                      <td className="px-6 py-3 text-right font-bold" style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}>
                        {addon.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Spa Services */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal>
            <SectionBanner src="/images/grooming/spa.png" alt="Cat enjoying a luxurious spa massage treatment" />
            <SectionTitle eyebrow="Spa" title="Spa Services" className="mb-10" />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPA_SERVICES.map((svc, i) => (
              <ScrollReveal key={svc.name} delay={i * 0.07}>
                <div className="rounded-2xl p-6 flex flex-col gap-3 h-full"
                  style={{
                    background: svc.highlight ? "var(--ubasti-olive-dark)" : "var(--ubasti-cream)",
                    color: svc.highlight ? "var(--ubasti-cream)" : "inherit",
                    boxShadow: "0 8px 24px rgba(44,46,31,0.08)",
                  }}>
                  <h3 className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: svc.highlight ? "var(--ubasti-cream)" : "var(--ubasti-ink)", fontWeight: 600 }}>
                    {svc.name}
                  </h3>
                  {svc.desc && (
                    <p className="text-sm leading-relaxed" style={{ color: svc.highlight ? "rgba(255,255,255,0.75)" : "var(--ubasti-sage)" }}>{svc.desc}</p>
                  )}
                  <div className="mt-auto pt-3 border-t" style={{ borderColor: svc.highlight ? "rgba(255,255,255,0.2)" : "var(--ubasti-blush)" }}>
                    {"flat" in svc.prices ? (
                      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-cinzel)", color: svc.highlight ? "var(--ubasti-mustard)" : "var(--ubasti-olive-dark)" }}>
                        {svc.prices.flat}
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {svc.prices.cats && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--ubasti-mustard)" }}>Cats</p>
                            {svc.prices.cats.map((r) => (
                              <div key={r.label} className="flex justify-between text-sm">
                                <span style={{ color: svc.highlight ? "rgba(255,255,255,0.7)" : "var(--ubasti-sage)" }}>{r.label}</span>
                                <span className="font-bold" style={{ fontFamily: "var(--font-cinzel)", color: svc.highlight ? "var(--ubasti-cream)" : "var(--ubasti-olive-dark)" }}>{r.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {svc.prices.dogs && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--ubasti-mustard)" }}>Dogs</p>
                            {svc.prices.dogs.map((r) => (
                              <div key={r.label} className="flex justify-between text-sm">
                                <span style={{ color: svc.highlight ? "rgba(255,255,255,0.7)" : "var(--ubasti-sage)" }}>{r.label}</span>
                                <span className="font-bold" style={{ fontFamily: "var(--font-cinzel)", color: svc.highlight ? "var(--ubasti-cream)" : "var(--ubasti-olive-dark)" }}>{r.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tax disclaimer */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 pb-4">
        <p className="text-xs text-center" style={{ color: "var(--ubasti-sage)" }}>
          * Prices not inclusive of taxes | Size categories: Small / Medium / Large
        </p>
      </div>

      {/* Book a Session */}
      <section className="py-16 px-4" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "var(--ubasti-mustard)" }}>
              Book a Session
            </p>
            <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
              Reserve Your Slot
            </h2>
            <p className="text-sm mt-3" style={{ color: "var(--ubasti-sage)" }}>
              60-minute sessions · Pay on arrival · Cancel up to 24h before
            </p>
          </div>
          <Suspense fallback={<div className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-cream)" }} />}>
            <BookWizard dates={dates} />
          </Suspense>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl mb-6 text-center" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
            Grooming FAQs
          </h2>
          <div className="divide-y" style={{ borderColor: "var(--ubasti-blush)" }}>
            {[
              { q: "Do you groom all cat/dog breeds?", a: "We groom most breeds. Please mention your pet's breed and temperament when booking so we can prepare accordingly." },
              { q: "How long does a grooming session take?", a: "Cat sessions are typically 45-60 minutes. Dog sessions may take 60-90 minutes depending on coat type." },
              { q: "Should I bring anything?", a: "Just your pet! We provide all shampoos and equipment. If your pet needs a specific shampoo (e.g. for The Healing Bath), bring it along." },
              { q: "Is it safe for anxious pets?", a: "We work gently and patiently. For very anxious pets, a short 'meet & greet' visit first can help." },
            ].map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer text-base font-medium list-none" style={{ color: "var(--ubasti-ink)" }}>
                  {item.q}
                  <span className="text-xl transition-transform group-open:rotate-45 shrink-0 ml-4" style={{ color: "var(--ubasti-mustard)" }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
