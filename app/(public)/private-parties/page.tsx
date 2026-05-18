import { headers } from "next/headers";
import { fetchPage } from "@/lib/cms/page-renderer";
import { BlocksRenderer } from "@/lib/cms/blocks-renderer";
import { PageEditorClient } from "@/components/admin/PageEditorClient";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { InquiryForm } from "@/components/parties/InquiryForm";

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Private Parties & Bookouts",
  description: "Host a cat-themed birthday, baby shower, or team offsite at Ubasti. Private buyout, custom menus, and cuddles included — Chennai.",
  path: "/private-parties",
  keywords: ["cat themed birthday party chennai", "private cat cafe booking", "kids party chennai cat cafe"],
});

const LOUNGE_TIERS = [
  { label: "Lounge Alone",    day: "Weekday", dayNote: "Mon – Thu", price: "₹4,999/hr", bg: "var(--ubasti-white)",      color: "var(--ubasti-ink)",   cta: "var(--ubasti-olive-dark)", ctaColor: "var(--ubasti-cream)" },
  { label: "Lounge Alone",    day: "Weekend", dayNote: "Fri – Sun", price: "₹6,999/hr", bg: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)", cta: "var(--ubasti-blush)",     ctaColor: "var(--ubasti-ink)" },
  { label: "Lounge + GF Cafe", day: "Weekday", dayNote: "Mon – Thu", price: "₹9,999/hr", bg: "var(--ubasti-sage)",       color: "var(--ubasti-cream)", cta: "var(--ubasti-olive-dark)", ctaColor: "var(--ubasti-cream)" },
  { label: "Lounge + GF Cafe", day: "Weekend", dayNote: "Fri – Sun", price: "₹13,999/hr",bg: "var(--ubasti-blush)",     color: "var(--ubasti-ink)",   cta: "var(--ubasti-olive-dark)", ctaColor: "var(--ubasti-cream)" },
];
const WHOLE_MANOR = { weekday: "₹14,999/hr", weekend: "₹16,999/hr" };
const RULES = [
  "Food & decor not included",
  "Cake can be ordered from outside",
  "Decor in the lounge must be confirmed 2 days prior — poppers, balloons, and sprays not allowed",
  "Banner only in the designated area",
  "Guests must be 6+ years old (children under 7 need 1 adult chaperone per 2 children)",
  "Maximum 12 guests per party booking",
  "No glitter, confetti inside the lounge — the cats say absolutely not",
  "No fish, strong-smelling foods, or heavy fragrances",
  "Outside alcohol not permitted",
];
const FAQ = [
  { q: "Is a deposit required?", a: "Yes — 30% advance to confirm the booking. Refundable up to 7 days before the event." },
  { q: "Can we bring a DJ or live music?", a: "We're a calm space — amplified music isn't permitted. We're happy to run a custom Spotify playlist for you." },
  { q: "Is alcohol allowed?", a: "Outside alcohol is not permitted. We can arrange a mocktail or soft drinks menu on request." },
  { q: "Can we extend beyond 70 minutes?", a: "Yes — for an additional fee and subject to availability. Mention this in your inquiry." },
  { q: "Do the cats participate in the party?", a: "Always — that's the whole point! But cats choose their own social schedule. We can't guarantee every cat will be front and centre." },
];
const GALLERY = Array.from({ length: 6 }, (_, i) => `/images/placeholders/party-gallery-${i + 1}.svg`);

interface Props { searchParams: Promise<Record<string, string>> }

