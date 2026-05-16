"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PostRow {
  id:          string;
  slug:        string;
  title:       string;
  isPublished: boolean;
  updatedAt:   string;
}

export default function AdminBlog() {
  const [rows,    setRows]    = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res  = await fetch("/api/admin/blog");
        const data = await res.json();
        if (!cancelled) setRows(data.posts ?? []);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>Blog</h1>
        <Link href="/admin/blog/new"
          className="inline-flex items-center h-9 px-5 rounded-full text-sm font-medium"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
          + New Post
        </Link>
      </div>

      {loading ? (
        <div className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
      ) : rows.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>No posts yet.</p>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                {["Title", "Slug", "Status", "Updated", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? "var(--ubasti-white)" : "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--ubasti-ink)" }}>{r.title}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--ubasti-sage)" }}>{r.slug}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                      style={{ background: r.isPublished ? "var(--ubasti-success)" : "var(--ubasti-mustard)", color: r.isPublished ? "white" : "var(--ubasti-ink)" }}>
                      {r.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--ubasti-sage)" }}>{new Date(r.updatedAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/blog/${r.id}`} className="text-xs font-medium hover:underline" style={{ color: "var(--ubasti-olive-dark)" }}>Edit →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
