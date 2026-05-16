import { headers } from "next/headers";
import { fetchPage } from "@/lib/cms/page-renderer";
import { BlocksRenderer } from "@/lib/cms/blocks-renderer";
import { PageEditorClient } from "@/components/admin/PageEditorClient";
import { Hero }              from "@/components/public/Hero";
import { Ideology }          from "@/components/public/Ideology";
import { OfferingsTriptych } from "@/components/public/OfferingsTriptych";
import { BookingCta }        from "@/components/public/BookingCta";
import { KittyTeaser }       from "@/components/public/KittyTeaser";
import { ContactForm }       from "@/components/public/ContactForm";

export const metadata = {
  title: "Ubasti — Cat Cafe & Lounge | Chennai",
};

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
    return <BlocksRenderer blocks={activeBlocks} />;
  }

  // Static fallback when DB has no blocks yet (dev without seed)
  return (
    <>
      <Hero />
      <Ideology />
      <OfferingsTriptych />
      <BookingCta />
      <KittyTeaser />
      <ContactForm />
    </>
  );
}
