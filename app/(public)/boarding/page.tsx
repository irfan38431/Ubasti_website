import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Cat Boarding",
  description: "Safe, loving cat boarding at Ubasti Cat Cafe in Chennai. Your cat stays in our cozy lounge with play areas and feline friends.",
  path: "/boarding",
  keywords: ["cat boarding chennai", "cat stay chennai", "cat hostel chennai"],
});

const BOARDING_PACKAGES = [
  {
    name: "Lounge Stay",
    desc: "Your cat roams the lounge every day with feline friends and enrichment activities.",
    options: [
      { label: "Ubasti provides food & litter", price: "₹1,000" },
      { label: "Food & litter by pet parent", price: "₹900" },
    ],
  },
  {
    name: "Enclosure Stay",
    desc: "Your cat stays in a private, cozy boarding enclosure for a calm and secure stay.",
    options: [
      { label: "Ubasti provides food & litter", price: "₹800" },
      { label: "Food & litter by pet parent", price: "₹700" },
    ],
  },
];

const BOARDING_RULES = [
  "Your cat will receive a complimentary bath with a minimum of three days of boarding.",
  "Cats must be picked up and dropped off during business hours only. Late pick-ups may incur an additional fee.",
  "Personal items (toys, blankets, etc.) may be brought, but the spa is not responsible for loss or damage despite precautions.",
  "A booking deposit is required. Full payment must be made at check-in. Deposits are non-refundable for no-shows.",
  "The spa reserves the right to refuse boarding if a cat shows aggressive behavior that endangers staff or other pets.",
  "Owners must provide their cat's regular food and any medications with clear instructions.",
  "Owners must provide a reliable contact number and a secondary contact in case of emergency.",
  "Cats with contagious illnesses, fleas, or ticks cannot be boarded. A vet check may be requested.",
  "Cats must be up-to-date on vaccinations. Proof must be shown at check-in.",
  "In case of extension of your cat's stay, a full fee must be paid for the required duration.",
  "If a cat is not picked up within 3 days of the agreed check-out date and no contact is made, the cat will be considered abandoned and handed over to local shelters or authorities.",
];

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

export default function BoardingPage() {
  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--ubasti-blush)" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/boarding/hero.png"
            alt="Cozy cat boarding at Ubasti Cat Cafe"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.5) saturate(1.15)" }}
          />
        </div>
        <div className="relative py-24 md:py-36 text-center">
          <div className="max-w-[1280px] mx-auto px-6">
            <p
              className="text-sm font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--ubasti-mustard)", fontFamily: "var(--font-inter)" }}
            >
              Boarding
            </p>
            <h1
              className="text-4xl md:text-6xl leading-tight"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}
            >
              A Home Away from Home
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl mx-auto mt-3"
              style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-caveat)", fontSize: "1.25rem" }}
            >
              safe, loving care for your cat while you&apos;re away
            </p>
          </div>
        </div>
      </section>

      {/* About boarding */}
      <section className="py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <SectionBanner src="/images/boarding/about.png" alt="Cats playing together in the Ubasti lounge with climbing structures" />
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto" style={{ color: "var(--ubasti-sage)" }}>
              When you're away, your cat deserves a staycation of their own. Our cozy personal kennels provide a safe and private space for rest at night, while our play areas are filled with cat-friendly structures, toys, and plenty of stimulation during the day. With other feline friends to socialize with and a café designed for endless fun, your kitty will enjoy a perfect balance of comfort, play, and companionship.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-10 md:py-16" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <SectionBanner src="/images/boarding/pricing.png" alt="Premium cat boarding suites with cozy bedding" />
            </div>
            <SectionTitle eyebrow="Pricing" title="Boarding Rates" className="mb-10" />
          </ScrollReveal>
          <div className="flex flex-col gap-10 max-w-3xl mx-auto">
            {BOARDING_PACKAGES.map((pkg, pi) => (
              <ScrollReveal key={pkg.name} delay={pi * 0.1}>
                <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
                  <div className="px-8 py-5 text-center" style={{ background: pi === 0 ? "var(--ubasti-sage)" : "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
                    <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}>{pkg.name}</h2>
                    <p className="text-sm opacity-80">{pkg.desc}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: "rgba(44,46,31,0.1)", background: "var(--ubasti-paper)" }}>
                    {pkg.options.map((opt) => (
                      <div key={opt.label} className="flex flex-col items-center gap-2 px-8 py-6 text-center">
                        <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-ink)" }}>
                          {opt.price}
                          <span className="text-lg font-normal opacity-60">/night</span>
                        </p>
                        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>{opt.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="text-xs text-center mt-6" style={{ color: "var(--ubasti-sage)" }}>
            * Prices not inclusive of taxes
          </p>
        </div>
      </section>

      {/* Boarding Rules */}
      <section className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <SectionBanner src="/images/boarding/rules.png" alt="Veterinarian examining a cat for boarding readiness" />
            <h2 className="text-2xl mb-8 text-center" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
              Boarding Rules
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <ul className="flex flex-col gap-4">
              {BOARDING_RULES.map((rule, i) => (
                <li key={i} className="flex gap-4 text-sm leading-relaxed" style={{ color: "var(--ubasti-ink)" }}>
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: "var(--ubasti-mustard)", color: "var(--ubasti-ink)" }}>
                    {i + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-lg mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--ubasti-mustard)" }}>
            Ready to Book?
          </p>
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
            Book a Boarding Stay
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--ubasti-sage)" }}>
            Select your stay type, pick your dates, and we'll get back to you about the deposit to confirm.
          </p>
          <Link
            href="/boarding/book"
            className="inline-flex h-14 items-center px-10 rounded-full font-medium text-base transition-opacity hover:opacity-90"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
          >
            Book Boarding →
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl mb-6 text-center" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
            Boarding FAQs
          </h2>
          <div className="divide-y" style={{ borderColor: "var(--ubasti-blush)" }}>
            {[
              { q: "How do I book boarding?", a: "Use the 'Book Boarding' button above to submit your request online. We'll contact you to arrange the deposit and confirm your dates." },
              { q: "Are vaccinations required?", a: "Yes — your cat must be up-to-date on core vaccinations. Please bring proof of vaccination on drop-off day." },
              { q: "Can I visit my cat during boarding?", a: "Yes, during lounge hours. We also send daily photo updates via WhatsApp." },
              { q: "Does my cat get a free bath?", a: "Yes! Cats boarding for a minimum of three days receive a complimentary bath." },
              { q: "What if my cat doesn't get along with others?", a: "Our play areas give all cats space to settle in at their own pace. Let us know your cat's temperament when booking." },
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
