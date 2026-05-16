import { NextRequest, NextResponse } from "next/server";
import { getSlotsForDate } from "@/lib/booking/slots";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const slots = await getSlotsForDate(date);
  return NextResponse.json({
    slots: slots.map((s) => ({
      start:   s.start.toISOString(),
      end:     s.end.toISOString(),
      label:   s.label,
      full:    s.full,
      blocked: s.blocked,
    })),
  });
}
