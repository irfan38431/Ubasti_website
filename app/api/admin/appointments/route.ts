import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { appointments, users } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq, gte, lt, lte, and, desc, asc, inArray } from "drizzle-orm";
import { startOfDay, endOfDay } from "date-fns";
import { audit } from "@/lib/audit";

const COLS = {
  id:            appointments.id,
  userId:        appointments.userId,
  slotStart:     appointments.slotStart,
  slotEnd:       appointments.slotEnd,
  partySize:     appointments.partySize,
  status:        appointments.status,
  cancelReason:  appointments.cancelReason,
  cancelledAt:   appointments.cancelledAt,
  notes:         appointments.notes,
  adminNotes:    appointments.adminNotes,
  createdAt:     appointments.createdAt,
  userName:      users.displayName,
  userPhone:     users.phoneE164,
};

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
  } catch (e) {
    return e as NextResponse;
  }

  const { searchParams } = req.nextUrl;
  const tab    = searchParams.get("tab") ?? "today";
  const format = searchParams.get("format");
  const now    = new Date();

  try {
    const base = () => db.select(COLS).from(appointments).leftJoin(users, eq(appointments.userId, users.id));

    let rows: Array<{
      id: string; userId: string; slotStart: Date; slotEnd: Date; partySize: number;
      status: string; cancelReason: string | null; cancelledAt: Date | null;
      notes: string | null; adminNotes: string | null; createdAt: Date;
      userName: string | null; userPhone: string | null;
    }> = [];

    if (tab === "today") {
      rows = await base().where(and(
        eq(appointments.status, "confirmed"),
        gte(appointments.slotStart, startOfDay(now)),
        lte(appointments.slotStart, endOfDay(now)),
      )).orderBy(asc(appointments.slotStart));
    } else if (tab === "upcoming") {
      rows = await base().where(and(
        eq(appointments.status, "confirmed"),
        gte(appointments.slotStart, endOfDay(now)),
      )).orderBy(asc(appointments.slotStart)).limit(100);
    } else if (tab === "past") {
      rows = await base().where(and(
        inArray(appointments.status, ["confirmed", "completed", "no-show"]),
        lt(appointments.slotStart, startOfDay(now)),
      )).orderBy(desc(appointments.slotStart)).limit(100);
    } else {
      rows = await base().where(eq(appointments.status, "cancelled"))
        .orderBy(desc(appointments.cancelledAt)).limit(100);
    }

    if (format === "csv") {
      const header = "id,user,phone,slot_start,slot_end,party_size,status,notes,created_at";
      const lines  = rows.map((r) =>
        [r.id, r.userName ?? "", r.userPhone ?? "", r.slotStart, r.slotEnd, r.partySize, r.status, (r.notes ?? "").replace(/,/g, " "), r.createdAt].join(",")
      );
      return new NextResponse([header, ...lines].join("\n"), {
        headers: {
          "Content-Type":        "text/csv",
          "Content-Disposition": `attachment; filename="appointments-${tab}-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ appointments: rows });
  } catch (err) {
    console.error("[admin/appointments]", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  let adminId: string;
  try {
    adminId = requireAdmin(req);
  } catch (e) {
    return e as NextResponse;
  }

  try {
    const { id, adminNotes, status } = await req.json() as { id?: string; adminNotes?: string; status?: string };
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const update: Partial<typeof appointments.$inferInsert> = {};
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    if (status     !== undefined) update.status     = status;

    await db.update(appointments).set(update).where(eq(appointments.id, id));

    void audit({
      actorUserId: adminId,
      action:      "admin.appointment.update",
      targetType:  "appointment",
      targetId:    id,
      payload:     update as Record<string, unknown>,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/appointments PATCH]", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
