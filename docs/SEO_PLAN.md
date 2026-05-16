# Ubasti Cafe — SEO Implementation Plan

> **For:** Sonnet (implementing agent)
> **Project:** `ubasti-cafe` (Next.js 16 App Router, React 19, Drizzle + Supabase, Tailwind v4)
> **Domain:** `https://ubasti.cafe`
> **Business:** Cat cafe & adoption lounge in Chennai, Tamil Nadu, India
> **Status of plan:** Authored 2026-05-16. Treat as the source of truth for SEO work.

---

## 0. Read this first (Next.js 16 specifics)

This project uses **Next.js 16** — APIs differ from your training data. Before touching anything:

1. Read `node_modules/next/dist/docs/` for the current Metadata, Image, and Script APIs.
2. `params` and `searchParams` are **async** (`Promise<…>`) — always `await` them. See existing pages for the pattern.
3. `headers()` is async — `await headers()`.
4. Use `import type { Metadata } from "next"` and `MetadataRoute` types.
5. JSON-LD must be injected via `<script type="application/ld+json" dangerouslySetInnerHTML={…} />` — never as a stringified child.

If anything in this plan conflicts with the installed Next.js docs, the **docs win**. Update this plan in the same PR.

---

## 1. Current state audit (what already exists)

| File | What it does | Gaps |
|---|---|---|
| `app/layout.tsx` | Root `metadata` (title/description), `metadataBase`, OG locale `en_IN`, CafeOrCoffeeShop JSON-LD | No default OG image, no Twitter card defaults, no `alternates.canonical`, JSON-LD missing `image` width/height + `sameAs` social links, no `priceRange` review |
| `app/sitemap.ts` | Static routes + dynamic events + blog posts | Missing image sitemap entries; lastModified for static routes is `new Date()` (always "now" → bad signal) |
| `app/robots.ts` | Blocks `/admin`, `/api/admin/` | OK — also explicitly disallow `/account`, `/login`, `/waiver` (waiver maybe allow) and `/api/` |
| `app/(public)/*/page.tsx` | Each has `export const metadata = { title: "…" }` only | **No description, no openGraph, no twitter, no canonical, no keywords** |
| `app/(public)/blog/[slug]/page.tsx` | `generateMetadata` returns `title` only | No description from `excerpt`, no OG image from `coverImage`, no Article JSON-LD |
| `app/(public)/events/[slug]/page.tsx` | `generateMetadata` returns `title` only | No description, no OG image, no Event JSON-LD (huge miss — events get rich results) |
| `app/(public)/login/page.tsx` | No metadata at all | Add `{ title, robots: { index: false } }` |
| `components/public/Hero.tsx` | Logo `<Image>` has alt, video `aria-hidden` | Video has no `title`/`aria-label`/captions track; hero is decorative video which is fine, but H1 not in hero — verify H1 lives in `HeadlineBlock` |
| `next.config.ts` | Allows Supabase remote images | No `images.formats` (defaults to avif/webp), no `deviceSizes` tuning, no compression hint |
| Pages with low alt-text density | `Hero.tsx`, `BookingCta.tsx`, `BottomNavigationBlock.tsx`, `ContactForm.tsx`, `FeaturePhoto.tsx`, `KittyCard.tsx`, `KittyTeaser.tsx`, `VideoBackgroundBlock.tsx` | Some images decorative (OK if `alt=""` + `aria-hidden`), but content images need descriptive alt |

---

## 2. Information architecture & target keywords

**Primary intent clusters** (Chennai-local + cat-cafe niche):

| Cluster | Primary keyword | Secondary keywords | Target page |
|---|---|---|---|
| Brand | "ubasti cafe", "ubasti cat cafe chennai" | "ubasti lounge" | `/` |
| Local cat cafe | "cat cafe chennai", "cat cafe near me" | "cat cafe in chennai", "cat cafe tamil nadu" | `/` and `/about` |
| Adoption | "cat adoption chennai" | "adopt a cat chennai", "kitten adoption tamil nadu" | `/kitties` |
| Booking | "cat cafe booking chennai" | "book cat cafe session" | `/book` |
| Events | "cat cafe events chennai" | "kitten yoga chennai", "cat adoption drive chennai" | `/events`, `/events/[slug]` |
| Private parties | "cat themed birthday party chennai" | "private cat cafe booking", "kids party chennai cat cafe" | `/private-parties` |
| Content/blog | long-tail cat-care, cafe-life topics | individual post intents | `/blog`, `/blog/[slug]` |

