import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { kitties } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { audit } from "@/lib/audit";

const patchSchema = z.object({
  name:        z.string().min(1).optional(),
  slug:        z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  age:         z.string().optional(),
  sex:         z.string().optional(),
  personality: z.string().optional(),
  bio:         z.string().optional(),
  imageUrl:    z.string().optional(),
  status:      z.enum(["available", "on-hold", "reserved", "adopted"]).optional(),
  sortOrder:   z.number().int().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await params;
  const [kitty] = await db.select().from(kitties).where(eq(kitties.id, id)).limit(1);
  if (!kitty) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ kitty });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let actorUserId: string;
  try { actorUserId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await params;

  let body: z.infer<typeof patchSchema>;
  try {
    body = patchSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const [kitty] = await db
    .update(kitties)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(kitties.id, id))
    .returning();

  if (!kitty) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await audit({
    actorUserId,
    action:     "kitty.update",
    targetType: "kitty",
    targetId:   id,
    payload:    body as Record<string, unknown>,
  });

  return NextResponse.json({ kitty });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let actorUserId: string;
  try { actorUserId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await params;

  const [kitty] = await db
    .delete(kitties)
    .where(eq(kitties.id, id))
    .returning();

  if (!kitty) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await audit({
    actorUserId,
    action:     "kitty.delete",
    targetType: "kitty",
    targetId:   id,
    payload:    { name: kitty.name },
  });

  return NextResponse.json({ ok: true });
}
