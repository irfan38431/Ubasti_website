# Ubasti Cat Cafe — Structural Site Overhaul

## Context

The user is rebranding several site sections to feel more premium and on-brand. Today the site is a Next.js 16 / Tailwind 4 / Drizzle app (`D:\UBASTI\ubasti-cafe`). It already has a CMS fallback system where each route renders a CMS-driven `BlocksRenderer` when content exists, otherwise the static JSX inside the page file. Most of the user's asks are static-fallback edits plus a few new pages. The palette tokens (`--ubasti-sage #95996D`, `--ubasti-olive-dark #535D3A`, `--ubasti-blush #E4B6AE`, `--ubasti-cream #F2DAC5`) already exist in `app/globals.css` and are widely used — no theme refactor needed; the work is enforcing them where placeholder/non-palette colors slipped in (e.g. cat emoji, blush-light variants).

Intended outcome: an updated navigation, animated/cute home page with counters and a slideshow strip, simplified kitty tiles, a calendar-style events list, premium private-party pricing, an adoption portal modeled on catcafestudio.com/adopt-a-cat, a sticky "Adopt Now" affordance, and contextual FAQ sections replacing the Waiver page everywhere.

## Files to Modify / Create

### Navigation & global
- `components/layout/Navbar.tsx` — replace `NAV_LINKS` (line 10–19).
- `components/layout/MobileMenu.tsx` — replace `NAV_LINKS` (line 11–19).
- `components/layout/Footer.tsx` — remove waiver link + Adoption Application link.
- `components/public/BottomNavigationBlock.tsx` — update mini-nav links to match new menu (remove Blog, add Adoption/Shop/Grooming).
- **New** `lib/constants/social.ts` — `export const INSTAGRAM_URL = "https://www.instagram.com/ubasticatcafe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="` and import from the 5 files currently hardcoding the old URL (`app/layout.tsx`, `app/(public)/events/EventsList.tsx`, `components/layout/Footer.tsx`, `components/public/BottomNavigationBlock.tsx`, `components/public/ContactForm.tsx`).

New menu (final order): **Home · About · Kitties · Adoption · Events · Private Parties · Grooming (Cats/Dogs) · Boarding (Cats) · Shop**. (Drop **Blog** and **Waiver** and **Book**; "Book" is renamed and split into **Grooming** + **Boarding**.)

### 1. Menu changes (Item 1)
Apply the new `NAV_LINKS` array above to both `Navbar.tsx` and `MobileMenu.tsx`. Routes:
- `/adoption` (new page, see §12)
- `/shop` (new placeholder route at `app/(public)/shop/page.tsx`) — palette-styled "Coming Soon" with a teaser line, brand mark, and Instagram CTA. No commerce build.
- `/grooming` (rename of `/book`, see §11) — keeps existing booking wizard for now
- `/boarding` (new page, see §11)

### 2 & 3. Home page — animations, cat outlines, counters (Items 2, 3, 10)
- `components/public/HeadlineBlock.tsx` — wrap each decorative `Image` (cat-yawn, cat-outline, cat-pspsps, sparkles) in a `motion.div` with `framer-motion` (already a dep) using subtle loops: sparkles → `animate={{ opacity:[0.3,0.8,0.3], scale:[1,1.1,1] }}` infinite; cats → gentle bob (`y: [0, -6, 0]`) + slow rotate sway. Honor `prefers-reduced-motion` via `useReducedMotion()`.
- **New** `components/public/CountersBlock.tsx` — three cards in palette colors (sage / olive-dark / blush bg over cream) showing **Cats Rescued · Cats at the Cafe · Cats Adopted**. Numbers count up on scroll into view using framer-motion `useInView` + `animate`. Counts read from a new `lib/site-stats.ts` constants file so the user can edit values without code changes (`{ rescued: 0, atCafe: 0, adopted: 0 }`).
- Add **animated cat outlines** floating in negative space on the home page — reuse existing SVGs in `public/images/decorative/`, wrap in `motion.div` with slow drift/rotate. Place 2-3 between `HeadlineBlock` and `AboutBlock`, and one inside `CountersBlock`.
- `app/(public)/page.tsx` — **remove** `<BookingCta />` (and its surrounding ScallopDividers). Insert `<CountersBlock />` in its place.
- (Item 10) `app/(public)/private-parties/page.tsx` line 142: replace `🐱` emoji bullet with an inline outline SVG (`/images/decorative/cat-outline.svg` rendered ~16px via `<Image>` with `style={{ filter: "..." }}` to match sage). Apply same swap anywhere else emojis appear (grep first to confirm — found in this one location).

