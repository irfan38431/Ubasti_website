import { headers } from "next/headers";
import { fetchPage } from "@/lib/cms/page-renderer";
import { BlocksRenderer } from "@/lib/cms/blocks-renderer";
import { PageEditorClient } from "@/components/admin/PageEditorClient";

import { Hero }                  from "@/components/public/Hero";
import { HeadlineBlock }         from "@/components/public/HeadlineBlock";
import { AboutBlock }            from "@/components/public/AboutBlock";
import { SlideshowStrip }        from "@/components/public/SlideshowStrip";
import { ScallopDivider }        from "@/components/decorative/ScallopDivider";
import { VideoBackgroundBlock }  from "@/components/public/VideoBackgroundBlock";
import { CountersBlock }         from "@/components/public/CountersBlock";
import { ContactForm }           from "@/components/public/ContactForm";
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

  // Static home page: assembles all blocks with scallop dividers between sections
  return (
    <>
      {/* Task 2: Short hero — photo strip + centered wordmark. Scallop → ink */}
      <Hero />

      {/* Task 3: Dark headline block — H1 + 4 scattered cats. Scallop → cream */}
      <HeadlineBlock />

      {/* Task 4: About — two-column, arch photo, wavy underline */}
      <AboutBlock />

      {/* Scallop: cream → paper for offerings */}
      <ScallopDivider top="var(--ubasti-cream)" bottom="var(--ubasti-paper)" />

      {/* Task 5: Slideshow marquee strip */}
      <SlideshowStrip />

      {/* Task 6: Dedicated scallop-edge divider — paper → ink */}
      <ScallopDivider top="var(--ubasti-paper)" bottom="var(--ubasti-ink)" flip />

      {/* Task 7: Video background + wordmark overlay */}
      <VideoBackgroundBlock />

      {/* Scallop: ink → paper for counters */}
      <ScallopDivider top="var(--ubasti-ink)" bottom="var(--ubasti-paper)" />

      {/* Counters block */}
      <CountersBlock />

      {/* Scallop: paper → blush-light for connect */}
      <ScallopDivider top="var(--ubasti-paper)" bottom="var(--ubasti-blush-light)" flip />

      {/* Task 10: Connect with US — brand mark + Instagram handle + form */}
      <ContactForm />

      {/* FAQ */}
      <FaqSection title="Got Questions?" items={FAQ_BY_PAGE.home} />

      {/* Scallop: blush-light → ink for bottom nav */}
      <ScallopDivider top="var(--ubasti-blush-light)" bottom="var(--ubasti-ink)" />

      {/* Task 12: Bottom navigation block */}
      <BottomNavigationBlock />
    </>
  );
}
