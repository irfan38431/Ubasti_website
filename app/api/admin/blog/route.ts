import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { blogPosts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { desc } from "drizzle-orm";
import { audit } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }
  try {
    const rows = await db.select({
      id:          blogPosts.id,
      slug:        blogPosts.slug,
      title:       blogPosts.title,
      isPublished: blogPosts.isPublished,
      publishedAt: blogPosts.publishedAt,
      updatedAt:   blogPosts.updatedAt,
    }).from(blogPosts).orderBy(desc(blogPosts.updatedAt)).limit(100);
    return NextResponse.json({ posts: rows });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

const createSchema = z.object({
  slug:          z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title:         z.string().min(1).max(300),
  excerpt:       z.string().max(500).optional(),
  coverImageUrl: z.string().url().optional(),
  bodyRichtext:  z.unknown().optional(),
  isPublished:   z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }

  const body   = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const now = new Date();
    const [row] = await db.insert(blogPosts).values({
      ...parsed.data,
      bodyRichtext: parsed.data.bodyRichtext ?? {},
      publishedAt:  parsed.data.isPublished ? now : undefined,
      authorId:     adminId,
    }).returning();

    void audit({ actorUserId: adminId, action: "admin.blog.create", targetType: "blog_post", targetId: row.id });
    return NextResponse.json({ post: row }, { status: 201 });
  } catch (err) {
    console.error("[admin/blog POST]", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
