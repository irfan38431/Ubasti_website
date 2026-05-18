import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and, isNull, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { emailOtpCodes, users } from "@/lib/db/schema";
import { verifyOtp, MAX_ATTEMPTS } from "@/lib/auth/otp";
import { signSession, setSessionCookie } from "@/lib/auth/session";
import { checkVerifyEmailOtpLimit } from "@/lib/ratelimit";
import { audit } from "@/lib/audit";

const bodySchema = z.object({
  email: z.string().email(),
  code:  z.string().length(6),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: { email: string; code: string };
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email.toLowerCase().trim();

  const limit = await checkVerifyEmailOtpLimit(email);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const now = new Date();
  const [row] = await db
    .select()
    .from(emailOtpCodes)
    .where(and(eq(emailOtpCodes.email, email), isNull(emailOtpCodes.verifiedAt)))
    .orderBy(desc(emailOtpCodes.createdAt))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "No code found. Please request a new one." }, { status: 400 });
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
      .update(emailOtpCodes)
      .set({ attempts: row.attempts + 1 })
      .where(eq(emailOtpCodes.id, row.id));

    const remaining = MAX_ATTEMPTS - row.attempts - 1;
    return NextResponse.json(
      { error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` },
      { status: 400 }
    );
  }

  await db
    .update(emailOtpCodes)
    .set({ verifiedAt: now })
    .where(eq(emailOtpCodes.id, row.id));

  // Upsert user by email
  const [user] = await db
    .insert(users)
    .values({ email })
    .onConflictDoUpdate({
      target: users.email,
      set:    { lastLoginAt: now },
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
