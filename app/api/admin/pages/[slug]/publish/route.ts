import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { pages } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq } from "drizzle-orm";
import { audit } from "@/lib/audit";

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }

  const { slug } = await ctx.params;

  try {
    const [row] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    if (!row) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    if (!row.draftBlocks) return NextResponse.json({ error: "No draft to publish" }, { status: 400 });

    await db.update(pages).set({
      blocks:      row.draftBlocks,
      draftBlocks: null,
      updatedAt:   new Date(),
      updatedBy:   adminId,
    }).where(eq(pages.slug, slug));

    void audit({ actorUserId: adminId, action: "cms.page.publish", targetType: "page", targetId: slug });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 });
  }
}
