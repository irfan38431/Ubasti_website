import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { boardingBookings } from "@/lib/db/schema";
import { audit } from "@/lib/audit";

const createSchema = z.object({
  stayType:    z.enum(["lounge", "enclosure"]),
  foodOption:  z.enum(["ubasti", "own"]),
  checkIn:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid check-in date"),
  checkOut:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid check-out date"),
  petName:     z.string().min(1).max(100),
  petBreed:    z.string().max(100).optional(),
  petNotes:    z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(boardingBookings)
    .where(eq(boardingBookings.userId, userId))
    .orderBy(desc(boardingBookings.createdAt));

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

  const today = new Date().toISOString().slice(0, 10);
  if (body.checkIn < today) {
    return NextResponse.json({ error: "Check-in must be today or later" }, { status: 422 });
  }
  if (body.checkOut <= body.checkIn) {
    return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 422 });
  }

  const [booking] = await db
    .insert(boardingBookings)
    .values({
      userId,
      stayType:   body.stayType,
      foodOption: body.foodOption,
      checkIn:    body.checkIn,
      checkOut:   body.checkOut,
      petName:    body.petName,
      petBreed:   body.petBreed,
      petNotes:   body.petNotes,
    })
    .returning();

  await audit({
    actorUserId: userId,
    action:      "boarding_booking.create",
    targetType:  "boarding_booking",
    targetId:    booking.id,
    ipAddress:   req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
  });

  return NextResponse.json({ booking }, { status: 201 });
}
