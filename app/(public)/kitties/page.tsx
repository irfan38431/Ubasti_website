import { db } from "@/lib/db/client";
import { kitties } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import Image from "next/image";
import { KittyCard } from "@/components/public/KittyCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { FaqSection } from "@/components/public/FaqSection";
import { FAQ_BY_PAGE } from "@/lib/content/faqs";
import { buildMetadata } from "@/lib/seo/metadata";
import { WavyDivider } from "@/components/decorative/WavyDivider";
import { ScallopDivider } from "@/components/decorative/ScallopDivider";
import { KITTIES, DECORATIVE } from "@/lib/replacements";

export const metadata = buildMetadata({
  title: "Meet Our Cats — Adoption in Chennai",
  description: "Meet the resident cats at Ubasti Cat Cafe. Each kitty is rescued, vetted, and looking for a forever home in Chennai.",
  path: "/kitties",
  keywords: ["cat adoption chennai", "adopt a cat chennai", "kitten adoption tamil nadu"],
});

export default async function KittiesPage() {
  let cats: typeof kitties.$inferSelect[] = [];
  try {
    cats = await db.select().from(kitties).orderBy(asc(kitties.sortOrder), asc(kitties.name));
  } catch {
    // DB not configured yet — show empty state
  }

  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      {/* ── Hero with background image ── */}
      <section
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          height: "clamp(380px, 55vh, 560px)",
          minHeight: 380,
        }}
      >
        {/* Background image */}
        <Image
          src={KITTIES.heroImage}
          alt="Cats lounging at Ubasti Cat Cafe"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(83,93,58,0.45) 0%, rgba(43,46,31,0.6) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Badge */}
        <div className="absolute top-6 right-8 hidden md:block z-10">
          <Badge variant="forever-friend" size={100} rotate={-10} />
        </div>

        {/* Decorative cat outlines */}
        <div
          className="absolute bottom-8 left-6 w-20 h-20 md:w-28 md:h-28 opacity-30 hidden md:block"
          aria-hidden="true"
        >
          <Image
            src={DECORATIVE.catOutline}
            alt=""
            fill
            className="object-contain"
            style={{ filter: "brightness(3)" }}
          />
        </div>

        {/* Title content */}
        <div className="relative z-10 text-center px-6">
          <p
            className="text-sm font-bold uppercase tracking-widest mb-4"
            style={{ color: "var(--ubasti-mustard)", fontFamily: "var(--font-inter)" }}
          >
            Our Family
          </p>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl leading-tight"
            style={{
              fontFamily: "var(--font-cormorant)",
              color: "var(--ubasti-white)",
              fontWeight: 600,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            Meet the Kitties
          </h1>
          <p
            className="mt-4 text-lg md:text-xl max-w-xl mx-auto"
            style={{
              fontFamily: "var(--font-caveat)",
              color: "var(--ubasti-cream)",
              fontSize: "1.35rem",
              textShadow: "0 1px 10px rgba(0,0,0,0.3)",
            }}
          >
            eight egyptians in search of forever homes (and laps)
          </p>
        </div>
      </section>

      {/* ── Wavy transition from hero to main content ── */}
      <WavyDivider
        topColor="transparent"
        bottomColor="var(--ubasti-cream)"
        height={100}
        variant="double"
      />

      {/* ── Cat gallery section ── */}
      <section
        className="relative py-12 md:py-20"
        style={{ background: "var(--ubasti-cream)" }}
      >
        {/* Floating sparkles decorative */}
        <div
          className="absolute top-12 right-[6%] w-14 h-14 md:w-20 md:h-20 opacity-40 hidden sm:block"
          style={{ transform: "rotate(12deg)" }}
          aria-hidden="true"
        >
          <Image
            src={DECORATIVE.sparkles}
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          {/* Section sub-header */}
          <div className="text-center mb-12">
            <p
              className="text-sm font-bold uppercase tracking-widest mb-2"
              style={{ color: "var(--ubasti-mustard)", fontFamily: "var(--font-inter)" }}
            >
              Resident Felines
            </p>
            <h2
              className="text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
            >
              Our Purrfect Companions
            </h2>
            <div className="flex justify-center mt-3">
              <svg
                viewBox="0 0 180 18"
                width={160}
                height={18}
                aria-hidden="true"
                focusable="false"
                style={{ display: "block" }}
              >
                <path
                  d="M0,9 C20,2 40,16 60,9 C80,2 100,16 120,9 C140,2 160,16 180,9"
                  fill="none"
                  stroke="var(--ubasti-blush)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {cats.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{ background: "var(--ubasti-paper)" }}
              >
                <Image
                  src={DECORATIVE.catOutline}
                  alt=""
                  width={40}
                  height={40}
                  className="opacity-50"
                />
              </div>
              <p
                className="text-lg"
                style={{ color: "var(--ubasti-sage)", fontFamily: "var(--font-cormorant)", fontSize: "1.2rem" }}
              >
                Our kitties are preparing for their debut. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cats.map((cat) => (
                <KittyCard
                  key={cat.id}
                  name={cat.name}
                  imageUrl={cat.imageUrl}
                  age={cat.age}
                  sex={cat.sex}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <a href="/adoption"
              className="inline-flex h-12 items-center px-8 rounded-full font-medium text-sm transition-all hover:opacity-90 hover:scale-105"
              style={{
                background: "var(--ubasti-olive-dark)",
                color: "var(--ubasti-cream)",
                fontFamily: "var(--font-inter)",
                boxShadow: "0 4px 14px rgba(83,93,58,0.3)",
              }}>
              Want to take one home? → Adoption
            </a>
          </div>
        </div>
      </section>

      {/* ── Wavy transition from gallery to FAQ ── */}
      <WavyDivider
        topColor="var(--ubasti-cream)"
        bottomColor="var(--ubasti-paper)"
        height={80}
        variant="single"
      />

      <FaqSection title="Kitty FAQs" items={FAQ_BY_PAGE.kitties} />
    </div>
  );
}