**Geo:** every page should signal Chennai. JSON-LD already does this at the root, but page copy + metadata descriptions should mention "Chennai" naturally on the home, about, book, events, and parties pages.

---

## 3. Page-by-page metadata spec

> **Pattern:** every page exports either `metadata` (static) or `generateMetadata` (dynamic). All descriptions must be **140–160 chars**, mention the brand + a concrete value (Chennai / cats / adoption / booking).

### 3.1 Centralized helpers (build these first)

Create `lib/seo/metadata.ts`:

```ts
import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ubasti.cafe";
const SITE_NAME = "Ubasti Cat Cafe & Lounge";

export const DEFAULT_OG_IMAGE = {
  url: `${APP_URL}/og/default.png`, // 1200×630
  width: 1200,
  height: 630,
  alt: "Ubasti Cat Cafe & Lounge — Chennai",
};

export function buildMetadata(input: {
  title: string;            // page title only — site name appended automatically
  description: string;      // 140–160 chars
  path: string;             // e.g. "/about"
  image?: { url: string; width?: number; height?: number; alt: string };
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}): Metadata {
  const url = `${APP_URL}${input.path}`;
  const image = input.image ?? DEFAULT_OG_IMAGE;
  return {
    title: `${input.title} | ${SITE_NAME}`,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: input.type ?? "website",
      locale: "en_IN",
      images: [image],
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image.url],
    },
  };
}
```

### 3.2 Per-page metadata (use `buildMetadata`)

| Route | Title | Description (target 150 chars) | OG image | Notes |
|---|---|---|---|---|
| `/` | "Cat Cafe & Adoption Lounge in Chennai" | "Sip specialty coffee, cuddle resident rescue cats, and find your forever friend at Ubasti — Chennai's serene cat cafe & adoption lounge." | `/og/home.png` | Already exists; replace inline metadata |
| `/about` | "About Ubasti — Our Story & Cats" | "Meet the team and the rescue cats behind Ubasti Cat Cafe in Chennai. Our mission, the lounge, and how each visit supports cat welfare." | `/og/about.png` | |
| `/kitties` | "Meet Our Cats — Adoption in Chennai" | "Meet the resident cats at Ubasti Cat Cafe. Each kitty is rescued, vetted, and looking for a forever home in Chennai." | `/og/kitties.png` | |
| `/events` | "Events at Ubasti — Kitten Yoga, Workshops & More" | "Kitten yoga, adoption drives, latte art classes, and cat-care workshops at Ubasti Cat Cafe in Chennai. Browse upcoming events." | `/og/events.png` | |
| `/events/[slug]` | dynamic — event.title | event.summary or first 155 chars of event.description | `event.coverImage` → fallback `/og/events.png` | `type: "article"`, set `publishedTime` + Event JSON-LD (§5.3) |
| `/private-parties` | "Private Parties & Bookouts" | "Host a cat-themed birthday, baby shower, or team offsite at Ubasti. Private buyout, custom menus, and cuddles included — Chennai." | `/og/parties.png` | |
| `/blog` | "Ubasti Blog — Cat Care, Cafe Life, Chennai" | "Cat-care guides, lounge updates, and stories from inside Ubasti Cat Cafe in Chennai. Read the latest from our team." | `/og/blog.png` | |
| `/blog/[slug]` | dynamic — post.title | post.excerpt (truncate 155) | `post.coverImage` → fallback `/og/blog.png` | `type: "article"`, Article JSON-LD (§5.4) |
| `/book` | "Book a Cat Cafe Session" | "Reserve your 60-minute cat cafe session at Ubasti, Chennai. Choose your time, complete the waiver, and meet the cats." | `/og/book.png` | |
| `/waiver` | "Visitor Waiver" | "Please read and sign the visitor waiver before your Ubasti Cat Cafe session in Chennai." | default | `noindex: true` (thin legal page) |
| `/login` | "Sign In" | "Sign in to your Ubasti account to manage bookings." | default | `noindex: true` |
| `/account` | "Your Account" | "Manage your Ubasti bookings, waiver status, and account details." | default | `noindex: true` |