export default async function PrivatePartiesPage({ searchParams }: Props) {
  const [hdrs, sp] = await Promise.all([headers(), searchParams]);
  const isAdmin  = hdrs.get("x-is-admin") === "true";
  const editMode = isAdmin && sp.edit === "1";

  const page = await fetchPage("private-parties");

  if (page && (editMode || page.blocks.length > 0)) {
    const activeBlocks = editMode && page.draftBlocks ? page.draftBlocks : page.blocks;
    if (editMode) {
      return (
        <PageEditorClient
          slug="private-parties"
          title={page.title}
          initialBlocks={activeBlocks}
          hasDraft={page.draftBlocks !== null}
        />
      );
    }
    return <BlocksRenderer blocks={activeBlocks} />;
  }

  // Static fallback
  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      <section className="py-24 md:py-32 relative overflow-hidden text-center" style={{ background: "var(--ubasti-blush)" }}>
        <div className="absolute top-8 left-10 hidden md:block">
          <Badge variant="purrfect-partners" size={110} rotate={-8} />
        </div>
        <div className="max-w-[1280px] mx-auto px-6">
          <SectionTitle eyebrow="Celebrate with Cats" title="Ready to Pawty?" subtitle="rent the lounge for your perfect celebration" />
        </div>
      </section>

      <section className="py-20 md:py-28" style={{ background: "var(--ubasti-paper)" }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src="/images/placeholders/party-birthday.svg" alt="Party at Ubasti" fill className="object-cover" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="flex flex-col gap-5">
                <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>Perfect For</p>
                <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
                  Every Celebration That Deserves a Cat
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
                  Birthdays · Anniversaries · Bachelorettes · Small corporate meetups · Or any moment worth remembering with cats.
                </p>
                <Link href="#inquiry" className="inline-flex h-12 items-center px-7 rounded-full font-medium text-sm w-fit transition-opacity hover:opacity-90"
                  style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
                  Send an Inquiry →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal><SectionTitle eyebrow="Pricing" title="Choose Your Day" className="mb-12" /></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {LOUNGE_TIERS.map((tier, i) => (
              <ScrollReveal key={`${tier.label}-${tier.day}`} delay={i * 0.1}>
                <div className="rounded-2xl p-8 flex flex-col gap-4"
                  style={{ background: tier.bg, color: tier.color, boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">{tier.dayNote}</p>
                    <h3 className="text-2xl mt-1" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}>{tier.label}</h3>
                    <p className="text-sm opacity-70">{tier.day}</p>
                  </div>
                  <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-cinzel)" }}>{tier.price}</p>
                  <a href="#inquiry" className="mt-2 inline-flex h-11 items-center justify-center rounded-full font-medium text-sm transition-opacity hover:opacity-90"
                    style={{ background: tier.cta, color: tier.ctaColor }}>Book This</a>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.4}>
            <div className="mt-6 rounded-2xl p-8 max-w-3xl mx-auto"
              style={{ background: "var(--ubasti-ink)", color: "var(--ubasti-cream)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
              <h3 className="text-3xl mb-4" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}>Whole Manor</h3>
              <div className="flex gap-8 flex-wrap">
                <div>
                  <p className="text-xs opacity-60 uppercase tracking-widest mb-1">Weekday</p>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-cinzel)" }}>{WHOLE_MANOR.weekday}</p>
                </div>
                <div>
                  <p className="text-xs opacity-60 uppercase tracking-widest mb-1">Weekend</p>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-cinzel)" }}>{WHOLE_MANOR.weekend}</p>
                </div>
              </div>
              <a href="#inquiry" className="mt-6 inline-flex h-11 items-center px-7 rounded-full font-medium text-sm transition-opacity hover:opacity-90"
                style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}>Book This</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal><SectionTitle eyebrow="Good to Know" title="House Rules" className="mb-10" /></ScrollReveal>
          <ul className="flex flex-col gap-3">
            {RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
                <span className="mt-0.5 shrink-0" style={{ color: "var(--ubasti-mustard)", fontSize: "0.9rem" }}>✦</span>{rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <p className="text-sm font-bold uppercase tracking-widest text-center mb-8" style={{ color: "var(--ubasti-mustard)" }}>The Lounge</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={src} alt={`Party gallery ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal><SectionTitle eyebrow="Get in Touch" title="Send an Inquiry" className="mb-10" /></ScrollReveal>
          <ScrollReveal delay={0.05}>
            <div className="mb-8 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ background: "var(--ubasti-blush)", border: "1px solid var(--ubasti-blush-light)" }}>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>Prefer to Call?</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
                  Reach us directly to discuss your event, check availability, or ask any questions.
                </p>
              </div>
              <a
                href="tel:+919384284888"
                className="shrink-0 inline-flex items-center h-11 px-6 rounded-full font-medium text-sm transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
              >
                +91 93842 84888
              </a>
            </div>
          </ScrollReveal>
          <InquiryForm />
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: "var(--ubasti-cream)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal><SectionTitle eyebrow="FAQ" title="Party Questions" className="mb-10" /></ScrollReveal>
          <div className="divide-y" style={{ borderColor: "var(--ubasti-blush-light)" }}>
            {FAQ.map((item) => (
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
