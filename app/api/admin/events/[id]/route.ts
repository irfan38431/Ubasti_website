import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq } from "drizzle-orm";
import { audit } from "@/lib/audit";
import { z } from "zod";

interface Ctx { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await ctx.params;
  try {
    const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ event: row });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

const patchSchema = z.object({
  title:         z.string().min(1).max(200).optional(),
  description:   z.string().max(500).optional(),
  bodyRichtext:  z.string().optional(),
  startsAt:      z.string().datetime().optional(),
  endsAt:        z.string().datetime().optional(),
  location:      z.string().max(200).optional(),
  capacity:      z.number().int().positive().nullable().optional(),
  priceInr:      z.number().int().min(0).nullable().optional(),
  coverImageUrl:   z.string().url().nullable().optional(),
  isPublished:     z.boolean().optional(),
  registrationUrl: z.string().url().nullable().optional(),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await ctx.params;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const update: Record<string, unknown> = { ...parsed.data, updatedBy: adminId };
    if (parsed.data.startsAt) update.startsAt = new Date(parsed.data.startsAt);
    if (parsed.data.endsAt)   update.endsAt   = new Date(parsed.data.endsAt);

    await db.update(events).set(update).where(eq(events.id, id));
    void audit({ actorUserId: adminId, action: "admin.event.update", targetType: "event", targetId: id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/events PATCH]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await ctx.params;

  try {
    await db.delete(events).where(eq(events.id, id));
    void audit({ actorUserId: adminId, action: "admin.event.delete", targetType: "event", targetId: id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