### 3.3 Replace dynamic page metadata

In `app/(public)/blog/[slug]/page.tsx` `generateMetadata`:

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [post] = await db.select({
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      coverImage: blogPosts.coverImage,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    }).from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true))).limit(1);

    if (post) {
      return buildMetadata({
        title: post.title,
        description: post.excerpt?.slice(0, 155) ?? "Read the latest from Ubasti Cat Cafe.",
        path: `/blog/${slug}`,
        image: post.coverImage ? { url: post.coverImage, alt: post.title } : undefined,
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
      });
    }
  } catch {}
  return buildMetadata({ title: "Blog", description: "Ubasti Cat Cafe blog.", path: `/blog/${slug}` });
}
```

Do the equivalent for `app/(public)/events/[slug]/page.tsx` using the events schema fields.

---

## 4. Heading hierarchy rules (per-page)

**Rule:** exactly **one `<h1>` per page**, then `<h2>` for sections, `<h3>` for subsections. Never skip levels for styling — use Tailwind classes for size, not heading semantics.

| Page | H1 | Required H2s |
|---|---|---|
| `/` | "Ubasti — Cat Cafe & Adoption Lounge in Chennai" (currently in `HeadlineBlock`) | "About", "What we offer", "Book a session", "Connect with us" |
| `/about` | "Our Story" | "Meet the team", "Our cats", "FAQ" |
| `/kitties` | "Meet our cats" | "Available for adoption", "Resident cats" |
| `/events` | "Upcoming events at Ubasti" | "Featured", "All events" |
| `/events/[slug]` | `event.title` | "About this event", "Location", "What to expect" |
| `/private-parties` | "Private parties at Ubasti" | "Packages", "Gallery", "Enquire" |
| `/blog` | "Ubasti Blog" | "Latest posts" |
| `/blog/[slug]` | `post.title` | (post content uses H2/H3 from Tiptap) |
| `/book` | "Book your session" | "Choose a date", "Choose a time", "Your details" |

**Action:** audit `components/public/*.tsx` — any component using `<h1>` while not on the home page must be downgraded. `SectionTitle` is the canonical heading component; confirm it accepts an `as` prop and use it consistently.

---

## 5. Structured data (JSON-LD)

Already present: `CafeOrCoffeeShop` in `app/layout.tsx`. Augment + add the following.

### 5.1 Augment root LocalBusiness

In `app/layout.tsx` `localBusinessJsonLd`:

- Add `"@id": "${APP_URL}/#business"` so other schemas can reference it.
- Add `sameAs: ["https://www.instagram.com/<handle>", "https://www.facebook.com/<handle>", ...]` — pull the actual handles from `ContactForm.tsx` / `BottomNavigationBlock.tsx`.
- Fix `image` — point at a real 1200×630 photo (not the placeholder SVG) once available; include `width`/`height`.
- Add `aggregateRating` ONLY if real review data exists (do NOT fake it — Google penalizes).
- Add `acceptsReservations: true`, `paymentAccepted: "Cash, UPI, Credit Card"`, `currenciesAccepted: "INR"`.
- Add `hasMap: "https://www.google.com/maps/..."` with the real Google Maps URL once we have it.

### 5.2 Site-wide Organization + WebSite + SearchAction

Add a second JSON-LD block in `app/layout.tsx`:

```jsonc
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://ubasti.cafe/#website",
  "url": "https://ubasti.cafe",
  "name": "Ubasti Cat Cafe & Lounge",
  "publisher": { "@id": "https://ubasti.cafe/#business" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ubasti.cafe/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

(Only add SearchAction if blog search actually works at `/blog?q=`. Otherwise omit.)

### 5.3 Event JSON-LD (in `app/(public)/events/[slug]/page.tsx`)

```jsonc
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "<event.title>",
  "startDate": "<event.startsAt ISO>",
  "endDate": "<event.endsAt ISO>",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Ubasti Cat Cafe & Lounge",
    "address": { /* same as LocalBusiness */ }
  },
  "image": ["<event.coverImage absolute URL>"],
  "description": "<event.summary>",
  "organizer": { "@id": "https://ubasti.cafe/#business" },
  "offers": {
    "@type": "Offer",
    "url": "<absolute URL of /events/{slug}>",
    "price": "<event.price>",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "validFrom": "<event.createdAt ISO>"
  }
}
```

Render the same way the root layout renders LocalBusiness JSON-LD. Source field names from `lib/db/schema.ts` — adjust if columns differ.

### 5.4 BlogPosting JSON-LD (in `app/(public)/blog/[slug]/page.tsx`)

```jsonc
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "<post.title>",
  "image": ["<post.coverImage absolute URL>"],
  "datePublished": "<post.publishedAt ISO>",
  "dateModified": "<post.updatedAt ISO>",
  "author": { "@type": "Person", "name": "<post.authorName ?? 'Ubasti Team'>" },
  "publisher": { "@id": "https://ubasti.cafe/#business" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "<absolute URL>" }
}
```

### 5.5 FAQPage JSON-LD (in `app/(public)/about/page.tsx`)

The `FAQ` const already exists at the top of the file. Emit:

```jsonc
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a }
  }))
}
```

### 5.6 BreadcrumbList (every non-home page)

Build `components/public/Breadcrumbs.tsx` that renders both the visible breadcrumb nav AND emits BreadcrumbList JSON-LD. Include on `/about`, `/kitties`, `/events`, `/events/[slug]`, `/blog`, `/blog/[slug]`, `/private-parties`, `/book`.

---

## 6. Images

### 6.1 Format & sizing rules

- **Always** use `next/image` (`<Image>`) — never raw `<img>`. Already mostly true; audit `components/public/` and `components/events/`, `components/parties/`, `components/booking/`.
- Hero/above-the-fold images: `priority` prop, `sizes="100vw"`, explicit `width`/`height` OR `fill` with a sized parent.
- Below-the-fold: `loading="lazy"` (default for `next/image`), `sizes` matching layout breakpoints.
- Decorative SVGs (`leaves.svg`, `sparkles.svg`, scallop dividers, cat outlines): `alt=""` + `aria-hidden="true"`. **Do not** invent alt text for purely decorative graphics — empty alt is correct for SEO + a11y.

### 6.2 Alt-text spec (mandatory copy)

| Asset | Alt text |
|---|---|
| `/images/logo.png`, `logo-wordmark.svg` (in Hero, Bottom nav) | "Ubasti Cat Cafe & Lounge" |
| `logo-mark.svg` (brand mark, smaller) | "Ubasti" (or `alt=""` if redundantly placed next to wordmark) |
| `hero-cat-portrait.svg` | "Portrait of a cat at Ubasti Cafe in Chennai" |
| `hero-lounge.svg` | "The Ubasti cat cafe lounge interior" |
| `about-story.svg` | "The founders' story behind Ubasti Cat Cafe" |
| `about-team.svg` | "The Ubasti team with the resident cats" |
| `kitty-<name>.svg` | "<Cat Name>, a resident cat at Ubasti Cafe" (replace `<Cat Name>` per file) |
| `kitty-placeholder.svg` | "Cat photo coming soon" |
| `offering-coffee.svg` | "Specialty coffee served at Ubasti" |
| `offering-cats.svg` | "Resident cats at Ubasti waiting for cuddles" |
| `offering-community.svg` | "Community events at Ubasti Cafe Chennai" |
| `party-birthday.svg` | "Cat-themed birthday party at Ubasti" |
| `party-gallery-N.svg` | "Private event at Ubasti Cat Cafe — photo <N>" |
| `event-cover-N.svg` | (dynamic — use `event.title`) |
| `blog-cover-N.svg` | (dynamic — use `post.title`) |
| `badge-*.svg` | Decorative — `alt=""` + `aria-hidden="true"` if used purely as ornament; otherwise describe the badge text |
| `decorative/*.svg` (`leaves`, `sparkles`, `cat-disco`, `cat-yawn`, `cat-pspsps`, `cat-outline`) | `alt=""` + `aria-hidden="true"` — these are flourishes |
| `ubasti-brand-mark.svg`, `ubasti-lounge-wordmark.svg` | "Ubasti Cat Cafe & Lounge" (or `alt=""` if redundant with sibling text) |

**Rule for dynamic images** (Supabase-uploaded cat photos, event/blog covers): the CMS already stores an `altText` field on media — **always read from it** and pass to `<Image alt={…}>`. If empty, fall back to a generated alt like `${name} at Ubasti Cat Cafe`. Add admin UI nudge later (out of scope for this plan).

### 6.3 next.config.ts tuning

```ts
images: {
  formats: ["image/avif", "image/webp"],
  deviceSizes: [360, 480, 640, 768, 1024, 1200, 1536, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  remotePatterns: [
    { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
  ],
},
```

### 6.4 Image compression checklist (one-time)

- All static SVGs in `public/images/` → run SVGO once (`npx svgo -f public/images -r`).
- Raster originals → convert to AVIF + WebP at upload time (Supabase edge function or pre-upload script). Cover images target ≤200KB.
- Replace `/images/logo.png` referenced by `Hero.tsx` with an SVG if a vector exists — sharper, smaller, scales.

---

## 7. Videos

`Hero.tsx` and `VideoBackgroundBlock.tsx` use `<video autoPlay muted playsInline>` with `aria-hidden="true"`. That's correct **for purely decorative video** — but add:

```tsx
<video
  title="Ubasti Cat Cafe — lounge ambience"
  aria-label="Ambient video of cats and visitors at Ubasti Cafe"
  poster="/images/video-poster-hero.jpg"   // first-frame still
  preload="metadata"                        // not "auto" — saves bandwidth
  …
/>
```

Notes:
- Keep `aria-hidden="true"` ONLY if the video is purely decorative AND there is equivalent text content on the same screen. If the video carries unique information, drop `aria-hidden` and add a `<track kind="captions">` even for muted video where action conveys meaning.
- Add `poster` images for all autoplaying videos — large CLS win and shows during slow loads.
- Cycling video list in `Hero.tsx` references `/videos/cafe-2..5.mp4` but only `cafe-1.mp4` exists. Either upload the missing files or trim the array — broken sources hurt UX/LCP.

---

## 8. Performance (Core Web Vitals)

Google ranks on CWV — these are SEO, not just speed.

### 8.1 LCP (Largest Contentful Paint) — target < 2.5s

- Hero `<Image>` already has `priority`. Good.
- Hero video: set `preload="metadata"` (not `"auto"`) and a `poster`. Currently `preload="auto"` — change.
- Avoid blocking the LCP element behind hydration; the wordmark `<Image>` is fine since it's in a Server Component path until the `"use client"` boundary.
- Self-host fonts via `next/font/google` (already done). Confirm `display: "swap"` (already set).

### 8.2 CLS (Cumulative Layout Shift) — target < 0.1

- Every `<Image>` needs `width`+`height` or `fill` inside a sized parent. Audit `KittyCard.tsx`, `KittyTeaser.tsx`, blog/event cards.
- Reserve space for video posters via fixed aspect ratios (CSS `aspect-ratio: 16/9`).

### 8.3 INP (Interaction to Next Paint) — target < 200ms

- The booking flow (`/book`) is the heaviest interaction path. Defer non-critical JS: dynamic-import the date picker, dynamic-import Tiptap renderer (it's only needed for blog/event detail pages where it's already only there).
- Avoid hydrating heavy client components above the fold on the home page. `Hero` is `"use client"` — it must be for the video state. That's fine, but `HeadlineBlock`, `AboutBlock`, `OfferingsTriptych` should remain server components.

### 8.4 Bundle / shipping rules

- Run `pnpm exec next build` and check the build output. Any route's First Load JS > 200KB → investigate.
- `@next/bundle-analyzer` is already a devDep. Add a `pnpm analyze` script that runs with `ANALYZE=true`.
- `framer-motion` is heavy — confirm it's only imported in client components and consider `motion/react` (the lighter Motion One bindings) for simple animations.

### 8.5 Caching

- Static pages (`/about`, `/kitties`, `/private-parties`, `/waiver`) should be statically rendered. Confirm via `next build` output (look for `○` or `●` markers).
- `/events`, `/blog`, and detail pages read from DB → use `revalidate` (e.g. `export const revalidate = 300` for list pages, `3600` for individual posts). Decide per page; default to ISR with revalidation.
- `/book` is dynamic per-user — keep dynamic.

---

## 9. Sitemap & robots improvements

### 9.1 `app/sitemap.ts`

Issues today:
- `lastModified: new Date()` on static routes means every crawl sees "modified now" → Google de-prioritizes the signal.
- No image sitemap entries.

Fix:
- Use a build-time constant for static-route `lastModified` (e.g. `new Date("2026-05-16")`) and only bump when the page actually changes.
- For dynamic events/blog, the existing `updatedAt` is correct.
- Add images per event/blog entry:

```ts
{
  url: `${APP_URL}/events/${e.slug}`,
  lastModified: e.updatedAt,
  changeFrequency: "weekly",
  priority: 0.8,
  images: e.coverImage ? [e.coverImage] : undefined, // Next 16 supports this
}
```

### 9.2 `app/robots.ts`

Tighten — explicitly block routes you don't want indexed:

```ts
{
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin", "/admin/",
        "/api/", "/api/admin/",
        "/account", "/account/",
        "/login",
      ],
    },
  ],
  sitemap: `${APP_URL}/sitemap.xml`,
  host: APP_URL,
}
```

Keep `/waiver` indexable (low-priority but legitimate). Keep `/book` indexable (it's the conversion page).

---

## 10. Canonicals, hreflang, social

- **Canonicals:** every page sets `alternates.canonical` via `buildMetadata` (§3.1). No exceptions.
- **Trailing slash policy:** Next.js default is no trailing slash. Confirm and don't introduce redirects.
- **hreflang:** site is en-IN only. Skip alternates until a second language ships.
- **Social handles:** add real `sameAs` URLs in `app/layout.tsx` LocalBusiness JSON-LD and add Instagram/Facebook/YouTube meta tags via `metadata.other` only if marketing requests (not required for SEO).

---

## 11. Accessibility-as-SEO

Google increasingly correlates a11y with quality. Quick wins:

- Every interactive non-button element (links styled as buttons, custom controls) needs `aria-label` if its text content is non-descriptive (e.g., icon-only buttons in `BottomNavigationBlock.tsx`).
- Skip-to-content link already exists in `layout.tsx`. Good.
- Form fields in `ContactForm.tsx` and `/book` flow: each `<input>` must have an associated `<label htmlFor>` (not placeholder-as-label).
- Color contrast: brand palette uses `var(--ubasti-cream)` on `var(--ubasti-ink)` etc. — verify ≥4.5:1 for body text via DevTools. Cinzel/Cormorant on `--ubasti-paper` is a likely offender.
- Focus states: every interactive element must have a visible `:focus-visible` outline.

---

## 12. Analytics & Search Console setup (one-time)

Not code changes per se, but pre-launch checklist:

1. **Google Search Console**: verify ownership via `metadata.verification.google` in `app/layout.tsx`. Submit sitemap.
2. **Bing Webmaster Tools**: same.
3. **Plausible / Umami / Vercel Analytics**: pick one. (Don't use GA4 unless required — it bloats bundles and triggers cookie banners.)
4. After deploy, run **Lighthouse** (mobile + desktop), **PageSpeed Insights**, and **Rich Results Test** for each schema type. Capture baseline scores in `docs/SEO_BASELINE.md` (create when running).

---

## 13. Build order (sequenced tasks for Sonnet)

Each task is small and independently testable. Run `pnpm typecheck && pnpm lint && pnpm build` after every task. **Do not** combine tasks into one PR — atomic commits.

1. **Create `lib/seo/metadata.ts`** with `buildMetadata` helper (§3.1). No page changes yet. Add unit test in `tests/seo/metadata.test.ts` verifying canonical, OG, twitter shape.
2. **Update `app/layout.tsx`**: import `DEFAULT_OG_IMAGE`, augment LocalBusiness JSON-LD (`@id`, `sameAs`, `acceptsReservations`, `paymentAccepted`, `currenciesAccepted`), add WebSite JSON-LD (§5.2). Move title/description into a partial that `buildMetadata` consumes for the home page.
3. **Replace `metadata` on every static page** under `app/(public)/*/page.tsx` with `buildMetadata({…})` per §3.2 table.
4. **Rewrite `generateMetadata`** in `app/(public)/blog/[slug]/page.tsx` and `app/(public)/events/[slug]/page.tsx` per §3.3. Pull `coverImage`, `excerpt`/`summary`, `publishedAt`, `updatedAt` from schema.
5. **Add Event JSON-LD** to event detail page (§5.3).
6. **Add BlogPosting JSON-LD** to blog detail page (§5.4).
7. **Add FAQPage JSON-LD** to about page (§5.5).
8. **Build `components/public/Breadcrumbs.tsx`** (§5.6) — visible nav + BreadcrumbList JSON-LD. Mount on listed pages.
9. **Audit headings** (§4). Use `grep -rn "<h1" components/ app/(public)/` — fix any second H1s. Confirm `SectionTitle` has an `as` prop.
10. **Pass through alt text** (§6.2). Walk every `<Image>` in `components/public/`, `components/events/`, `components/parties/`, `components/booking/`, `components/account/`, `components/auth/`, `components/admin/` (public-facing only). For dynamic media, ensure `media.altText` is read.
11. **Decorative images**: set `alt=""` + `aria-hidden="true"` on every `decorative/*.svg` usage and on badge SVGs when used as flourishes.
12. **Video improvements** (§7) on `Hero.tsx` + `VideoBackgroundBlock.tsx`: add `title`, `aria-label`, `poster`, change `preload` to `"metadata"`. Either upload `cafe-2..5.mp4` or shorten the `VIDEOS` array in `Hero.tsx`.
13. **`next.config.ts`** image tuning (§6.3).
14. **Sitemap fixes** (§9.1): freeze static `lastModified`, add image entries to dynamic routes.
15. **Robots tightening** (§9.2).
16. **CWV pass** (§8): add `revalidate` exports to `/events`, `/blog`, etc.; dynamic-import date picker on `/book`; add `pnpm analyze` script. Run bundle analyzer, capture sizes.
17. **A11y sweep** (§11): label-input audit on `ContactForm.tsx` + booking forms; focus-visible outlines in `globals.css`; contrast check.
18. **Final QA**: Lighthouse mobile ≥ 90 across the board; Rich Results Test passes for LocalBusiness, FAQPage, Event, BlogPosting, BreadcrumbList.

---

## 14. Acceptance criteria (definition-of-done)

- [ ] Every public page exports complete `Metadata` via `buildMetadata` (title, description, canonical, OG image, Twitter card).
- [ ] Every `<Image>` has either a real descriptive `alt` or `alt="" aria-hidden="true"`.
- [ ] Exactly one `<h1>` per public page; H2/H3 hierarchy correct.
- [ ] JSON-LD validates (no Rich Results errors): LocalBusiness, WebSite, FAQPage (about), Event (each event slug), BlogPosting (each blog slug), BreadcrumbList (every non-home).
- [ ] `sitemap.xml` includes static + all published events + all published blog posts; lastModified is real.
- [ ] `robots.txt` blocks `/admin`, `/api`, `/account`, `/login`; allows everything else.
- [ ] Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 on `/`, `/about`, `/kitties`, `/events`, `/book`.
- [ ] No raw `<img>` tags remain in public-facing components (admin can keep them).
- [ ] `pnpm build` succeeds; `pnpm typecheck` clean; `pnpm lint` clean; existing tests pass.

---

## 15. Out of scope (for now — track separately)

- Blog content strategy and editorial calendar.
- Backlink outreach.
- Localized hreflang (only if Tamil/Hindi versions ship).
- Paid search.
- Image CDN beyond Next's built-in.
- Real review aggregation (`aggregateRating`) — needs a review-collection flow first.
- Admin UI changes (alt-text requirement on upload) — separate ticket.

---

**End of plan.** When implementing, update the "Build order" checklist in this file as each task lands so future sessions know progress.
