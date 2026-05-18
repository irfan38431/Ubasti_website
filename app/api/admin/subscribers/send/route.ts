import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { emailSubscriptions } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { sendEmail } from "@/lib/email";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }

  const { subject, body } = await req.json();
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
  }

  const subscribers = await db.select({ email: emailSubscriptions.email, token: emailSubscriptions.token })
    .from(emailSubscriptions).where(eq(emailSubscriptions.status, "active"));

  if (subscribers.length === 0) {
    return NextResponse.json({ sent: 0, message: "No active subscribers" });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ubasticats.com";
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const unsubUrl = `${baseUrl}/api/unsubscribe?token=${sub.token}`;
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <img src="${baseUrl}/images/placeholders/Ubasti Symbol_Pink.jpg" alt="Ubasti" style="width:48px;height:48px;border-radius:50%;margin-bottom:16px"/>
        <div style="white-space:pre-wrap;line-height:1.6;color:#333">${body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
        <p style="font-size:12px;color:#999">
          You're receiving this because you subscribed to updates from Ubasti Cat Café.<br/>
          <a href="${unsubUrl}" style="color:#999">Unsubscribe</a>
        </p>
      </div>
    `;
    try {
      await sendEmail({ to: sub.email, subject, html });
      sent++;
    } catch (err) {
      console.error(`[newsletter] failed for ${sub.email}`, err);
      failed++;
    }
  }

  return NextResponse.json({ sent, failed });
}
