#!/usr/bin/env tsx
/**
 * Idempotent seed — safe to re-run.
 * Requires DATABASE_URL in env (or .env.local loaded externally).
 */
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../lib/db/schema";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL not set");

const client = postgres(DB_URL, { prepare: false });
const db = drizzle(client, { schema });

const ADMIN_PHONE = process.env.SEED_ROOT_ADMIN_PHONE ?? "+919445077270";
const ADMIN_NAME  = process.env.SEED_ROOT_ADMIN_NAME  ?? "Irfan";

async function main() {
  console.log("Seeding database...");

  // 1. Root admin user
  const [admin] = await db
    .insert(schema.users)
    .values({
      phoneE164:   ADMIN_PHONE,
      displayName: ADMIN_NAME,
      isAdmin:     true,
      isRootAdmin: true,
    })
    .onConflictDoNothing({ target: schema.users.phoneE164 })
    .returning();

  const adminId = admin?.id ?? (
    await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.phoneE164, ADMIN_PHONE),
    })
  )?.id;

  if (adminId) {
    await db
      .insert(schema.admins)
      .values({
        userId:  adminId,
        addedBy: null,
        notes:   "Founding admin, seeded on initial deploy",
      })
      .onConflictDoNothing({ target: schema.admins.userId });
    console.log(`✓ Admin user: ${ADMIN_NAME} (${ADMIN_PHONE})`);
  }

  // 2. Default CMS pages
  const defaultPages = [
    { slug: "home",            title: "Home" },
    { slug: "about",           title: "About Us" },
    { slug: "private-parties", title: "Ready to Pawty" },
    { slug: "waiver",          title: "Waiver" },
  ];
  for (const p of defaultPages) {
    await db
      .insert(schema.pages)
      .values({ slug: p.slug, title: p.title, blocks: [], updatedAt: new Date() })
      .onConflictDoNothing({ target: schema.pages.slug });
  }
  console.log("✓ Default pages seeded");

  // 3. Sample kitties (Egyptian names)
  const kittyData = [
    { slug: "nefertiti", name: "Nefertiti", age: "3 years",  personality: "Regal & curious",   imageUrl: "/images/placeholders/kitty-nefertiti.svg" },
    { slug: "anubis",    name: "Anubis",    age: "2 years",  personality: "Watchful & calm",    imageUrl: "/images/placeholders/kitty-anubis.svg" },
    { slug: "cleo",      name: "Cleo",      age: "1 year",   personality: "Playful & friendly", imageUrl: "/images/placeholders/kitty-cleo.svg" },
    { slug: "ramses",    name: "Ramses",    age: "4 years",  personality: "Majestic & gentle",  imageUrl: "/images/placeholders/kitty-ramses.svg" },
    { slug: "isis",      name: "Isis",      age: "2 years",  personality: "Affectionate",       imageUrl: "/images/placeholders/kitty-isis.svg" },
    { slug: "khufu",     name: "Khufu",     age: "kitten",   personality: "Energetic & bold",   imageUrl: "/images/placeholders/kitty-khufu.svg" },
    { slug: "hathor",    name: "Hathor",    age: "5 years",  personality: "Nurturing & warm",   imageUrl: "/images/placeholders/kitty-hathor.svg" },
    { slug: "osiris",    name: "Osiris",    age: "3 years",  personality: "Mysterious & wise",  imageUrl: "/images/placeholders/kitty-osiris.svg" },
  ];
  for (const k of kittyData) {
    await db
      .insert(schema.kitties)
      .values({ ...k, updatedAt: new Date() })
      .onConflictDoNothing({ target: schema.kitties.slug });
  }
  console.log("✓ 8 kitties seeded");

  // 4. Sample event (published, 14 days out)
  const eventStart = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const eventEnd   = new Date(eventStart.getTime() + 90 * 60 * 1000);
  await db
    .insert(schema.events)
    .values({
      slug:        "kitten-yoga-demo",
      title:       "Kitten Yoga",
      description: "Stretch, breathe, and bond with kittens in this gentle yoga session at the lounge.",
      isPublished: true,
      capacity:    16,
      priceInr:    599,
      startsAt:    eventStart,
      endsAt:      eventEnd,
      updatedAt:   new Date(),
    })
    .onConflictDoNothing({ target: schema.events.slug });
  console.log("✓ Sample event seeded");

  // 5. Sample blog post
  await db
    .insert(schema.blogPosts)
    .values({
      slug:        "why-we-built-ubasti",
      title:       "Why We Built Ubasti",
      excerpt:     "A cat cafe born from a love of cats, coffee, and community in Chennai.",
      isPublished: true,
      publishedAt: new Date(),
      bodyRichtext: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Welcome to Ubasti — a sanctuary for cats, coffee, and community in the heart of Chennai." }],
          },
        ],
      },
      updatedAt: new Date(),
    })
    .onConflictDoNothing({ target: schema.blogPosts.slug });
  console.log("✓ Sample blog post seeded");

  await client.end();
  console.log("\nSeed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
