/**
 * Run with: pnpm tsx scripts/seed-events.ts
 * Inserts 4 demo events into the events table.
 * Safe to run multiple times — skips events whose slug already exists.
 */

import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

// Dates relative to today — set to the next few weekends
function nextWeekend(weeksAhead: number, hour: number): Date {
  const d = new Date();
  const daysUntilSat = ((6 - d.getDay()) + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSat + weeksAhead * 7);
  d.setHours(hour, 0, 0, 0);
  return d;
}

const EVENTS = [
  {
    slug: "kitten-yoga-jun",
    title: "Kitten Yoga",
    description:
      "Unroll your mat, breathe deep, and let the kittens do the rest. A 60-minute gentle yoga session in the lounge with our feline co-instructors. All levels welcome.",
    startsAt: nextWeekend(1, 10),
    endsAt:   nextWeekend(1, 11),
    priceInr: 799,
    capacity: 10,
    isPublished: true,
  },
  {
    slug: "adoption-drive-jun",
    title: "Adoption Drive",
    description:
      "Meet our available rescue cats, get all your questions answered, and start the adoption process in person. Free entry. Bring the family!",
    startsAt: nextWeekend(2, 14),
    endsAt:   nextWeekend(2, 17),
    priceInr: 0,
    capacity: 30,
    isPublished: true,
  },
  {
    slug: "latte-art-workshop-jun",
    title: "Latte Art Workshop",
    description:
      "Learn to pour rosettes and tulips from our resident barista while cats supervise from nearby perches. Includes two lattes and one espresso shot of cat wisdom.",
    startsAt: nextWeekend(3, 11),
    endsAt:   nextWeekend(3, 13),
    priceInr: 1299,
    capacity: 8,
    isPublished: true,
  },
  {
    slug: "cat-care-101-jun",
    title: "Cat Care 101",
    description:
      "A practical workshop covering nutrition, enrichment, grooming, and vet basics. Ideal for new cat parents or anyone thinking about adopting. Q&A included.",
    startsAt: nextWeekend(4, 15),
    endsAt:   nextWeekend(4, 16),
    priceInr: 499,
    capacity: 15,
    isPublished: true,
  },
];

async function main() {
  console.log("Seeding demo events…\n");

  for (const ev of EVENTS) {
    const existing = await db
      .select({ id: schema.events.id })
      .from(schema.events)
      .where(sql`${schema.events.slug} = ${ev.slug}`)
      .limit(1);

    if (existing.length > 0) {
      console.log(`  skip  ${ev.slug} (already exists)`);
      continue;
    }

    await db.insert(schema.events).values({
      slug:        ev.slug,
      title:       ev.title,
      description: ev.description,
      startsAt:    ev.startsAt,
      endsAt:      ev.endsAt,
      location:    "Ubasti Cat Lounge, Chennai",
      priceInr:    ev.priceInr,
      capacity:    ev.capacity,
      isPublished: ev.isPublished,
    });

    console.log(`  added ${ev.slug}`);
  }

  console.log("\nDone.");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
