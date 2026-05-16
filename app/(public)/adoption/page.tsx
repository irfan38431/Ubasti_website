import { db } from "@/lib/db/client";
import { kitties } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { KittyCard } from "@/components/public/KittyCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { buildMetadata } from "@/lib/seo/metadata";
import { ADOPTION_FORM_URL } from "@/lib/constants/social";

export const metadata = buildMetadata({
  title: "Adopt a Cat — Give a Rescue a Forever Home",
  description: "Meet our adoptable rescue cats at Ubasti Cat Cafe in Chennai. Apply to adopt and give a cat a loving forever home.",
  path: "/adoption",
  keywords: ["adopt a cat chennai", "cat adoption chennai", "rescue cat adoption tamil nadu"],
});

const WHY_ADOPT = [
  { title: "Rescue a Life",    desc: "Every cat at Ubasti is rescued. Adopting means giving a second chance to a cat who deserves it." },
  { title: "Know Your Cat",    desc: "You'll spend real time with them in the lounge before applying — no surprises, just connection." },
  { title: "Full Support",     desc: "We guide you through vet checks, diet, and settling-in. You're never alone in the process." },
];

const STEPS = [
  { step: "01", title: "Meet",         desc: "Visit the lounge and spend time with the cats. See who you connect with." },
  { step: "02", title: "Apply",        desc: "Fill out our adoption application. We'll review within 2 business days." },
  { step: "03", title: "Home Visit",   desc: "A brief, friendly check of your home setup — we just want to make sure everyone's safe." },
  { step: "04", title: "Welcome Home", desc: "Sign the adoption agreement, complete the fee, and your new family member comes home!" },
];

export default async function AdoptionPage() {
  let availableCats: typeof kitties.$inferSelect[] = [];
  try {
    availableCats = await db.select().from(kitties)
      .where(eq(kitties.status, "available"))
      .orderBy(asc(kitties.sortOrder), asc(kitties.name));
  } catch {}

  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      {/* Hero */}
      <section className="py-24 md:py-36 text-center relative overflow-hidden"
        style={{ background: "var(--ubasti-sage)" }}>
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--ubasti-cream)", opacity: 0.8 }}>
            Open Hearts, Open Homes
          </p>
          <h1 className="text-5xl md:text-7xl mb-6"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}>
            Adopt a Cat
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: "var(--ubasti-cream)", opacity: 0.85 }}>
            Every cat here is rescued and waiting for a forever home. Could yours be the one?
          </p>
          <a href="#adoptable-cats"
            className="inline-flex h-12 items-center px-8 rounded-full font-medium text-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--ubasti-cream)", color: "var(--ubasti-olive-dark)" }}>
            Meet the Cats ↓
          </a>
        </div>
      </section>

      {/* Why Adopt */}
      <section className="py-16 md:py-24" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal><SectionTitle eyebrow="Why Adopt" title="Every Cat Deserves a Home" className="mb-12" /></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_ADOPT.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Adoptable Cats Grid */}
      <section id="adoptable-cats" className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal><SectionTitle eyebrow="Available Now" title="Meet Your Future Family" className="mb-12" /></ScrollReveal>
          {availableCats.length === 0 ? (
            <p className="text-center py-16" style={{ color: "var(--ubasti-sage)" }}>
              All our cats are currently on hold or recently adopted. Check back soon — new rescues arrive regularly.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableCats.map((cat) => (
                <KittyCard
                  key={cat.id}
                  name={cat.name}
                  imageUrl={cat.imageUrl}
                  age={cat.age}
                  sex={(cat as typeof cat & { sex?: string | null }).sex}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Adoption Process Stepper */}
      <section className="py-16 md:py-24" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal><SectionTitle eyebrow="How It Works" title="The Adoption Process" className="mb-12" /></ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.1}>
                <div className="flex flex-col gap-3">
                  <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-blush)" }}>
                    {s.step}
                  </p>
                  <h3 className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Adoption Application Form */}
      <section id="apply" className="py-16 md:py-24" style={{ background: "var(--ubasti-sage)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <SectionTitle eyebrow="Apply to Adopt" title="Ready to Give a Cat a Home?" className="mb-8" />
          </ScrollReveal>
          <p className="text-base mb-8" style={{ color: "var(--ubasti-cream)", opacity: 0.9 }}>
            Fill out our adoption application below. We review every application personally and will be in touch within 2 business days.
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ minHeight: 600 }}>
            <iframe
              src={ADOPTION_FORM_URL}
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: "none", borderRadius: "1rem" }}
              title="Adoption Application Form"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl mb-6 text-center" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
            Adoption FAQs
          </h2>
          <div className="divide-y" style={{ borderColor: "var(--ubasti-blush)" }}>
            {[
              { q: "Is there an adoption fee?", a: "Yes — the adoption fee covers vaccinations, microchipping, and spay/neuter costs already completed. The exact fee depends on the cat." },
              { q: "Do you adopt outside Chennai?", a: "Currently we adopt locally within Chennai and nearby areas so we can conduct a home visit." },
              { q: "Can I adopt more than one cat?", a: "Absolutely — bonded pairs especially benefit from going together, and we encourage it!" },
              { q: "What if it's not working out?", a: "Please contact us. We never want a cat to be in a bad situation — we'll help re-home them if needed." },
              { q: "Do the cats get along with dogs?", a: "It varies by cat. Some of our cats are dog-friendly. Ask us during your visit and we'll give you an honest answer." },
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
