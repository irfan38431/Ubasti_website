import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { adoptionRecords, adoptionCheckups, kitties } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq, desc } from "drizzle-orm";
import { addDays } from "date-fns";

const CHECKUP_DAYS = [7, 30, 180, 365, 730];

function intervalLabel(days: number): string {
  if (days === 7)   return "1 week";
  if (days === 30)  return "1 month";
  if (days === 180) return "6 months";
  if (days === 365) return "1 year";
  return `${Math.round(days / 365)} years`;
}

export async function GET(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }

  const records = await db
    .select({
      id:           adoptionRecords.id,
      adopterName:  adoptionRecords.adopterName,
      adopterPhone: adoptionRecords.adopterPhone,
      adopterEmail: adoptionRecords.adopterEmail,
      adoptionDate: adoptionRecords.adoptionDate,
      notes:        adoptionRecords.notes,
      createdAt:    adoptionRecords.createdAt,
      kittyName:    kitties.name,
      kittySlug:    kitties.slug,
    })
    .from(adoptionRecords)
    .leftJoin(kitties, eq(adoptionRecords.kittyId, kitties.id))
    .orderBy(desc(adoptionRecords.createdAt));

  return NextResponse.json({ records });
}

export async function POST(req: NextRequest) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }

  const { kittyId, adopterName, adopterPhone, adopterEmail, adoptionDate, notes } = await req.json();
  if (!kittyId || !adopterName || !adopterPhone || !adoptionDate) {
    return NextResponse.json({ error: "kittyId, adopterName, adopterPhone and adoptionDate are required" }, { status: 400 });
  }

  const date = new Date(adoptionDate);

  const [record] = await db.insert(adoptionRecords).values({
    kittyId,
    adopterName,
    adopterPhone,
    adopterEmail: adopterEmail || null,
    adoptionDate: date,
    notes: notes || null,
  }).returning();

  // Schedule checkup rows
  const checkupValues = CHECKUP_DAYS.map((days) => ({
    adoptionRecordId: record.id,
    scheduledDate:    addDays(date, days),
    status:           "pending" as const,
  }));
  await db.insert(adoptionCheckups).values(checkupValues);

  return NextResponse.json({ record }, { status: 201 });
}
