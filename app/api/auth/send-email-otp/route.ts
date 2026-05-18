import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { emailOtpCodes } from "@/lib/db/schema";
import { generateOtp, hashOtp, otpExpiresAt } from "@/lib/auth/otp";
import { sendEmail } from "@/lib/email";
import { checkSendEmailOtpLimit } from "@/lib/ratelimit";
import { audit } from "@/lib/audit";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: { email: string };
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const email = body.email.toLowerCase().trim();

  const limit = await checkSendEmailOtpLimit(email);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const code      = generateOtp();
  const codeHash  = await hashOtp(code);
  const expiresAt = otpExpiresAt();

  await db.insert(emailOtpCodes).values({
    email,
    codeHash,
    expiresAt,
    ipAddress: ip,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  await sendEmail({
    to: email,
    subject: "Your Ubasti login code",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:24px">
        <p style="font-size:18px;font-weight:600;color:#2B2E1F;margin-bottom:8px">Your Ubasti login code</p>
        <p style="font-size:14px;color:#95996D;margin-bottom:24px">Use this code to sign in. It expires in 5 minutes.</p>
        <div style="background:#FAF6F0;border:1px solid #F2D4CC;border-radius:12px;padding:24px;text-align:center;font-size:36px;font-weight:700;letter-spacing:8px;color:#535D3A">
          ${code}
        </div>
        <p style="font-size:12px;color:#B5BC91;margin-top:16px;text-align:center">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  await audit({
    action:     "email_otp.send",
    targetType: "email",
    targetId:   email,
    ipAddress:  ip,
  });

  return NextResponse.json({ ok: true });
}
