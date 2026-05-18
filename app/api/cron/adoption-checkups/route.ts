import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { adoptionCheckups, adoptionRecords, kitties } from "@/lib/db/schema";
import { getSmsProvider } from "@/lib/sms";
import { eq, and, lte } from "drizzle-orm";

function intervalLabel(days: number): string {
  if (days <= 8)    return "1 week";
  if (days <= 35)   return "1 month";
  if (days <= 200)  return "6 months";
  if (days <= 400)  return "1 year";
  return `${Math.round(days / 365)} years`;
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Find pending checkups due today or earlier
  const due = await db
    .select({
      checkupId:        adoptionCheckups.id,
      adoptionRecordId: adoptionCheckups.adoptionRecordId,
      scheduledDate:    adoptionCheckups.scheduledDate,
      adopterPhone:     adoptionRecords.adopterPhone,
      adopterName:      adoptionRecords.adopterName,
      adoptionDate:     adoptionRecords.adoptionDate,
      catName:          kitties.name,
    })
    .from(adoptionCheckups)
    .leftJoin(adoptionRecords, eq(adoptionCheckups.adoptionRecordId, adoptionRecords.id))
    .leftJoin(kitties, eq(adoptionRecords.kittyId, kitties.id))
    .where(and(eq(adoptionCheckups.status, "pending"), lte(adoptionCheckups.scheduledDate, now)));

  const sms = getSmsProvider();
  let sent = 0;
  let failed = 0;

  for (const checkup of due) {
    if (!checkup.adopterPhone || !checkup.adopterName || !checkup.catName) continue;
    const daysSinceAdoption = checkup.adoptionDate
      ? Math.round((checkup.scheduledDate.getTime() - checkup.adoptionDate.getTime()) / 86_400_000)
      : 0;
    try {
      await sms.sendTransactional(checkup.adopterPhone, "ADOPTION_CHECKUP", {
        adopter_name:   checkup.adopterName,
        cat_name:       checkup.catName,
        interval_label: intervalLabel(daysSinceAdoption),
      });
      await db.update(adoptionCheckups)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(adoptionCheckups.id, checkup.checkupId));
      sent++;
    } catch (err) {
      console.error(`[adoption-checkup] failed for ${checkup.adopterPhone}`, err);
      failed++;
    }
  }

  return NextResponse.json({ sent, failed });
}
