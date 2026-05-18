#!/usr/bin/env tsx
/**
 * Idempotent seed — safe to re-run.
 * Requires DATABASE_URL in env (or .env.local loaded externally).
 */
import "dotenv/config";
import * as argon2 from "argon2";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../lib/db/schema";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL not set");

const client = postgres(DB_URL, { prepare: false });
const db = drizzle(client, { schema });

const ADMIN_PHONE    = process.env.SEED_ROOT_ADMIN_PHONE    ?? "+919445077270";
const ADMIN_NAME     = process.env.SEED_ROOT_ADMIN_NAME     ?? "Irfan";
const ADMIN_EMAIL    = process.env.SEED_ROOT_ADMIN_EMAIL    ?? "webdev@ubasticats.com";
const ADMIN_PASSWORD = process.env.SEED_ROOT_ADMIN_PASSWORD ?? "";

async function main() {
  console.log("Seeding database...");

  // 1. Root admin user — email+password (primary) + phone (optional legacy)
  const passwordHash = ADMIN_PASSWORD
    ? await argon2.hash(ADMIN_PASSWORD, { type: argon2.argon2id })
    : undefined;

  // Try email-based upsert first
  let adminId: string | undefined;
  if (ADMIN_EMAIL) {
    const [adminByEmail] = await db
      .insert(schema.users)
      .values({
        email:        ADMIN_EMAIL,
        passwordHash: passwordHash ?? null,
        displayName:  ADMIN_NAME,
        isAdmin:      true,
        isRootAdmin:  true,
      })
      .onConflictDoUpdate({
        target: schema.users.email,
        set:    { passwordHash: passwordHash ?? null, isAdmin: true, isRootAdmin: true },
      })
      .returning();
    adminId = adminByEmail?.id;
  }

  // Fallback: phone-based upsert for backwards compatibility
  if (!adminId && ADMIN_PHONE) {
    const [adminByPhone] = await db
      .insert(schema.users)
      .values({
        phoneE164:   ADMIN_PHONE,
        displayName: ADMIN_NAME,
        isAdmin:     true,
        isRootAdmin: true,
      })
      .onConflictDoNothing({ target: schema.users.phoneE164 })
      .returning();
    adminId = adminByPhone?.id ?? (
      await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.phoneE164, ADMIN_PHONE),
      })
    )?.id;
  }

  if (adminId) {
    await db
      .insert(schema.admins)
      .values({
        userId:  adminId,
        addedBy: null,
        notes:   "Founding admin, seeded on initial deploy",
      })
      .onConflictDoNothing({ target: schema.admins.userId });
    console.log(`✓ Admin user: ${ADMIN_NAME} (${ADMIN_EMAIL || ADMIN_PHONE})`);
  }

  // 2. CMS pages with initial blocks
  // NOTE: "home" is intentionally excluded — it uses a static layout in app/(public)/page.tsx.
  // Seeding home blocks would cause BlocksRenderer to override the static page.
  const cmsPages = [
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

  // 5. Site settings — grooming packages (fallback seed)
  const groomingPackages = {
    mainPackages: [
      { name: "Classic Bath", desc: "A refreshing shampoo wash, soft blow dry — all the essentials for a fresh, happy pet.", prices: { cats: [{ label: "Long Coat", price: "₹1,000" }, { label: "Short Coat", price: "₹850" }], dogs: [{ label: "Small", price: "₹1,000" }, { label: "Medium", price: "₹1,300" }, { label: "Large", price: "₹1,600" }] } },
      { name: "The Royal Treatment", desc: "Our premium combo with imported shampoo + conditioner, combing, ear clean, toothbrushing, and an anal cleanse — the ultimate head-to-tail care.", prices: { cats: [{ label: "Long Coat", price: "₹1,700" }, { label: "Short Coat", price: "₹1,600" }], dogs: [{ label: "Small", price: "₹1,300" }, { label: "Medium", price: "₹1,600" }, { label: "Large", price: "₹1,900" }] } },
      { name: "Signature Groom", desc: "A complete makeover with shampoo wash, soft blow dry, neat haircut, nail trim, and ear clean for a polished finish.", prices: { cats: [{ label: "Long Coat", price: "₹1,700" }, { label: "Short Coat", price: "₹1,600" }], dogs: [{ label: "Small", price: "₹1,600" }, { label: "Medium", price: "₹1,800" }, { label: "Large", price: "₹2,000" }] } },
      { name: "Couture Cut", desc: "Tailored haircuts to match your pet's unique paw-sonality, leaving them looking chic and charming.", prices: { dogs: [{ label: "Small", price: "₹1,000" }, { label: "Medium", price: "₹1,200" }, { label: "Large", price: "₹1,400" }] } },
      { name: "Neat & Tidy", desc: "A speedy spruce-up with a nail cut and ear clean — short, sweet, and oh-so-convenient.", prices: { flat: "₹450" } },
      { name: "The Detailed Groom", desc: "Because details matter: underpaws, underbelly, genitals, nail trim, ear clean, and a neat eye trim to keep your pet tidy and comfortable.", prices: { flat: "₹650" } },
    ],
    spaServices: [
      { name: "Full Body Massage (30 Mins)", desc: "A soothing massage with nourishing oils to melt away tension, improve circulation, and leave your pet feeling calm, pampered, and refreshed.", prices: { cats: [{ label: "Cats", price: "₹600" }], dogs: [{ label: "Small", price: "₹600" }, { label: "Medium", price: "₹700" }, { label: "Large", price: "₹800" }] } },
      { name: "Pawdicure Massage (15 Mins)", desc: "A gentle paw massage that relaxes tired little feet, boosts comfort, and keeps those precious paws feeling their best.", prices: { flat: "₹400" } },
      { name: "The Healing Bath", desc: "A soothing spa session with your vet-prescribed shampoo, perfect for sensitive skin and special care needs. (Customer provides shampoo)", prices: { cats: [{ label: "Long Coat", price: "₹750" }, { label: "Short Coat", price: "₹650" }], dogs: [{ label: "Small", price: "₹1,300" }, { label: "Medium", price: "₹1,700" }, { label: "Large", price: "₹1,800" }] } },
      { name: "The Tick-Free Bath (1 Hr)", desc: "Protective treatment to keep your pet itch-free, comfortable, and ready for cuddles.", prices: { flat: "₹1,100" } },
      { name: "The Colour Pop", desc: "Safe, pet-friendly colouring for a stylish flair that makes your furry friend stand out.", prices: { flat: "₹600" } },
      { name: "Dematting (Min. 3 Hrs)", desc: "", prices: { flat: "₹600/hr" } },
      { name: "Deshedding (Min. 2 Hrs)", desc: "", prices: { flat: "₹600/hr" } },
      { name: "Signature Spa Combo", desc: "The Ultimate Indulgence — a complete head-to-tail luxury experience for the perfect spa day.", prices: { flat: "₹2,499" }, highlight: true },
    ],
    addons: [
      { name: "Anal Gland Cleansing", price: "₹200" },
      { name: "Hair Brushing", price: "₹200" },
      { name: "Eye Trim", price: "₹200" },
      { name: "Eye Hair Removal", price: "₹200" },
      { name: "Paw Trim", price: "₹200" },
      { name: "Toothbrush", price: "₹200" },
    ],
  };

  await db
    .insert(schema.siteSettings)
    .values({ key: "groomingPackages", value: groomingPackages, updatedAt: new Date() })
    .onConflictDoNothing({ target: schema.siteSettings.key });
  console.log("✓ Grooming packages seeded to site_settings");

  // 6. Sample blog post
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
