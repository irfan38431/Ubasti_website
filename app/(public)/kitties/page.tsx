import { db } from "@/lib/db/client";
import { kitties } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { KittyCard } from "@/components/public/KittyCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { FaqSection } from "@/components/public/FaqSection";
import { FAQ_BY_PAGE } from "@/lib/content/faqs";
import { buildMetadata } from "@/lib/seo/metadata";

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
      {/* Hero strip */}
      <section
        className="py-20 md:py-28 text-center relative overflow-hidden"
        style={{ background: "var(--ubasti-sage)" }}
      >
        <div className="absolute top-6 right-8 hidden md:block">
          <Badge variant="forever-friend" size={100} rotate={-10} />
        </div>
        <div className="max-w-[1280px] mx-auto px-6">
          <SectionTitle
            eyebrow="Our Family"
            title="Meet the Kitties"
            subtitle="eight egyptians in search of forever homes (and laps)"
          />
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          {cats.length === 0 ? (
            <p className="text-center py-20" style={{ color: "var(--ubasti-sage)" }}>
              Our kitties are preparing for their debut. Check back soon!
            </p>
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

          <div className="mt-10 text-center">
            <a href="/adoption"
              className="inline-flex h-10 items-center px-6 rounded-full font-medium text-sm transition-opacity hover:opacity-90 border"
              style={{ borderColor: "var(--ubasti-olive-dark)", color: "var(--ubasti-olive-dark)" }}>
              Want to take one home? → Adoption
            </a>
          </div>
        </div>
      </section>

      <FaqSection title="Kitty FAQs" items={FAQ_BY_PAGE.kitties} />
    </div>
  );
}
