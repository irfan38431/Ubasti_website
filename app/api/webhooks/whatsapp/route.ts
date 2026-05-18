import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { adoptionRecords, adoptionCheckups } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    for (const entry of body?.entry ?? []) {
      for (const change of entry?.changes ?? []) {
        const value = change?.value ?? {};

        // Delivery statuses
        for (const s of value?.statuses ?? []) {
          console.log(`[WhatsApp] message ${s.id} status: ${s.status} for ${s.recipient_id}`);
        }

        // Inbound messages — check if sender is an adopter and store reply
        for (const msg of value?.messages ?? []) {
          const fromPhone = msg.from as string | undefined;
          if (!fromPhone) continue;

          const text      = msg.text?.body as string | undefined;
          const mediaId   = (msg.image ?? msg.video)?.id as string | undefined;

          if (!text && !mediaId) continue;

          // Look up an adoption record for this phone number
          const records = await db
            .select({ id: adoptionRecords.id })
            .from(adoptionRecords)
            .where(eq(adoptionRecords.adopterPhone, `+${fromPhone}`))
            .limit(1);

          if (records.length === 0) continue;

          // Find the most recently sent checkup for this record
          const checkups = await db
            .select({ id: adoptionCheckups.id })
            .from(adoptionCheckups)
            .where(and(
              eq(adoptionCheckups.adoptionRecordId, records[0].id),
              eq(adoptionCheckups.status, "sent"),
            ))
            .orderBy(adoptionCheckups.scheduledDate)
            .limit(1);

          if (checkups.length === 0) continue;

          // Build media URL if it's an image (requires Graph API call with token to get URL)
          let mediaUrl: string | null = null;
          if (mediaId && process.env.WHATSAPP_ACCESS_TOKEN) {
            try {
              const mediaMeta = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
                headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` },
              });
              const metaJson = await mediaMeta.json() as { url?: string };
              mediaUrl = metaJson.url ?? null;
            } catch {}
          }

          await db.update(adoptionCheckups)
            .set({ status: "responded", response: text ?? null, responseMediaUrl: mediaUrl })
            .where(eq(adoptionCheckups.id, checkups[0].id));
        }
      }
    }
  } catch (err) {
    console.error("[WhatsApp webhook]", err);
    // Always return 200 so Meta doesn't retry
  }
  return NextResponse.json({ ok: true });
}
