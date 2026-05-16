import { headers } from "next/headers";
import { fetchPage } from "@/lib/cms/page-renderer";
import { BlocksRenderer } from "@/lib/cms/blocks-renderer";
import { PageEditorClient } from "@/components/admin/PageEditorClient";
import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Badge } from "@/components/ui/Badge";

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "About Ubasti — Our Story & Cats",
  description: "Meet the team and the rescue cats behind Ubasti Cat Cafe in Chennai. Our mission, the lounge, and how each visit supports cat welfare.",
  path: "/about",
});

const FAQ = [
  { q: "Do I need to book in advance?", a: "Yes — sessions are 60 minutes and slots fill up, especially on weekends. Book online at least a few hours ahead." },
  { q: "Is there an entry fee?", a: "No entry fee. Just buy a drink and enjoy the time with the cats. Pay on arrival." },
  { q: "Can I bring my own cat?", a: "No — resident cats have been carefully socialised together. Outside cats are not permitted for their wellbeing." },
  { q: "Are kids allowed?", a: "Children are welcome! Kids under 7 require one adult chaperone per two children. We ask everyone to be calm and gentle with the cats." },
  { q: "Can I adopt a cat from here?", a: "Yes! Visit the lounge, spend time with the cats, and speak to our team if you feel a connection. We'll guide you through the process." },
  { q: "Are you wheelchair accessible?", a: "Yes — the entire lounge is on a single level with step-free access." },
];

interface Props { searchParams: Promise<Record<string, string>> }

export default async function AboutPage({ searchParams }: Props) {
  const [hdrs, sp] = await Promise.all([headers(), searchParams]);
  const isAdmin  = hdrs.get("x-is-admin") === "true";
  const editMode = isAdmin && sp.edit === "1";

  const page = await fetchPage("about");

  if (page && (editMode || page.blocks.length > 0)) {
    const activeBlocks = editMode && page.draftBlocks ? page.draftBlocks : page.blocks;
    if (editMode) {
      return (
        <PageEditorClient
          slug="about"
          title={page.title}
          initialBlocks={activeBlocks}
          hasDraft={page.draftBlocks !== null}
        />
      );
    }
    return <BlocksRenderer blocks={activeBlocks} />;
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  // Static fallback
  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "var(--ubasti-cream)" }}>
        <div className="absolute bottom-8 right-12 hidden md:block">
          <Badge variant="sip-cuddle-relax" size={120} rotate={15} />
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="flex flex-col gap-6">
                <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>Our Story</p>
                <h1 className="text-5xl md:text-6xl leading-tight"
                  style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
                  Born from a love of cats, coffee &amp; community
                </h1>
                <p className="text-base leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
                  Ubasti started with a simple observation: Chennai has a million cat lovers, but nowhere to be a cat lover together.
                  We built the space we always wanted to exist — named after Bastet, the Egyptian goddess of home and cats,
                  who understood that a purring cat is one of life&apos;s quiet joys.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
                  Every cat in the lounge is a rescue. Every visit contributes to their care.
                  Every adoption sends a cat to a family that&apos;s been waiting for them.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src="/images/placeholders/about-story.svg" alt="The Ubasti lounge" fill className="object-cover" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: "var(--ubasti-sage)" }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { title: "Rescue First", body: "Every resident cat came from a difficult past. We partner with local shelters and work toward zero strays." },
              { title: "Slow Living", body: "No rushing. No noise. Just you, a cup, and an hour that actually feels like rest." },
              { title: "Open Doors", body: "Affordable, accessible, and welcoming to everyone — from curious first-timers to cat-obsessed regulars." },
            ].map((v) => (
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

      <section className="py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          <ScrollReveal>
            <SectionTitle eyebrow="FAQ" title="Common Questions" className="mb-12" />
          </ScrollReveal>
          <div className="max-w-2xl mx-auto divide-y" style={{ borderColor: "var(--ubasti-blush-light)" }}>
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
