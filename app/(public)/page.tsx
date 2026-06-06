import { headers } from "next/headers";
import { fetchPage } from "@/lib/cms/page-renderer";
import { BlocksRenderer } from "@/lib/cms/blocks-renderer";
import { PageEditorClient } from "@/components/admin/PageEditorClient";

import { Hero }                  from "@/components/public/Hero";
import { HeroSections }          from "@/components/public/HeroSections";
import { AboutBlock }            from "@/components/public/AboutBlock";
import { SlideshowStrip }        from "@/components/public/SlideshowStrip";
import { VideoBackgroundBlock }  from "@/components/public/VideoBackgroundBlock";
import { CountersBlock }         from "@/components/public/CountersBlock";
import { BottomNavigationBlock } from "@/components/public/BottomNavigationBlock";
import { FaqSection }            from "@/components/public/FaqSection";
import { FAQ_BY_PAGE }          from "@/lib/content/faqs";
import { buildMetadata }         from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Cat Cafe & Adoption Lounge in Chennai",
  description: "Sip specialty coffee, cuddle resident rescue cats, and find your forever friend at Ubasti — Chennai's serene cat cafe & adoption lounge.",
  path: "/",
  keywords: ["cat cafe chennai", "ubasti cat cafe", "cat adoption chennai", "cat cafe near me"],
});

interface Props { searchParams: Promise<Record<string, string>> }

async function fetchStats(): Promise<{ rescued: number; atCafe: number; adopted: number }> {
  try {
    const { db } = await import("@/lib/db/client");
    const { kitties, siteSettings } = await import("@/lib/db/schema");
    const { count, inArray, eq } = await import("drizzle-orm");
    const [
      [{ rescued }], [{ atCafe }], [{ adopted }], overrideRow,
    ] = await Promise.all([
      db.select({ rescued: count() }).from(kitties),
      db.select({ atCafe: count() }).from(kitties).where(inArray(kitties.status, ["available", "on-hold", "reserved"])),
      db.select({ adopted: count() }).from(kitties).where(inArray(kitties.status, ["adopted"])),
      db.query.siteSettings.findFirst({ where: (s, { eq }) => eq(s.key, "impactCounters") }),
    ]);
    const override = (overrideRow?.value ?? {}) as { rescued?: number | null; atCafe?: number | null; adopted?: number | null };
    return {
      rescued: override.rescued != null ? override.rescued : Number(rescued),
      atCafe:  override.atCafe  != null ? override.atCafe  : Number(atCafe),
      adopted: override.adopted != null ? override.adopted : Number(adopted),
    };
  } catch {
    return { rescued: 0, atCafe: 0, adopted: 0 };
  }
}

export default async function HomePage({ searchParams }: Props) {
  const [hdrs, sp] = await Promise.all([headers(), searchParams]);
  const isAdmin  = hdrs.get("x-is-admin") === "true";
  const editMode = isAdmin && sp.edit === "1";

  const page = await fetchPage("home");

  if (page && (editMode || page.blocks.length > 0)) {
    const activeBlocks = editMode && page.draftBlocks ? page.draftBlocks : page.blocks;
    if (editMode) {
      return (
        <PageEditorClient
          slug="home"
          title={page.title}
          initialBlocks={activeBlocks}
          hasDraft={page.draftBlocks !== null}
        />
      );
    }
    const filteredBlocks = activeBlocks.filter((b) => b.type !== "offerings");
    return <BlocksRenderer blocks={filteredBlocks} />;
  }

  const stats = await fetchStats();
  return (
    <>
      {/* ── Panel stack ──────────────────────────────────────────────
          Hero (z:1) → Welcome (z:2, slides over Hero) →
          HeroSections (Offerings z:3, Lounge z:4, Book z:5 — sticky).
      ─────────────────────────────────────────────────────────────── */}
      <div className="panels-stack">
        <Hero />
        {/* Welcome — slides up over the Hero banner (wavy top clip-path) */}
        <AboutBlock />
        {/* Offerings → Lounge → Book — sticky stacking panels */}
        <HeroSections />
      </div>

      {/* ── Post-panel content ────────────────────────────────────────
          Slides over all sticky panels (z-index: 6 via post-panels class).
          Connect sits below the FAQ, just above the bottom nav.
      ─────────────────────────────────────────────────────────────── */}
      <div className="post-panels">
        <SlideshowStrip />
        <VideoBackgroundBlock />
        <CountersBlock {...stats} />
        <FaqSection title="Got Questions?" items={FAQ_BY_PAGE.home} />
        <BottomNavigationBlock />
      </div>
    </>
  );
}
