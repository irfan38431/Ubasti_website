import { NextRequest, NextResponse } from "next/server";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import { eq, and, isNull, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { otpCodes, users } from "@/lib/db/schema";
import { verifyOtp, MAX_ATTEMPTS } from "@/lib/auth/otp";
import { signSession, setSessionCookie } from "@/lib/auth/session";
import { checkVerifyOtpLimit } from "@/lib/ratelimit";
import { audit } from "@/lib/audit";

const bodySchema = z.object({
  phone: z.string().min(1),
  code:  z.string().length(6),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: { phone: string; code: string };
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isValidPhoneNumber(body.phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 422 });
  }
  const phoneE164 = parsePhoneNumber(body.phone).format("E.164");

  // Rate limit on verification
  const limit = await checkVerifyOtpLimit(phoneE164);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  // Find latest unverified, unexpired OTP for this phone
  const now = new Date();
  const [row] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.phoneE164, phoneE164),
        isNull(otpCodes.verifiedAt)
      )
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "No OTP found. Please request a new code." }, { status: 400 });
  }

  if (row.expiresAt < now) {
    return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 });
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many incorrect attempts. Please request a new code." },
      { status: 400 }
    );
  }

  const isMatch = await verifyOtp(body.code, row.codeHash);

  if (!isMatch) {
    await db
      .update(otpCodes)
      .set({ attempts: row.attempts + 1 })
      .where(eq(otpCodes.id, row.id));

    const remaining = MAX_ATTEMPTS - row.attempts - 1;
    return NextResponse.json(
      { error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` },
      { status: 400 }
    );
  }

  // Mark OTP used
  await db
    .update(otpCodes)
    .set({ verifiedAt: now })
    .where(eq(otpCodes.id, row.id));

  // Upsert user
  const [user] = await db
    .insert(users)
    .values({ phoneE164 })
    .onConflictDoUpdate({
      target:  users.phoneE164,
      set:     { lastLoginAt: now },
    })
    .returning();

  const token = await signSession({ sub: user.id, isAdmin: user.isAdmin });

  await audit({
    actorUserId: user.id,
    action:      "auth.login",
    ipAddress:   ip,
    userAgent:   req.headers.get("user-agent") ?? undefined,
  });

  const res = NextResponse.json({ user: { id: user.id, displayName: user.displayName, isAdmin: user.isAdmin } });
  return setSessionCookie(res, token);
}