### 5. Slideshow strip (Item 5)
- **Replace** `<OfferingsTriptych />` in `app/(public)/page.tsx` with `<SlideshowStrip />`.
- **New** `components/public/SlideshowStrip.tsx` — horizontal auto-scrolling marquee of tiles from `public/images/slideshow_images/` (10 jpegs already present). Implementation: `framer-motion` x-translate animation on a doubled list (loop trick) for seamless scroll; pause on hover; ~30s loop. Tile dimensions ~280×360, rounded-2xl, cream background, small gap. No heading text (replaces "Offering Community").

### 4. Instagram URL (Item 4)
After creating `lib/constants/social.ts`, replace 5 occurrences of `https://www.instagram.com/ubasticatcafe/` with `{INSTAGRAM_URL}`.

### 6. Footer / menu sync (Item 6)
- `components/layout/Footer.tsx` — delete the "Adoption Application" `<a>` (lines 44–51) and the "waiver" link in the nav row.
- `components/public/BottomNavigationBlock.tsx` — remove `Blog`, add `Adoption` and `Grooming`. Keep it short (5 items max).

### 7. Kitties tiles (Item 7)
- `components/public/KittyCard.tsx` — simplify: keep image, name; **replace** `personality` and `Link` wrapper with a static tile showing **Name · Age · Sex**. No "know more" link. Curved corners (already `rounded-2xl`), cream/blush palette only. Remove `StatusBadge`. Tiles addressable later by the user via DB.
- `app/(public)/kitties/page.tsx` — keep grid; remove the "Thinking of Adopting?" CTA block (lines 67–88) since Adoption is its own page. Add a small "Want to take one home?" pill linking to `/adoption` instead.
- DB: add `sex` column to `kitties` schema. Migration in `lib/db/schema/content.ts` line 85 — add `sex: text("sex"),` next to `age`. Generate migration via `pnpm db:generate`. Seed/update: user populates names later through admin (already exists at `app/admin/...`); ensure admin form picks up `sex` field if there is one (likely needs a one-line addition to the kitty admin form — check `app/admin/` for kitty editor; if no editor exists yet, this is out of scope here and the user can edit DB rows directly).
- Photos in `public/images/kitties/CAT-1..6.jpeg` to be referenced by `imageUrl` for the first 6 seeded rows (user can update names/ages/sex through admin).

### 8. Events calendar (Item 8)
- **New** `components/events/EventsCalendar.tsx` — month-grid calendar (CSS grid, 7 cols). Events marked as palette-colored dots on their date. Clicking a dot/date opens an existing `Modal` (already in `components/ui/Modal.tsx`) showing event title, cover image, description, time, location, price, and a "Register" link routing to `/events/[slug]`.
- `app/(public)/events/EventsList.tsx` — keep but make the calendar the primary view; existing filter pills become a "List view" toggle at the top. Source events from same `/api/events?filter=upcoming` endpoint already used.
- Seed 3–4 demo events via a new `scripts/seed-events.ts` (e.g., *Kitten Yoga · Adoption Drive · Latte Art Workshop · Cat Care 101*) inserted into the `events` table.

### 9. Private parties pricing (Item 9)
Rewrite the `TIERS` array in `app/(public)/private-parties/page.tsx` lines 21–26 to **four cards** (two-by-two grid):

| Card | Weekday | Weekend |
|---|---|---|
| Lounge alone | ₹4,999/hr | ₹6,999/hr |
| Lounge + GF Cafe | ₹9,999/hr | ₹13,999/hr |
| Whole Manor | ₹14,999/hr | ₹16,999/hr |

Each card: olive-dark/sage/blush rotating palette, hourly rate, day label. Update `RULES` array (lines 27–35) to:
- Food & decor not included
- Cake can be ordered from outside
- Decor in the lounge must be confirmed 2 days prior — poppers, balloons, sprays not allowed
- Banner only in the designated area
- (Keep the existing age/guest/no-glitter/no-fish/no-alcohol rules.)

