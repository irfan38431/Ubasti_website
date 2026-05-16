import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { appointments, users } from "@/lib/db/schema";
import { eq, and, gte, lte, isNull } from "drizzle-orm";
import { getSmsProvider } from "@/lib/sms";
import { audit } from "@/lib/audit";

// Vercel Cron calls this with Authorization: Bearer <CRON_SECRET>
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);       // +24h
  const windowEnd   = new Date(now.getTime() + 25 * 60 * 60 * 1000);       // +25h

  // Find confirmed appointments in the 24–25h window that haven't had a reminder sent
  let rows: Array<{
    id: string;
    slotStart: Date;
    userId: string;
  }> = [];

  try {
    rows = await db
      .select({ id: appointments.id, slotStart: appointments.slotStart, userId: appointments.userId })
      .from(appointments)
      .where(
        and(
          eq(appointments.status, "confirmed"),
          isNull(appointments.smsSentAt),
          gte(appointments.slotStart, windowStart),
          lte(appointments.slotStart, windowEnd),
        )
      );
  } catch (err) {
    console.error("[CRON] DB query failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const sms = getSmsProvider();
  let sent = 0;

  for (const row of rows) {
    try {
      const [user] = await db
        .select({ phoneE164: users.phoneE164, displayName: users.displayName })
        .from(users)
        .where(eq(users.id, row.userId))
        .limit(1);

      if (!user?.phoneE164) continue;

      const time = row.slotStart.toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata",
      });

      await sms.sendTransactional(user.phoneE164, "BOOKING_REMINDER", { time });

      // Mark reminder sent (reuse smsSentAt; reminders use same field to avoid schema change)
      await db
        .update(appointments)
        .set({ smsSentAt: new Date() })
        .where(eq(appointments.id, row.id));

      await audit({ action: "cron.reminder_sent", actorUserId: row.userId, payload: { appointmentId: row.id } });
      sent++;
    } catch (err) {
      console.error(`[CRON] Failed to send reminder for appointment ${row.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent, total: rows.length });
}
