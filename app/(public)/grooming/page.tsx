import { Suspense } from "react";
import { BookWizard } from "../book/BookWizard";
import { getBookableDates } from "@/lib/booking/slots";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Grooming — Cats & Dogs",
  description: "Professional cat and dog grooming at Ubasti in Chennai. Wash, brush, nail trims, and de-shed treatments.",
  path: "/grooming",
  keywords: ["cat grooming chennai", "dog grooming chennai", "pet grooming near me"],
});

const SERVICES = [
  { name: "Cat Wash & Brush",   price: "₹800",  desc: "Full bath, blow-dry, and brush-out for your feline friend." },
  { name: "Cat Nail Trim",      price: "₹250",  desc: "Quick, stress-free nail clipping for cats." },
  { name: "Dog Wash & Blow-dry", price: "₹1,200", desc: "Bath, blow-dry, and light brush for small to medium dogs." },
  { name: "Dog De-shed Treatment", price: "₹1,500", desc: "Deep de-shedding treatment to reduce loose coat significantly." },
];

export default async function GroomingPage() {
  let dates: string[] = [];
  try { dates = getBookableDates(); } catch {}

  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      <section className="py-20 md:py-28 text-center" style={{ background: "var(--ubasti-sage)" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <SectionTitle
            eyebrow="Grooming — Cats & Dogs"
            title="Looking Good, Feeling Purr-fect"
            subtitle="professional grooming in a calm, cat-friendly environment"
          />
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal>
            <SectionTitle eyebrow="Services" title="What We Offer" className="mb-10" />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((svc, i) => (
              <ScrollReveal key={svc.name} delay={i * 0.08}>
                <div className="rounded-2xl p-6 flex flex-col gap-3"
                  style={{ background: "var(--ubasti-cream)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
                  <h3 className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
                    {svc.name}
                  </h3>
                  <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}>
                    {svc.price}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>{svc.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

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

      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl mb-6 text-center" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
            Grooming FAQs
          </h2>
          <div className="divide-y" style={{ borderColor: "var(--ubasti-blush)" }}>
            {[
              { q: "Do you groom all cat/dog breeds?", a: "We groom most breeds. Please mention your pet's breed and temperament when booking so we can prepare accordingly." },
              { q: "How long does a grooming session take?", a: "Cat sessions are typically 45-60 minutes. Dog sessions may take 60-90 minutes depending on coat type." },
              { q: "Should I bring anything?", a: "Just your pet! We provide all shampoos and equipment. If your pet has allergies, mention them when booking." },
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
