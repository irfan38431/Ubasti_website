import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db/client";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata = { title: "Blog — Ubasti Cat Cafe" };

export default async function BlogPage() {
  let posts: typeof blogPosts.$inferSelect[] = [];
  try {
    posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
  } catch {
    // DB not configured
  }

  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      <section className="py-20 md:py-28 text-center" style={{ background: "var(--ubasti-cream)" }}>
        <SectionTitle
          eyebrow="From the Lounge"
          title="Stories &amp; Updates"
          subtitle="life with cats, coffee, and the occasional Monday miracle"
        />
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
          {posts.length === 0 ? (
            <p className="text-center py-20" style={{ color: "var(--ubasti-sage)" }}>
              No posts yet. Stay tuned for stories from the lounge.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="rounded-2xl overflow-hidden flex flex-col"
                    style={{ background: "var(--ubasti-white)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
                    <div className="relative h-48">
                      <Image
                        src={post.coverImageUrl ?? "/images/placeholders/blog-cover-1.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-2">
                      <p className="text-xs opacity-60" style={{ color: "var(--ubasti-ink)" }}>
                        {post.publishedAt?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <h2 className="text-xl leading-snug"
                        style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--ubasti-sage)" }}>
                          {post.excerpt}
                        </p>
                      )}
                      <p className="text-sm font-medium mt-1 group-hover:underline"
                        style={{ color: "var(--ubasti-olive-dark)" }}>
                        Read more →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
