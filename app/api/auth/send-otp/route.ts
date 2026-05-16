import { NextRequest, NextResponse } from "next/server";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { otpCodes } from "@/lib/db/schema";
import { generateOtp, hashOtp, otpExpiresAt } from "@/lib/auth/otp";
import { getSmsProvider } from "@/lib/sms";
import { checkSendOtpLimits } from "@/lib/ratelimit";
import { audit } from "@/lib/audit";

const bodySchema = z.object({
  phone: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: { phone: string };
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate & normalise phone number
  if (!isValidPhoneNumber(body.phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 422 });
  }
  const parsed     = parsePhoneNumber(body.phone);
  const phoneE164  = parsed.format("E.164");

  // Rate limit
  const limit = await checkSendOtpLimits(phoneE164, ip);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  // Generate, hash, persist
  const code      = generateOtp();
  const codeHash  = await hashOtp(code);
  const expiresAt = otpExpiresAt();

  await db.insert(otpCodes).values({
    phoneE164,
    codeHash,
    expiresAt,
    ipAddress: ip,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  // Send
  const sms = getSmsProvider();
  await sms.sendOtp(phoneE164, code);

  await audit({
    action:    "otp.send",
    targetType: "phone",
    targetId:  phoneE164,
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
}
