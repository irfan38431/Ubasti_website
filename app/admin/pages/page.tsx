"use client";

import { useEffect, useState } from "react";

interface PageRow {
  slug:        string;
  title:       string;
  isPublished: boolean;
  updatedAt:   string;
  hasDraft:    boolean;
}

const PAGE_SLUGS: Record<string, string> = {
  home:            "/",
  about:           "/about",
  "private-parties": "/private-parties",
  waiver:          "/waiver",
};

export default function AdminPagesPage() {
  const [pages,   setPages]   = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const slugs = Object.keys(PAGE_SLUGS);
        const rows: PageRow[] = await Promise.all(
          slugs.map(async (slug) => {
            const res  = await fetch(`/api/admin/pages/${slug}`);
            const data = await res.json();
            const page = data.page;
            return {
              slug,
              title:       page?.title ?? slug,
              isPublished: page?.is_published ?? true,
              updatedAt:   page?.updated_at ?? "",
              hasDraft:    !!page?.draft_blocks,
            };
          })
        );
        if (!cancelled) setPages(rows);
      } catch {
        if (!cancelled) setPages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
        Pages
      </h1>
      <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
        Click &ldquo;Edit&rdquo; to open a page in inline edit mode. Changes are saved as drafts until you publish.
      </p>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pages.map((p) => {
            const publicUrl = PAGE_SLUGS[p.slug] ?? `/${p.slug}`;
            return (
              <div
                key={p.slug}
                className="flex items-center justify-between px-5 py-4 rounded-2xl"
                style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-sm" style={{ color: "var(--ubasti-ink)" }}>{p.title}</span>
                  <span className="text-xs" style={{ color: "var(--ubasti-sage)" }}>{publicUrl}</span>
                </div>
                <div className="flex items-center gap-3">
                  {p.hasDraft && (
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: "var(--ubasti-mustard)", color: "var(--ubasti-ink)" }}>
                      Draft
                    </span>
                  )}
                  <a
                    href={`${publicUrl}?edit=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center px-4 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                    style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
                  >
                    Edit
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
