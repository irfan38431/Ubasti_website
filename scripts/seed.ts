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

  // 2. CMS pages with initial blocks
  const cmsPages = [
    {
      slug: "home", title: "Home",
      blocks: [
        { type: "hero", eyebrow: "Chennai's First Cat Lounge", heading: "Where Coffee\\nMeets Cats",
          subheading: "a sanctuary for snuggle time, slow mornings & furriends forever",
          imageUrl: "/images/placeholders/hero-cat-portrait.svg",
          ctaText: "Book a Session", ctaHref: "/book",
          ctaSecondaryText: "Meet the Kitties", ctaSecondaryHref: "/kitties" },
        { type: "ideology", eyebrow: "Our Ideology",
          heading: "Inspired by Bastet,\ngoddess of home, cats & calm.",
          quote: "the world could use more slow mornings, warm cups, and cats on laps",
          body: "Ubasti is a cat cafe and adoption lounge in Chennai. We believe every cat deserves a forever home, and every person deserves a few minutes of purring. Come for the coffee. Stay for the cats. Leave with a friend." },
        { type: "offerings", eyebrow: "What We Offer", items: [
          { imageUrl: "/images/placeholders/offering-coffee.svg", badge: "coffee-cause", title: "Craft Coffee", body: "Specialty brews, teas, and light bites — savoured in the quiet company of cats." },
          { imageUrl: "/images/placeholders/offering-cats.svg", badge: "forever-friend", title: "Resident Cats", body: "Eight resident felines looking for cuddles, playtime, and — if the stars align — forever homes." },
          { imageUrl: "/images/placeholders/offering-community.svg", badge: "purrfect-partners", title: "Community", body: "Events, yoga mornings, adoption drives, and private bookings. A space that brings people together." },
        ]},
        { type: "booking_cta", heading: "Ready for some purrfect company?",
          sub: "book a 60-minute lounge session — just you, a cup, and the cats",
          ctaText: "Book Now — it's free", ctaHref: "/book",
          note: "Pay on arrival · Cancel up to 24h before · No account needed to browse" },
        { type: "kitty_teaser", eyebrow: "Meet the Gang", heading: "Our Resident Felines" },
        { type: "contact_form" },
      ],
    },
    {
      slug: "about", title: "About Us",
      blocks: [
        { type: "story", eyebrow: "Our Story",
          heading: "Born from a love of cats, coffee & community",
          body: "Ubasti started with a simple observation: Chennai has a million cat lovers, but nowhere to be a cat lover together. We built the space we always wanted to exist — named after Bastet, the Egyptian goddess of home and cats, who understood that a purring cat is one of life's quiet joys.",
          body2: "Every cat in the lounge is a rescue. Every visit contributes to their care. Every adoption sends a cat to a family that's been waiting for them.",
          imageUrl: "/images/placeholders/about-story.svg", imageAlt: "The Ubasti lounge" },
        { type: "values_strip", values: [
          { title: "Rescue First", body: "Every resident cat came from a difficult past. We partner with local shelters and work toward zero strays." },
          { title: "Slow Living", body: "No rushing. No noise. Just you, a cup, and an hour that actually feels like rest." },
          { title: "Open Doors", body: "Affordable, accessible, and welcoming to everyone — from curious first-timers to cat-obsessed regulars." },
        ]},
        { type: "faq", eyebrow: "FAQ", heading: "Common Questions", items: [
          { q: "Do I need to book in advance?", a: "Yes — sessions are 60 minutes and slots fill up, especially on weekends. Book online at least a few hours ahead." },
          { q: "Is there an entry fee?", a: "No entry fee. Just buy a drink and enjoy the time with the cats. Pay on arrival." },
          { q: "Can I bring my own cat?", a: "No — resident cats have been carefully socialised together. Outside cats are not permitted for their wellbeing." },
          { q: "Are kids allowed?", a: "Children are welcome! Kids under 7 require one adult chaperone per two children. We ask everyone to be calm and gentle with the cats." },
          { q: "Can I adopt a cat from here?", a: "Yes! Visit the lounge, spend time with the cats, and speak to our team if you feel a connection. We'll guide you through the process." },
          { q: "Are you wheelchair accessible?", a: "Yes — the entire lounge is on a single level with step-free access." },
        ]},
      ],
    },
    {
      slug: "private-parties", title: "Ready to Pawty",
      blocks: [
        { type: "hero_centered", eyebrow: "Celebrate with Cats", heading: "Ready to Pawty?",
          subtitle: "rent the lounge for your perfect celebration", badgeVariant: "purrfect-partners", background: "var(--ubasti-blush)" },
        { type: "perfect_for", eyebrow: "Perfect For",
          heading: "Every Celebration That Deserves a Cat",
          body: "Birthdays · Anniversaries · Bachelorettes · Small corporate meetups · Or any moment worth remembering with cats.",
          imageUrl: "/images/placeholders/party-birthday.svg",
          ctaText: "Send an Inquiry →", ctaHref: "#inquiry" },
        { type: "pricing_tiers", eyebrow: "Pricing", heading: "Choose Your Day",
          tiers: [
            { label: "Weekday", sublabel: "Mon – Thu", price: "₹6,000", duration: "70 min", capacity: "up to 12 guests",
              perks: ["Cake & decor coordination", "Dedicated host", "Custom playlist", "Cat interaction session"] },
            { label: "Weekend", sublabel: "Fri – Sun", price: "₹8,000", duration: "70 min", capacity: "up to 12 guests",
              perks: ["Cake & decor coordination", "Dedicated host", "Custom playlist", "Cat interaction session", "Priority booking window"] },
          ],
          footnote: 'Want longer than 70 min or larger groups? <a href="#inquiry" class="underline">Send us an inquiry.</a>' },
        { type: "rules_list", eyebrow: "Good to Know", heading: "House Rules", items: [
          "Guests must be 6+ years old (children under 7 need 1 adult chaperone per 2 children)",
          "Maximum 12 guests per party booking",
          "Bring your own cake/snacks — send list 48h before for approval",
          "Decorations allowed at entry area only",
          "No glitter, confetti, or balloons inside the lounge — the cats say absolutely not",
          "No fish, strong-smelling foods, or heavy fragrances",
          "Outside alcohol not permitted",
        ]},
        { type: "gallery", eyebrow: "The Lounge",
          images: Array.from({ length: 6 }, (_, i) => ({ url: `/images/placeholders/party-gallery-${i + 1}.svg`, alt: `Party gallery ${i + 1}` })) },
        { type: "inquiry_form", eyebrow: "Get in Touch", heading: "Send an Inquiry" },
        { type: "faq", eyebrow: "FAQ", heading: "Party Questions", items: [
          { q: "Is a deposit required?", a: "Yes — 30% advance to confirm the booking. Refundable up to 7 days before the event." },
          { q: "Can we bring a DJ or live music?", a: "We're a calm space — amplified music isn't permitted. We're happy to run a custom Spotify playlist for you." },
          { q: "Is alcohol allowed?", a: "Outside alcohol is not permitted. We can arrange a mocktail or soft drinks menu on request." },
          { q: "Can we extend beyond 70 minutes?", a: "Yes — for an additional fee and subject to availability. Mention this in your inquiry." },
          { q: "Do the cats participate in the party?", a: "Always — that's the whole point! But cats choose their own social schedule. We can't guarantee every cat will be front and centre." },
        ]},
      ],
    },
    {
      slug: "waiver", title: "Visitor Waiver",
      blocks: [
        { type: "waiver",
          updatedNote: "Last updated May 2026. By visiting Ubasti Cat Cafe & Lounge you agree to this code of conduct.",
          sections: [
            { heading: "1. Respect the Cats", body: "The cats' comfort and safety are our top priority. Do not force interaction — let the cats approach you. Do not pick up, chase, or startle any cat. If a cat moves away, give it space." },
            { heading: "2. Hygiene", body: "Please wash your hands before and after interacting with the cats. Do not visit if you are unwell. Inform a team member if you have cat allergies — we can advise accordingly." },
            { heading: "3. Food & Drinks", body: "Only food and drinks purchased at the cafe may be consumed inside the lounge. Do not feed the cats human food under any circumstances — our team manages their diet carefully." },
            { heading: "4. Behaviour", body: "Loud noises, sudden movements, and rough handling are not permitted. Children under 7 require adult supervision at a ratio of 1 adult per 2 children. Ubasti reserves the right to ask any visitor to leave if the cats' wellbeing is at risk." },
            { heading: "5. Photography", body: "Photography for personal use is welcome. Flash photography is not permitted as it distresses the cats. Do not post images of other guests without their consent." },
            { heading: "6. Liability", body: "While we take every precaution to ensure a safe visit, Ubasti Cat Cafe & Lounge is not liable for allergic reactions, scratches, or other minor incidents that may occur during a visit. By entering the lounge, guests acknowledge and accept this." },
            { heading: "7. Booking & Cancellation", body: "Sessions are 60 minutes. Please arrive within 10 minutes of your booking time. Cancellations made more than 24 hours in advance are fully refunded or rescheduled. Late cancellations and no-shows forfeit the session." },
          ],
        },
      ],
    },
  ];

  for (const p of cmsPages) {
    await db.insert(schema.pages)
      .values({ slug: p.slug, title: p.title, blocks: p.blocks, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: schema.pages.slug,
        set:    { title: p.title, blocks: p.blocks, updatedAt: new Date() },
      });
  }
  console.log("✓ CMS pages seeded with blocks");

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
