import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, otpCodes } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq, and, gt, asc } from "drizzle-orm";
import { verifyOtp, MAX_ATTEMPTS } from "@/lib/auth/otp";
import { audit } from "@/lib/audit";
import { z } from "zod";

const transferSchema = z.object({
  newRootId: z.string().uuid(),
  otpCode:   z.string().length(6).regex(/^\d{6}$/),
});

export async function POST(req: NextRequest) {
  let adminId: string;
  try { adminId = requireAdmin(req); } catch (e) { return e as NextResponse; }

  const body   = await req.json();
  const parsed = transferSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { newRootId, otpCode } = parsed.data;

  try {
    // Verify caller is the current root admin
    const [caller] = await db.select({ isRootAdmin: users.isRootAdmin, phoneE164: users.phoneE164 }).from(users).where(eq(users.id, adminId)).limit(1);
    if (!caller?.isRootAdmin) return NextResponse.json({ error: "Only the current root admin can transfer root status" }, { status: 403 });

    if (newRootId === adminId) return NextResponse.json({ error: "You are already root admin" }, { status: 400 });

    const [newAdmin] = await db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.id, newRootId)).limit(1);
    if (!newAdmin) return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    if (!newAdmin.isAdmin) return NextResponse.json({ error: "Target user must be an admin first" }, { status: 400 });

    // Verify OTP for current root admin (requires a phone number)
    if (!caller.phoneE164) {
      return NextResponse.json({ error: "Root admin must have a phone number to use OTP-based transfer" }, { status: 400 });
    }
    const now     = new Date();
    const [record] = await db.select().from(otpCodes)
      .where(and(
        eq(otpCodes.phoneE164, caller.phoneE164),
        gt(otpCodes.expiresAt, now),
      ))
      .orderBy(asc(otpCodes.createdAt))
      .limit(1);

    if (!record) return NextResponse.json({ error: "No active OTP found. Request a new OTP first." }, { status: 400 });
    if (record.attempts >= MAX_ATTEMPTS) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

    await db.update(otpCodes).set({ attempts: record.attempts + 1 }).where(eq(otpCodes.id, record.id));
    const valid = await verifyOtp(otpCode, record.codeHash);
    if (!valid) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    await db.update(otpCodes).set({ verifiedAt: now }).where(eq(otpCodes.id, record.id));

    // Atomic swap: old root loses is_root_admin, new gets it
    await db.update(users).set({ isRootAdmin: false }).where(eq(users.id, adminId));
    await db.update(users).set({ isRootAdmin: true, isAdmin: true }).where(eq(users.id, newRootId));

    void audit({ actorUserId: adminId, action: "admin.team.transfer_root", targetType: "user", targetId: newRootId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/team/transfer]", err);
    return NextResponse.json({ error: "Transfer failed" }, { status: 500 });
  }
}