### 11. Boarding + Grooming (Item 11)
- Rename `/book` → `/grooming`. Move directory `app/(public)/book/` to `app/(public)/grooming/` (page.tsx + BookWizard.tsx). Update `metadata.path`. Anything pointing to `/book` updates: `Navbar`, `MobileMenu`, `BottomNavigationBlock`, `ContactForm` CTAs — search for `href="/book"`.
- Add 3–4 demo grooming services on the page above the wizard: e.g. *Cat Wash & Brush · Cat Nail Trim · Dog Wash & Blowdry · Dog De-shed* with sample prices (placeholder, user will fine-tune).
- **New** `app/(public)/boarding/page.tsx` — palette-styled page with two scenarios:
  - **In the lounge daily**: ₹1000 (Ubasti food & litter) / ₹900 (parent provides food & litter)
  - **Boarding enclosure**: ₹800 (Ubasti food & litter) / ₹700 (parent provides food & litter)
  Use the existing `SectionTitle`, `ScrollReveal`, and tier-card pattern from `private-parties`.

### 12. Adoption portal (Item 12)
- **New** `app/(public)/adoption/page.tsx` modeled on catcafestudio.com/adopt-a-cat:
  - Hero with "Adopt a Cat" + tagline, palette = sage + cream
  - "Why Adopt" 3-column section
  - **Adoptable cats** grid — reuse `KittyCard` (filtered `WHERE status='available'`)
  - "Adoption Process" stepper (4 steps: Meet → Apply → Home Visit → Welcome Home)
  - Adoption application: **embed an external Tally/Google Form** via `<iframe>` (URL is a placeholder constant in `lib/constants/social.ts`, e.g. `ADOPTION_FORM_URL`, user supplies the real one). No backend work, no DB table.
  - FAQ section (see §14).
- Tone: warm, simple, palette-faithful. Reference site for layout cues only — no copy-paste.

### 13. "Adopt Now" sticky ribbon (Item 13)
- **New** `components/public/AdoptNowRibbon.tsx` — a vertical blush ribbon fixed to the left edge mid-screen with rotated text "ADOPT NOW", linking to `/adoption`. Visible on all public pages except `/adoption` itself.
- Mount inside `app/(public)/layout.tsx` next to `<Navbar />`. Hide on small screens (`hidden md:flex`) and respect `prefers-reduced-motion`.

### 14. FAQs replacing Waiver (Item 14)
- **Delete** `app/(public)/waiver/page.tsx`, references in `Footer`, `Navbar`, `MobileMenu`.
- **New** `components/public/FaqSection.tsx` — accordion (reuses the `<details>` pattern already in `private-parties/page.tsx` lines 173–183) accepting `{title, items}` props.
- Add a small `FAQ_BY_PAGE` map in `lib/content/faqs.ts` with page-specific Q&As: Home (general), Kitties (adoption-flow), Events, Private Parties (already has 5 — move into the map), Grooming, Boarding, Adoption, Shop.
- Mount `<FaqSection />` near the bottom of each page. Home gets the "general" set.

## Verification

1. `cd D:\UBASTI\ubasti-cafe && pnpm typecheck` — no TS errors.
2. `pnpm lint` — clean.
3. `pnpm dev` and walk every page:
   - Open nav drawer (desktop + mobile) → confirm 9 links, no Blog/Waiver/Book.
   - Home → counters animate up on scroll; cat outlines drift; slideshow auto-scrolls and loops; no "Book your snuggle time" block.
   - Kitties → simple Name/Age/Sex tiles, no "know more".
   - Events → month calendar; click an event dot → modal with details + Register CTA.
   - Private Parties → 4 pricing cards (2 lounge tiers × weekday/weekend variants) + Whole Manor card; rules updated; no cat emoji.
   - Grooming page loads (former `/book`); Boarding page renders with 2 scenario cards.
   - Adoption page renders; application form submits 200 to API; sticky "Adopt Now" ribbon visible on every page except `/adoption`.
   - Each page has a relevant FAQ block at the bottom.
   - All Instagram links open the new URL.
4. Reduce-motion check: enable OS-level "reduce motion" → animations should be subtle/static.
5. Lighthouse mobile run on `/` → confirm CLS & LCP haven't regressed (target ≥ current).

## Out of Scope (flag to user)

- Shop is a placeholder route, not a real e-commerce build.
- Counter values live in `lib/site-stats.ts` constants — user edits the three numbers directly.
- Kitty admin form may need a one-line edit to expose the new `sex` field — call out if missing.
- Demo events/grooming services are seed data; user will edit through admin.
- Adoption form is an embedded external form — user supplies the Tally/Google Form URL.
