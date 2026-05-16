import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/webhooks/whatsapp
 * Meta webhook verification handshake.
 * Configure this URL in the Meta App Dashboard → WhatsApp → Webhooks.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST /api/webhooks/whatsapp
 * Receives delivery status updates and inbound message events from Meta.
 * We only log them — no blocking logic here.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Log delivery statuses for debugging; extend to DB writes as needed.
    for (const entry of body?.entry ?? []) {
      for (const change of entry?.changes ?? []) {
        const statuses = change?.value?.statuses ?? [];
        for (const s of statuses) {
          console.log(`[WhatsApp] message ${s.id} status: ${s.status} for ${s.recipient_id}`);
        }
      }
    }
  } catch {
    // Ignore parse errors — always return 200 so Meta doesn't retry
  }
  return NextResponse.json({ ok: true });
}
