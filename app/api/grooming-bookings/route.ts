import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { groomingBookings, users } from "@/lib/db/schema";
import { audit } from "@/lib/audit";

const createSchema = z.object({
  services:      z.array(z.string().min(1)).min(1, "Select at least one service"),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  petName:       z.string().min(1).max(100),
  petBreed:      z.string().max(100).optional(),
  petNotes:      z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(groomingBookings)
    .where(eq(groomingBookings.userId, userId))
    .orderBy(desc(groomingBookings.createdAt));

  return NextResponse.json({ bookings: rows });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: z.infer<typeof createSchema>;
  try {
    body = createSchema.parse(await req.json());
  } catch (e) {
    const msg = e instanceof z.ZodError ? (e.issues[0]?.message ?? "Invalid request") : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Reject past dates
  const today = new Date().toISOString().slice(0, 10);
  if (body.scheduledDate < today) {
    return NextResponse.json({ error: "Please select a future date" }, { status: 422 });
  }

  const [booking] = await db
    .insert(groomingBookings)
    .values({
      userId,
      services:      body.services,
      scheduledDate: body.scheduledDate,
      petName:       body.petName,
      petBreed:      body.petBreed,
      petNotes:      body.petNotes,
    })
    .returning();

  await audit({
    actorUserId: userId,
    action:      "grooming_booking.create",
    targetType:  "grooming_booking",
    targetId:    booking.id,
    ipAddress:   req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
  });

  return NextResponse.json({ booking }, { status: 201 });
}
