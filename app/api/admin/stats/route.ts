import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { appointments, events, privatePartyInquiries, users, auditLog, adoptionRecords, emailSubscriptions } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq, gt, lt, gte, and, desc, count } from "drizzle-orm";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
  } catch (e) {
    return e as NextResponse;
  }

  try {
    const now       = new Date();
    const todayStart = startOfDay(now);
    const todayEnd   = endOfDay(now);

    const [
      [{ todayBookings }],
      [{ upcomingEvents }],
      [{ newInquiries }],
      [{ totalUsers }],
      [{ activeAdoptions }],
      [{ subscribers }],
      recentAudit,
    ] = await Promise.all([
      db.select({ todayBookings: count() }).from(appointments)
        .where(and(
          eq(appointments.status, "confirmed"),
          gte(appointments.slotStart, todayStart),
          lt(appointments.slotStart, todayEnd),
        )),
      db.select({ upcomingEvents: count() }).from(events)
        .where(and(eq(events.isPublished, true), gt(events.startsAt, now))),
      db.select({ newInquiries: count() }).from(privatePartyInquiries)
        .where(eq(privatePartyInquiries.status, "new")),
      db.select({ totalUsers: count() }).from(users),
      db.select({ activeAdoptions: count() }).from(adoptionRecords),
      db.select({ subscribers: count() }).from(emailSubscriptions)
        .where(eq(emailSubscriptions.status, "active")),
      db.select({
        id:          auditLog.id,
        action:      auditLog.action,
        targetType:  auditLog.targetType,
        targetId:    auditLog.targetId,
        actorUserId: auditLog.actorUserId,
        actorName:   users.displayName,
        createdAt:   auditLog.createdAt,
      }).from(auditLog)
        .leftJoin(users, eq(auditLog.actorUserId, users.id))
        .orderBy(desc(auditLog.createdAt)).limit(10),
    ]);

    return NextResponse.json({
      kpis: {
        todayBookings:    Number(todayBookings),
        upcomingEvents:   Number(upcomingEvents),
        newInquiries:     Number(newInquiries),
        totalUsers:       Number(totalUsers),
        activeAdoptions:  Number(activeAdoptions),
        subscribers:      Number(subscribers),
      },
      recentAudit,
    });
  } catch (err) {
    console.error("[admin/stats]", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
