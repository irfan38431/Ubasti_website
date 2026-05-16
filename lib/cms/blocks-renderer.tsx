import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { KittyTeaser } from "@/components/public/KittyTeaser";
import { ContactForm } from "@/components/public/ContactForm";
import { InquiryForm } from "@/components/parties/InquiryForm";
import type {
  AnyBlock,
  THeroBlock, TIdeologyBlock, TOfferingsBlock, TBookingCtaBlock,
  TStoryBlock, TValuesStripBlock, TFaqBlock, THeroCenteredBlock,
  TPerfectForBlock, TPricingTiersBlock, TRulesListBlock,
  TGalleryBlock, TInquiryFormBlock, TWaiverBlock,
} from "./blocks";

export function BlocksRenderer({ blocks }: { blocks: AnyBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockSwitch key={i} block={block} />
      ))}
    </>
  );
}

function BlockSwitch({ block }: { block: AnyBlock }) {
  switch (block.type) {
    case "hero":          return <HeroRenderer          block={block} />;
    case "ideology":      return <IdeologyRenderer      block={block} />;
    case "offerings":     return <OfferingsRenderer     block={block} />;
    case "booking_cta":   return <BookingCtaRenderer    block={block} />;
    case "kitty_teaser":  return <KittyTeaser />;
    case "contact_form":  return <ContactForm />;
    case "story":         return <StoryRenderer         block={block} />;
    case "values_strip":  return <ValuesStripRenderer   block={block} />;
    case "faq":           return <FaqRenderer           block={block} />;
    case "hero_centered": return <HeroCenteredRenderer  block={block} />;
    case "perfect_for":   return <PerfectForRenderer    block={block} />;
    case "pricing_tiers": return <PricingTiersRenderer  block={block} />;
    case "rules_list":    return <RulesListRenderer     block={block} />;
    case "gallery":       return <GalleryRenderer       block={block} />;
    case "inquiry_form":  return <InquiryFormRenderer   block={block} />;
    case "waiver":        return <WaiverRenderer        block={block} />;
    default:              return null;
  }
}

