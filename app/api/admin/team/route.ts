import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, admins } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq, desc } from "drizzle-orm";
import { audit } from "@/lib/audit";
import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js";

export async function GET(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }

  try {
    const rows = await db.select({
      id:          users.id,
      phoneE164:   users.phoneE164,
      displayName: users.displayName,
      isAdmin:     users.isAdmin,
      isRootAdmin: users.isRootAdmin,
      lastLoginAt: users.lastLoginAt,
      createdAt:   users.createdAt,
    }).from(users)
      .where(eq(users.isAdmin, true))
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ team: rows });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

const inviteSchema = z.object({
  phone:       z.string().min(1),
  displayName: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }

  const body   = await req.json();
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  let phoneE164: string;
  try {
    phoneE164 = parsePhoneNumber(parsed.data.phone, "IN").number;
  } catch {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  try {
    // Upsert user with is_admin = true
    const existing = await db.query.users.findFirst({ where: eq(users.phoneE164, phoneE164) });

    if (existing) {
      if (existing.isAdmin) return NextResponse.json({ error: "This user is already an admin" }, { status: 409 });
      await db.update(users).set({ isAdmin: true, displayName: parsed.data.displayName ?? existing.displayName }).where(eq(users.id, existing.id));
      await db.insert(admins).values({ userId: existing.id, addedBy: adminId }).onConflictDoNothing();
      void audit({ actorUserId: adminId, action: "admin.team.invite", targetType: "user", targetId: existing.id });
      return NextResponse.json({ ok: true, userId: existing.id });
    }

    // New user — create with is_admin flag; they'll complete login on first OTP
    const [newUser] = await db.insert(users).values({
      phoneE164,
      displayName: parsed.data.displayName,
      isAdmin: true,
    }).returning();
    await db.insert(admins).values({ userId: newUser.id, addedBy: adminId });
    void audit({ actorUserId: adminId, action: "admin.team.invite.new", targetType: "user", targetId: newUser.id });
    return NextResponse.json({ ok: true, userId: newUser.id }, { status: 201 });
  } catch (err) {
    console.error("[admin/team POST]", err);
    return NextResponse.json({ error: "Failed to invite" }, { status: 500 });
  }
}
