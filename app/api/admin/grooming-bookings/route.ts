import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { groomingBookings, users } from "@/lib/db/schema";
import { audit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const isAdmin = req.headers.get("x-is-admin") === "true";
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await db
    .select({
      id:            groomingBookings.id,
      services:      groomingBookings.services,
      scheduledDate: groomingBookings.scheduledDate,
      petName:       groomingBookings.petName,
      petBreed:      groomingBookings.petBreed,
      petNotes:      groomingBookings.petNotes,
      status:        groomingBookings.status,
      adminNotes:    groomingBookings.adminNotes,
      createdAt:     groomingBookings.createdAt,
      userId:        groomingBookings.userId,
      userName:      users.displayName,
      userEmail:     users.email,
      userPhone:     users.phoneE164,
    })
    .from(groomingBookings)
    .leftJoin(users, eq(groomingBookings.userId, users.id))
    .orderBy(desc(groomingBookings.createdAt));

  return NextResponse.json({ bookings: rows });
}

const patchSchema = z.object({
  id:         z.string().uuid(),
  status:     z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  adminNotes: z.string().max(1000).optional(),
});

export async function PATCH(req: NextRequest) {
  const isAdmin  = req.headers.get("x-is-admin") === "true";
  const actorId  = req.headers.get("x-user-id");
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: z.infer<typeof patchSchema>;
  try {
    body = patchSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const update: Partial<typeof groomingBookings.$inferInsert> = {};
  if (body.status     !== undefined) update.status     = body.status;
  if (body.adminNotes !== undefined) update.adminNotes = body.adminNotes;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const [updated] = await db
    .update(groomingBookings)
    .set(update)
    .where(eq(groomingBookings.id, body.id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  await audit({
    actorUserId: actorId ?? undefined,
    action:      "grooming_booking.update",
    targetType:  "grooming_booking",
    targetId:    body.id,
    payload:     update,
  });

  return NextResponse.json({ booking: updated });
}
