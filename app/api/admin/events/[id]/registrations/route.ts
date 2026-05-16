import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { eventRegistrations, users } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq, and } from "drizzle-orm";
import { audit } from "@/lib/audit";

interface Ctx { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id } = await ctx.params;

  try {
    const rows = await db.select({
      id:        eventRegistrations.id,
      partySize: eventRegistrations.partySize,
      status:    eventRegistrations.status,
      createdAt: eventRegistrations.createdAt,
      userName:  users.displayName,
      userPhone: users.phoneE164,
    }).from(eventRegistrations)
      .leftJoin(users, eq(eventRegistrations.userId, users.id))
      .where(eq(eventRegistrations.eventId, id));

    return NextResponse.json({ registrations: rows });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }
  const { id: eventId } = await ctx.params;

  try {
    const { registrationId, status } = await req.json() as { registrationId?: string; status?: string };
    if (!registrationId || !status) return NextResponse.json({ error: "registrationId and status required" }, { status: 400 });

    await db.update(eventRegistrations)
      .set({ status })
      .where(and(eq(eventRegistrations.id, registrationId), eq(eventRegistrations.eventId, eventId)));

    void audit({ actorUserId: adminId, action: "admin.event.registration.update", targetType: "event_registration", targetId: registrationId });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
