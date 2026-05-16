import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { pages } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq } from "drizzle-orm";
import { BlocksArray } from "@/lib/cms/blocks";
import { audit } from "@/lib/audit";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  void adminId;

  const { slug } = await ctx.params;
  try {
    const [row] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    if (!row) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    return NextResponse.json({ page: row });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }

  const { slug } = await ctx.params;
  const body = await req.json() as { draftBlocks?: unknown };

  const parsed = BlocksArray.safeParse(body.draftBlocks);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid blocks", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    await db.update(pages).set({ draftBlocks: parsed.data, updatedAt: new Date(), updatedBy: adminId }).where(eq(pages.slug, slug));
    void audit({ actorUserId: adminId, action: "cms.page.draft", targetType: "page", targetId: slug });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}
