import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { boardingBookings, users } from "@/lib/db/schema";
import { audit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const isAdmin = req.headers.get("x-is-admin") === "true";
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await db
    .select({
      id:          boardingBookings.id,
      stayType:    boardingBookings.stayType,
      foodOption:  boardingBookings.foodOption,
      checkIn:     boardingBookings.checkIn,
      checkOut:    boardingBookings.checkOut,
      petName:     boardingBookings.petName,
      petBreed:    boardingBookings.petBreed,
      petNotes:    boardingBookings.petNotes,
      status:      boardingBookings.status,
      adminNotes:  boardingBookings.adminNotes,
      createdAt:   boardingBookings.createdAt,
      userId:      boardingBookings.userId,
      userName:    users.displayName,
      userEmail:   users.email,
      userPhone:   users.phoneE164,
    })
    .from(boardingBookings)
    .leftJoin(users, eq(boardingBookings.userId, users.id))
    .orderBy(asc(boardingBookings.checkIn));

  return NextResponse.json({ bookings: rows });
}

const patchSchema = z.object({
  id:         z.string().uuid(),
  status:     z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  adminNotes: z.string().max(1000).optional(),
});

export async function PATCH(req: NextRequest) {
  const isAdmin = req.headers.get("x-is-admin") === "true";
  const actorId = req.headers.get("x-user-id");
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: z.infer<typeof patchSchema>;
  try {
    body = patchSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const update: Partial<typeof boardingBookings.$inferInsert> = {};
  if (body.status     !== undefined) update.status     = body.status;
  if (body.adminNotes !== undefined) update.adminNotes = body.adminNotes;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const [updated] = await db
    .update(boardingBookings)
    .set(update)
    .where(eq(boardingBookings.id, body.id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  await audit({
    actorUserId: actorId ?? undefined,
    action:      "boarding_booking.update",
    targetType:  "boarding_booking",
    targetId:    body.id,
    payload:     update,
  });

  return NextResponse.json({ booking: updated });
}
