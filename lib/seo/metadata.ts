import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ubasticats.com";
const SITE_NAME = "Ubasti Cat Cafe & Lounge";

export const DEFAULT_OG_IMAGE = {
  url: `${APP_URL}/og/default.png`,
  width: 1200,
  height: 630,
  alt: "Ubasti Cat Cafe & Lounge — Chennai",
};

export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
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
