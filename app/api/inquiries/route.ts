import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { privatePartyInquiries, users } from "@/lib/db/schema";
import { getSmsProvider } from "@/lib/sms";
import { audit } from "@/lib/audit";

const bodySchema = z.object({
  fullName:      z.string().min(1).max(100),
  phone:         z.string().min(1),  // already E.164 from client
  email:         z.string().email().optional().or(z.literal("")),
  requestedDate: z.string().date(),
  partySize:     z.number().int().min(2).max(50),
  occasion:      z.enum(["Birthday", "Anniversary", "Bachelorette", "Corporate", "Other"]),
  message:       z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof bodySchema>;
  try { body = bodySchema.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const [inquiry] = await db.insert(privatePartyInquiries).values({
    fullName:      body.fullName,
    phoneE164:     body.phone,
    email:         body.email || null,
    requestedDate: new Date(body.requestedDate),
    partySize:     body.partySize,
    occasion:      body.occasion,
    message:       body.message,
  }).returning();

  await audit({ action: "inquiry.submit", payload: { name: body.fullName, occasion: body.occasion } });

  // Notify root admin via SMS — non-blocking
  try {
    const [admin] = await db.select({ phoneE164: users.phoneE164 })
      .from(users).where(eq(users.isRootAdmin, true)).limit(1);
    if (admin?.phoneE164) {
      const sms = getSmsProvider();
      // Use DevProvider template format for the admin ping (not a DLT transactional)
      console.log(`[INQUIRY-SMS] New party inquiry from ${body.fullName} for ${body.requestedDate}. Check admin dashboard. → admin: ${admin.phoneE164}`);
      void sms; // will use proper template when DLT registered
    }
  } catch {}

  return NextResponse.json({ inquiry: { id: inquiry.id } });
}
