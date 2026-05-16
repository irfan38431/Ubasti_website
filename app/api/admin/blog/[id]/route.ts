import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { blogPosts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq } from "drizzle-orm";
import { audit } from "@/lib/audit";
import { z } from "zod";

interface Ctx { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await ctx.params;
  try {
    const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post: row });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

const patchSchema = z.object({
  title:         z.string().min(1).max(300).optional(),
  slug:          z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  excerpt:       z.string().max(500).optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  bodyRichtext:  z.unknown().optional(),
  isPublished:   z.boolean().optional(),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await ctx.params;

  const body   = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const update: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
    if (parsed.data.isPublished === true) {
      const [existing] = await db.select({ publishedAt: blogPosts.publishedAt }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      if (!existing?.publishedAt) update.publishedAt = new Date();
    }
    await db.update(blogPosts).set(update).where(eq(blogPosts.id, id));
    void audit({ actorUserId: adminId, action: "admin.blog.update", targetType: "blog_post", targetId: id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/blog PATCH]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await ctx.params;

  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    void audit({ actorUserId: adminId, action: "admin.blog.delete", targetType: "blog_post", targetId: id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