function HeroRenderer({ block: b }: { block: THeroBlock }) {
  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <Image src={b.imageUrl} alt="Ubasti cat cafe" fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: "var(--ubasti-overlay)" }} />
      </div>
      <div className="absolute top-8 right-8 md:top-12 md:right-12 hidden sm:block">
        <Badge variant="forever-friend" size={112} rotate={12} />
      </div>
      <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
        <div className="max-w-2xl flex flex-col gap-6">
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>{b.eyebrow}</p>
          <h1 className="text-5xl md:text-7xl leading-[1.05]"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-cream)", fontWeight: 700 }}>
            {b.heading.split("\\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h1>
          <p className="text-xl leading-relaxed"
            style={{ fontFamily: "var(--font-caveat)", color: "var(--ubasti-cream)", fontSize: "1.35rem", opacity: 0.9 }}>
            {b.subheading}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href={b.ctaHref}
              className="inline-flex h-14 items-center px-8 rounded-full font-medium text-base transition-opacity hover:opacity-90"
              style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}>
              {b.ctaText}
            </Link>
            {b.ctaSecondaryText && b.ctaSecondaryHref && (
              <Link href={b.ctaSecondaryHref}
                className="inline-flex h-14 items-center px-8 rounded-full font-medium text-base transition-colors"
                style={{ background: "rgba(242,224,205,0.15)", color: "var(--ubasti-cream)", border: "1px solid rgba(242,224,205,0.4)" }}>
                {b.ctaSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function IdeologyRenderer({ block: b }: { block: TIdeologyBlock }) {
  return (
    <section className="py-24 md:py-32" style={{ background: "var(--ubasti-paper)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-8">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>{b.eyebrow}</p>
            <h2 className="text-4xl md:text-6xl leading-tight"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
              {b.heading}
            </h2>
            {b.quote && (
              <p className="text-xl leading-relaxed"
                style={{ fontFamily: "var(--font-caveat)", color: "var(--ubasti-sage)", fontSize: "1.3rem" }}>
                &ldquo;{b.quote}&rdquo;
              </p>
            )}
            <p className="text-base leading-relaxed mx-auto max-w-xl" style={{ color: "var(--ubasti-sage)" }}>{b.body}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function OfferingsRenderer({ block: b }: { block: TOfferingsBlock }) {
  return (
    <section className="py-24 md:py-32" style={{ background: "var(--ubasti-cream)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <p className="text-sm font-bold uppercase tracking-widest text-center mb-12" style={{ color: "var(--ubasti-mustard)" }}>{b.eyebrow}</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {b.items.map((o, i) => (
            <ScrollReveal key={o.title} delay={i * 0.1}>
              <div className="rounded-2xl overflow-hidden flex flex-col"
                style={{ background: "var(--ubasti-white)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
                <div className="relative h-56">
                  <Image src={o.imageUrl} alt={o.title} fill className="object-cover" />
                  {o.badge && <div className="absolute top-4 right-4"><Badge variant={o.badge} size={72} rotate={-8} /></div>}
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <h3 className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>{o.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>{o.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingCtaRenderer({ block: b }: { block: TBookingCtaBlock }) {
  return (
    <section className="py-20 md:py-28 text-center" style={{ background: "var(--ubasti-sage)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}>{b.heading}</h2>
            <p className="text-lg max-w-md"
              style={{ fontFamily: "var(--font-caveat)", color: "var(--ubasti-cream)", fontSize: "1.25rem", opacity: 0.9 }}>{b.sub}</p>
            <Link href={b.ctaHref}
              className="inline-flex h-14 items-center px-10 rounded-full font-medium text-base transition-opacity hover:opacity-90 mt-2"
              style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}>{b.ctaText}</Link>
            {b.note && <p className="text-xs opacity-60" style={{ color: "var(--ubasti-cream)" }}>{b.note}</p>}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function StoryRenderer({ block: b }: { block: TStoryBlock }) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "var(--ubasti-cream)" }}>
      <div className="absolute bottom-8 right-12 hidden md:block">
        <Badge variant="sip-cuddle-relax" size={120} rotate={15} />
      </div>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="flex flex-col gap-6">
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>{b.eyebrow}</p>
              <h1 className="text-5xl md:text-6xl leading-tight"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>{b.heading}</h1>
              <p className="text-base leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>{b.body}</p>
              {b.body2 && <p className="text-base leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>{b.body2}</p>}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={b.imageUrl} alt={b.imageAlt} fill className="object-cover" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ValuesStripRenderer({ block: b }: { block: TValuesStripBlock }) {
  return (
    <section className="py-20" style={{ background: "var(--ubasti-sage)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {b.values.map((v) => (
            <ScrollReveal key={v.title}>
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ubasti-cream)", opacity: 0.85 }}>{v.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqRenderer({ block: b }: { block: TFaqBlock }) {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <SectionTitle eyebrow={b.eyebrow} title={b.heading} className="mb-12" />
        </ScrollReveal>
        <div className="max-w-2xl mx-auto divide-y" style={{ borderColor: "var(--ubasti-blush-light)" }}>
          {b.items.map((item) => (
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
  );
}

function HeroCenteredRenderer({ block: b }: { block: THeroCenteredBlock }) {
  const bg = b.background ?? "var(--ubasti-blush)";
  return (
    <section className="py-24 md:py-32 relative overflow-hidden text-center" style={{ background: bg }}>
      {b.badgeVariant && (
        <div className="absolute top-8 left-10 hidden md:block">
          <Badge variant={b.badgeVariant} size={110} rotate={-8} />
        </div>
      )}
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionTitle eyebrow={b.eyebrow} title={b.heading} subtitle={b.subtitle} />
      </div>
    </section>
  );
}

function PerfectForRenderer({ block: b }: { block: TPerfectForBlock }) {
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--ubasti-paper)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={b.imageUrl} alt={b.heading} fill className="object-cover" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col gap-5">
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>{b.eyebrow}</p>
              <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>{b.heading}</h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>{b.body}</p>
              <Link href={b.ctaHref}
                className="inline-flex h-12 items-center px-7 rounded-full font-medium text-sm w-fit transition-opacity hover:opacity-90"
                style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
                {b.ctaText}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function PricingTiersRenderer({ block: b }: { block: TPricingTiersBlock }) {
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--ubasti-cream)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <SectionTitle eyebrow={b.eyebrow} title={b.heading} className="mb-12" />
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {b.tiers.map((tier, i) => (
            <ScrollReveal key={tier.label} delay={i * 0.1}>
              <div className="rounded-2xl p-8 flex flex-col gap-4"
                style={{ background: i === 1 ? "var(--ubasti-olive-dark)" : "var(--ubasti-white)", color: i === 1 ? "var(--ubasti-cream)" : "var(--ubasti-ink)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60">{tier.sublabel}</p>
                  <h3 className="text-3xl mt-1" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}>{tier.label}</h3>
                </div>
                <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-cinzel)" }}>{tier.price}</p>
                <p className="text-sm opacity-70">{tier.duration} · {tier.capacity}</p>
                <ul className="flex flex-col gap-2 mt-2">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm"><span>✓</span>{p}</li>
                  ))}
                </ul>
                <a href="#inquiry"
                  className="mt-3 inline-flex h-11 items-center justify-center rounded-full font-medium text-sm transition-opacity hover:opacity-90"
                  style={{ background: i === 1 ? "var(--ubasti-blush)" : "var(--ubasti-olive-dark)", color: i === 1 ? "var(--ubasti-ink)" : "var(--ubasti-cream)" }}>
                  Book This
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
        {b.footnote && (
          <p className="text-center text-sm mt-6 opacity-70" style={{ color: "var(--ubasti-sage)" }}
            dangerouslySetInnerHTML={{ __html: b.footnote }} />
        )}
      </div>
    </section>
  );
}

function RulesListRenderer({ block: b }: { block: TRulesListBlock }) {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal>
          <SectionTitle eyebrow={b.eyebrow} title={b.heading} className="mb-10" />
        </ScrollReveal>
        <ul className="flex flex-col gap-3">
          {b.items.map((rule) => (
            <li key={rule} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
              <span className="mt-0.5 shrink-0 text-base" style={{ color: "var(--ubasti-mustard)" }}>🐱</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function GalleryRenderer({ block: b }: { block: TGalleryBlock }) {
  return (
    <section className="py-16" style={{ background: "var(--ubasti-cream)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        {b.eyebrow && (
          <p className="text-sm font-bold uppercase tracking-widest text-center mb-8" style={{ color: "var(--ubasti-mustard)" }}>{b.eyebrow}</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {b.images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={img.url} alt={img.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquiryFormRenderer({ block: b }: { block: TInquiryFormBlock }) {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-6">
        <ScrollReveal>
          <SectionTitle eyebrow={b.eyebrow} title={b.heading} className="mb-10" />
        </ScrollReveal>
        <InquiryForm />
      </div>
    </section>
  );
}

function WaiverRenderer({ block: b }: { block: TWaiverBlock }) {
  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl mb-8"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          Visitor Waiver &amp; Code of Conduct
        </h1>
        <div className="prose prose-sm max-w-none space-y-6 text-base leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
          <p className="text-sm uppercase tracking-widest font-bold" style={{ color: "var(--ubasti-mustard)" }}>
            Please read before your visit
          </p>
          {b.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl mb-2"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>{s.heading}</h2>
              <p dangerouslySetInnerHTML={{ __html: s.body }} />
            </section>
          ))}
          {b.updatedNote && (
            <p className="text-xs opacity-60 pt-4" style={{ borderTop: "1px solid var(--ubasti-blush-light)" }}>
              {b.updatedNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
