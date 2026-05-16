import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { appointments } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/guards";
import { createEvent } from "ics";

type RouteContext = { params: Promise<{ id: string }> };

function dateToArray(d: Date): [number, number, number, number, number] {
  return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes()];
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  let userId: string;
  try { userId = requireUser(req); } catch (r) { return r as NextResponse; }

  const { id } = await ctx.params;
  const [booking] = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);

  if (!booking || booking.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error, value } = createEvent({
    uid:         `${booking.id}@ubasti.cafe`,
    title:       "Ubasti Cat Cafe Session",
    description: `Lounge session for ${booking.partySize} guest${booking.partySize > 1 ? "s" : ""}. Pay on arrival.`,
    location:    "Ubasti Cat Cafe & Lounge, Chennai, Tamil Nadu, India",
    start:       dateToArray(booking.slotStart),
    end:         dateToArray(booking.slotEnd),
    startInputType: "utc",
    endInputType:   "utc",
    url:         `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    organizer:   { name: "Ubasti Cat Cafe", email: "hello@ubasti.cafe" },
    status:      "CONFIRMED",
  });

  if (error || !value) {
    return NextResponse.json({ error: "Could not generate calendar file" }, { status: 500 });
  }

  return new NextResponse(value, {
    headers: {
      "Content-Type":        "text/calendar",
      "Content-Disposition": `attachment; filename="ubasti-session.ics"`,
    },
  });
}
