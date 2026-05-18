import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { adoptionRecords, adoptionCheckups, kitties } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { requireAdmin(req); } catch (e) { return e as NextResponse; }

  const { id } = await params;
  const [record] = await db
    .select({
      id:           adoptionRecords.id,
      adopterName:  adoptionRecords.adopterName,
      adopterPhone: adoptionRecords.adopterPhone,
      adopterEmail: adoptionRecords.adopterEmail,
      adoptionDate: adoptionRecords.adoptionDate,
      notes:        adoptionRecords.notes,
      createdAt:    adoptionRecords.createdAt,
      kittyName:    kitties.name,
    })
    .from(adoptionRecords)
    .leftJoin(kitties, eq(adoptionRecords.kittyId, kitties.id))
    .where(eq(adoptionRecords.id, id));

  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const checkups = await db
    .select()
    .from(adoptionCheckups)
    .where(eq(adoptionCheckups.adoptionRecordId, id))
    .orderBy(adoptionCheckups.scheduledDate);

  return NextResponse.json({ record, checkups });
}
