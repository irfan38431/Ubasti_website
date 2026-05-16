import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Cat Boarding",
  description: "Safe, loving cat boarding at Ubasti Cat Cafe in Chennai. Your cat stays in our lounge or boarding enclosures while you're away.",
  path: "/boarding",
  keywords: ["cat boarding chennai", "cat stay chennai", "cat hostel chennai"],
});

const SCENARIOS = [
  {
    title: "In the Lounge Daily",
    desc: "Your cat spends the day socialising with our resident cats in the open lounge.",
    options: [
      { label: "Ubasti food & litter included", price: "₹1,000/day" },
      { label: "Parent provides food & litter", price: "₹900/day" },
    ],
    bg: "var(--ubasti-sage)",
    color: "var(--ubasti-cream)",
  },
  {
    title: "Boarding Enclosure",
    desc: "Your cat has a private, comfortable enclosure — ideal for shy or solo cats.",
    options: [
      { label: "Ubasti food & litter included", price: "₹800/day" },
      { label: "Parent provides food & litter", price: "₹700/day" },
    ],
    bg: "var(--ubasti-olive-dark)",
    color: "var(--ubasti-cream)",
  },
];

export default function BoardingPage() {
  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      <section className="py-20 md:py-28 text-center" style={{ background: "var(--ubasti-blush)" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <SectionTitle
            eyebrow="Boarding"
            title="A Home Away from Home"
            subtitle="safe, loving care for your cat while you're away"
          />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal>
            <SectionTitle eyebrow="Pricing" title="Choose Your Setup" className="mb-12" />
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {SCENARIOS.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 0.1}>
                <div className="rounded-2xl p-8 flex flex-col gap-5"
                  style={{ background: s.bg, color: s.color, boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
                  <div>
                    <h2 className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}>{s.title}</h2>
                    <p className="text-sm opacity-80 mt-2">{s.desc}</p>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {s.options.map((opt) => (
                      <li key={opt.label} className="flex items-center justify-between gap-4">
                        <span className="text-sm opacity-80">{opt.label}</span>
                        <span className="text-xl font-bold shrink-0" style={{ fontFamily: "var(--font-cinzel)" }}>{opt.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 text-center" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-xl mx-auto px-6">
          <p className="text-base mb-6" style={{ color: "var(--ubasti-sage)" }}>
            Ready to book boarding for your cat? Reach out via our contact form or Instagram.
          </p>
          <Link href="/#main-content"
            className="inline-flex h-12 items-center px-8 rounded-full font-medium text-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
            Contact Us
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl mb-6 text-center" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
            Boarding FAQs
          </h2>
          <div className="divide-y" style={{ borderColor: "var(--ubasti-blush)" }}>
            {[
              { q: "How do I book boarding?", a: "Contact us via the form or Instagram at least 3 days in advance. We'll confirm availability and guide you through drop-off." },
              { q: "Are vaccinations required?", a: "Yes — your cat must be up-to-date on core vaccinations (FVRCP). Please bring vaccination records on drop-off day." },
              { q: "Can I visit my cat during boarding?", a: "Yes, during lounge hours. We also send daily photo updates via WhatsApp." },
              { q: "What if my cat doesn't get along with others?", a: "The enclosure option is ideal for cats that prefer their own space. We always do a temperament check before lounge placement." },
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
