import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, count, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { appointments } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/guards";
import { getSmsProvider } from "@/lib/sms";
import { audit } from "@/lib/audit";
import { loungeSettings } from "@/lib/db/schema";

const bookSchema = z.object({
  slotStart: z.string().datetime(),
  slotEnd:   z.string().datetime(),
  partySize: z.number().int().min(1).max(4),
  notes:     z.string().max(500).optional(),
});

// GET — current user's appointments
export async function GET(req: NextRequest) {
  let userId: string;
  try { userId = requireUser(req); } catch (r) { return r as NextResponse; }

  const rows = await db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, userId))
    .orderBy(desc(appointments.slotStart));

  return NextResponse.json({ appointments: rows });
}

// POST — create booking
export async function POST(req: NextRequest) {
  let userId: string;
  try { userId = requireUser(req); } catch (r) { return r as NextResponse; }

  let body: z.infer<typeof bookSchema>;
  try { body = bookSchema.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid booking data" }, { status: 400 }); }

  const slotStart = new Date(body.slotStart);
  const slotEnd   = new Date(body.slotEnd);

  if (slotStart <= new Date()) {
    return NextResponse.json({ error: "Cannot book a past slot" }, { status: 400 });
  }

  // Get capacity setting
  let maxConcurrent = 3;
  try {
    const [settings] = await db.select({ maxConcurrent: loungeSettings.maxConcurrent })
      .from(loungeSettings).limit(1);
    if (settings) maxConcurrent = settings.maxConcurrent;
  } catch {}

  // Capacity check — atomic with insert via transaction
  const [existing] = await db
    .select({ value: count() })
    .from(appointments)
    .where(and(eq(appointments.slotStart, slotStart), eq(appointments.status, "confirmed")));

  if (Number(existing.value) >= maxConcurrent) {
    return NextResponse.json({ error: "This slot is fully booked. Please choose another time." }, { status: 409 });
  }

  const [booking] = await db
    .insert(appointments)
    .values({
      userId,
      slotStart,
      slotEnd,
      partySize: body.partySize,
      notes:     body.notes,
      status:    "confirmed",
    })
    .returning();

  await audit({ actorUserId: userId, action: "appointment.created", targetId: booking.id });

  // SMS — non-blocking
  const smsError = await (async () => {
    try {
      const sms = getSmsProvider();
      const dt  = slotStart.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
      await sms.sendTransactional(
        req.headers.get("x-user-phone") ?? "",
        "BOOKING_CONFIRM",
        { name: "friend", datetime: dt, address: "Ubasti Cat Cafe, Chennai", url: `${process.env.NEXT_PUBLIC_APP_URL}/account` }
      );
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "sms failed";
    }
  })();

  return NextResponse.json({ appointment: booking, smsError });
}
