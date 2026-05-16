import type { MetadataRoute } from "next";
import { db } from "@/lib/db/client";
import { events, blogPosts } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ubasti.cafe";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: APP_URL,                           lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${APP_URL}/about`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${APP_URL}/kitties`,              lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${APP_URL}/events`,               lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${APP_URL}/private-parties`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${APP_URL}/blog`,                 lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${APP_URL}/book`,                 lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${APP_URL}/waiver`,               lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  let eventRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes:  MetadataRoute.Sitemap = [];

  try {
    const upcomingEvents = await db
      .select({ slug: events.slug, updatedAt: events.updatedAt })
      .from(events)
      .where(and(eq(events.isPublished, true), gte(events.startsAt, new Date())));

    eventRoutes = upcomingEvents.map((e) => ({
      url: `${APP_URL}/events/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const posts = await db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true));

    blogRoutes = posts.map((p) => ({
      url: `${APP_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB unavailable at build time — return static routes only
  }

  return [...staticRoutes, ...eventRoutes, ...blogRoutes];
}
