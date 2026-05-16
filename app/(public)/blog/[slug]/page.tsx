import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { blogPosts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { TiptapRenderer } from "@/lib/cms/tiptap-render";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const [post] = await db.select({
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      coverImageUrl: blogPosts.coverImageUrl,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    }).from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true))).limit(1);

    if (post) {
      return buildMetadata({
        title: post.title,
        description: post.excerpt?.slice(0, 155) ?? "Read the latest from Ubasti Cat Cafe.",
        path: `/blog/${slug}`,
        image: post.coverImageUrl ? { url: post.coverImageUrl, alt: post.title } : undefined,
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
      });
    }
  } catch {}
  return buildMetadata({ title: "Blog", description: "Ubasti Cat Cafe blog.", path: `/blog/${slug}` });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post: typeof blogPosts.$inferSelect | null = null;
  try {
    const [row] = await db.select().from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true))).limit(1);
    post = row ?? null;
  } catch {}

  if (!post) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://ubasticats.com";
  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? "",
    image: post.coverImageUrl ? [post.coverImageUrl] : [`${appUrl}/og/default.png`],
    datePublished: post.publishedAt?.toISOString() ?? post.updatedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Ubasti Cat Cafe & Lounge" },
    publisher: { "@id": `${appUrl}/#business` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${appUrl}/blog/${slug}` },
  };

  return (
    <div style={{ background: "var(--ubasti-paper)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }} />
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px]">
        <Image
          src={post.coverImageUrl ?? "/images/placeholders/blog-cover-1.svg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" style={{ background: "var(--ubasti-overlay)" }} />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--ubasti-mustard)" }}>
            {post.publishedAt?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1
            className="text-4xl md:text-5xl leading-tight"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}
          >
            {post.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <article className="max-w-2xl mx-auto px-6 py-16">
        {post.excerpt && (
          <p
            className="text-xl leading-relaxed mb-8 pb-8"
            style={{
              fontFamily: "var(--font-caveat)",
              color: "var(--ubasti-sage)",
              fontSize: "1.3rem",
              borderBottom: "1px solid var(--ubasti-blush-light)",
            }}
          >
            {post.excerpt}
          </p>
        )}
        <TiptapRenderer content={post.bodyRichtext as Record<string, unknown>} />
      </article>

      {/* Footer nav */}
      <div
        className="max-w-2xl mx-auto px-6 pb-16 pt-4"
        style={{ borderTop: "1px solid var(--ubasti-blush-light)" }}
      >
        <Link
          href="/blog"
          className="text-sm font-medium hover:underline"
          style={{ color: "var(--ubasti-olive-dark)" }}
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
