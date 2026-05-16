import { db } from "@/lib/db/client";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BlocksRenderer } from "./blocks-renderer";
import { PageEditorClient } from "@/components/admin/PageEditorClient";
import type { AnyBlock } from "./blocks";

export interface PageData {
  slug:        string;
  title:       string;
  blocks:      AnyBlock[];
  draftBlocks: AnyBlock[] | null;
  isPublished: boolean;
}

export async function fetchPage(slug: string): Promise<PageData | null> {
  try {
    const [row] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    if (!row) return null;
    return {
      slug:        row.slug,
      title:       row.title,
      blocks:      (row.blocks as AnyBlock[]) ?? [],
      draftBlocks: (row.draftBlocks as AnyBlock[] | null) ?? null,
      isPublished: row.isPublished,
    };
  } catch {
    return null;
  }
}

interface Props {
  slug:     string;
  editMode: boolean;
}

export async function PageRenderer({ slug, editMode }: Props) {
  const page = await fetchPage(slug);
  if (!page) return null;

  const activeBlocks = editMode && page.draftBlocks ? page.draftBlocks : page.blocks;

  if (editMode) {
    return (
      <PageEditorClient
        slug={slug}
        title={page.title}
        initialBlocks={activeBlocks}
        hasDraft={page.draftBlocks !== null}
      />
    );
  }

  return <BlocksRenderer blocks={activeBlocks} />;
}
