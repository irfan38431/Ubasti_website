import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { and, eq, gt, gte, lt, asc, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const filter  = searchParams.get("filter") ?? "upcoming"; // upcoming | past | this-month | next-month | free
  const now     = new Date();

  let rows: typeof events.$inferSelect[] = [];
  try {
    const base = and(eq(events.isPublished, true));

    if (filter === "past") {
      rows = await db.select().from(events)
        .where(and(base, lt(events.startsAt, now)))
        .orderBy(desc(events.startsAt)).limit(6);
    } else if (filter === "this-month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end   = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      rows = await db.select().from(events)
        .where(and(base, gte(events.startsAt, start), lt(events.startsAt, end)))
        .orderBy(asc(events.startsAt));
    } else if (filter === "next-month") {
      const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const end   = new Date(now.getFullYear(), now.getMonth() + 2, 1);
      rows = await db.select().from(events)
        .where(and(base, gte(events.startsAt, start), lt(events.startsAt, end)))
        .orderBy(asc(events.startsAt));
    } else if (filter === "free") {
      rows = await db.select().from(events)
        .where(and(base, gt(events.startsAt, now), eq(events.priceInr, 0)))
        .orderBy(asc(events.startsAt));
    } else {
      // upcoming (default)
      rows = await db.select().from(events)
        .where(and(base, gt(events.startsAt, now)))
        .orderBy(asc(events.startsAt));
    }
  } catch {
    // DB unavailable
  }

  return NextResponse.json({ events: rows });
}
