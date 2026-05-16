import { db } from "@/lib/db/client";
import { kitties } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { KittyCard } from "@/components/public/KittyCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Meet the Kitties — Ubasti Cat Cafe" };

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
                  slug={cat.slug}
                  name={cat.name}
                  imageUrl={cat.imageUrl}
                  age={cat.age}
                  personality={cat.personality}
                  status={cat.status}
                />
              ))}
            </div>
          )}

          {/* Adoption CTA */}
          <div
            className="mt-16 rounded-2xl p-8 md:p-12 text-center"
            style={{ background: "var(--ubasti-blush-light)" }}
          >
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
            >
              Thinking of Adopting?
            </h2>
            <p className="text-base mb-6 max-w-lg mx-auto" style={{ color: "var(--ubasti-sage)" }}>
              Visit the lounge, spend time with the cats, and if there&apos;s a spark — we&apos;ll guide you
              through the adoption process.
            </p>
            <a
              href="/book"
              className="inline-flex h-12 items-center px-8 rounded-full font-medium text-sm transition-opacity hover:opacity-90"
              style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
            >
              Book a Visit
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
