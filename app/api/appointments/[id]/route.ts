import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { appointments } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/guards";
import { getSmsProvider } from "@/lib/sms";
import { audit } from "@/lib/audit";

const patchSchema = z.object({
  action:       z.literal("cancel"),
  cancelReason: z.string().max(500).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  let userId: string;
  try { userId = requireUser(req); } catch (r) { return r as NextResponse; }

  const { id } = await ctx.params;

  let body: z.infer<typeof patchSchema>;
  try { body = patchSchema.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const [booking] = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const isAdmin   = req.headers.get("x-is-admin") === "true";
  const isOwner   = booking.userId === userId;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Users can only cancel 24h+ before
  if (!isAdmin && booking.slotStart.getTime() - Date.now() < 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Cancellations must be made at least 24 hours before the session." }, { status: 400 });
  }

  if (booking.status !== "confirmed") {
    return NextResponse.json({ error: "Booking is not in a cancellable state." }, { status: 400 });
  }

  const now = new Date();
  await db
    .update(appointments)
    .set({ status: "cancelled", cancelReason: body.cancelReason, cancelledAt: now, cancelledBy: userId })
    .where(eq(appointments.id, id));

  await audit({ actorUserId: userId, action: "appointment.cancelled", targetId: id });

  // SMS — non-blocking
  try {
    const sms = getSmsProvider();
    const dt  = booking.slotStart.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
    await sms.sendTransactional(
      "",
      "BOOKING_CANCEL",
      { name: "friend", datetime: dt, url: `${process.env.NEXT_PUBLIC_APP_URL}/book` }
    );
  } catch {}

  return NextResponse.json({ ok: true });
}
