import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, count } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { events, eventRegistrations, users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/guards";
import { getSmsProvider } from "@/lib/sms";
import { audit } from "@/lib/audit";
import { formatInTimeZone } from "date-fns-tz";

const TZ = "Asia/Kolkata";
type RouteContext = { params: Promise<{ slug: string }> };

const bodySchema = z.object({ partySize: z.number().int().min(1).max(4).default(1) });

export async function POST(req: NextRequest, ctx: RouteContext) {
  let userId: string;
  try { userId = requireUser(req); } catch (r) { return r as NextResponse; }

  const { slug } = await ctx.params;

  let body: z.infer<typeof bodySchema>;
  try { body = bodySchema.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const [event] = await db.select().from(events)
    .where(and(eq(events.slug, slug), eq(events.isPublished, true))).limit(1);

  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  // Check capacity
  if (event.capacity) {
    const [{ value }] = await db.select({ value: count() }).from(eventRegistrations)
      .where(and(eq(eventRegistrations.eventId, event.id), eq(eventRegistrations.status, "confirmed")));
    if (Number(value) >= event.capacity) {
      return NextResponse.json({ error: "This event is fully booked." }, { status: 409 });
    }
  }

  // Check duplicate
  const [existing] = await db.select().from(eventRegistrations)
    .where(and(eq(eventRegistrations.eventId, event.id), eq(eventRegistrations.userId, userId))).limit(1);
  if (existing) return NextResponse.json({ error: "You are already registered for this event." }, { status: 409 });

  const [reg] = await db.insert(eventRegistrations)
    .values({ eventId: event.id, userId, partySize: body.partySize, status: "confirmed" })
    .returning();

  await audit({ actorUserId: userId, action: "event.register", targetId: event.id });

  // SMS — non-blocking
  try {
    const [user] = await db.select({ phoneE164: users.phoneE164, displayName: users.displayName })
      .from(users).where(eq(users.id, userId)).limit(1);
    if (user?.phoneE164) {
      const sms = getSmsProvider();
      const dt  = formatInTimeZone(new Date(event.startsAt), TZ, "d MMM yyyy, h:mm aa");
      await sms.sendTransactional(user.phoneE164, "EVENT_CONFIRM", {
        name:        user.displayName ?? "friend",
        event_title: event.title,
        datetime:    dt,
        url:         `${process.env.NEXT_PUBLIC_APP_URL}/events/${slug}`,
      });
    }
  } catch {}

  return NextResponse.json({ registration: reg });
}
