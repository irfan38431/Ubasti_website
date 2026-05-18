import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { desc } from "drizzle-orm";
import { audit } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
  } catch (e) {
    return e as NextResponse;
  }

  try {
    const rows = await db.select().from(events).orderBy(desc(events.startsAt)).limit(100);
    return NextResponse.json({ events: rows });
  } catch (err) {
    console.error("[admin/events GET]", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

const createSchema = z.object({
  title:         z.string().min(1).max(200),
  slug:          z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description:   z.string().max(500).optional(),
  startsAt:      z.string().datetime(),
  endsAt:        z.string().datetime(),
  location:      z.string().max(200).optional(),
  capacity:      z.number().int().positive().optional(),
  priceInr:      z.number().int().min(0).optional(),
  coverImageUrl:   z.string().url().optional(),
  isPublished:     z.boolean().default(false),
  registrationUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  let adminId: string;
  try {
    adminId = requireAdmin(req);
  } catch (e) {
    return e as NextResponse;
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const [row] = await db.insert(events).values({
      ...parsed.data,
      startsAt:  new Date(parsed.data.startsAt),
      endsAt:    new Date(parsed.data.endsAt),
      createdBy: adminId,
      updatedBy: adminId,
    }).returning();

    void audit({ actorUserId: adminId, action: "admin.event.create", targetType: "event", targetId: row.id });
    return NextResponse.json({ event: row }, { status: 201 });
  } catch (err) {
    console.error("[admin/events POST]", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
