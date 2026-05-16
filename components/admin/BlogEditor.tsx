"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RichTextEditor = dynamic(
  () => import("./RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false, loading: () => <div className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} /> }
);

interface PostData {
  title:         string;
  slug:          string;
  excerpt:       string;
  coverImageUrl: string;
  bodyRichtext:  string;
  isPublished:   boolean;
}

const EMPTY: PostData = {
  title: "", slug: "", excerpt: "", coverImageUrl: "", bodyRichtext: "", isPublished: false,
};

export function BlogEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const isNew  = !postId;

  const [form,    setForm]    = useState<PostData>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res  = await fetch(`/api/admin/blog/${postId}`);
        const data = await res.json();
        const p    = data.post;
        if (!cancelled) setForm({
          title:         p.title ?? "",
          slug:          p.slug ?? "",
          excerpt:       p.excerpt ?? "",
          coverImageUrl: p.coverImageUrl ?? "",
          bodyRichtext:  typeof p.bodyRichtext === "string" ? p.bodyRichtext : JSON.stringify(p.bodyRichtext ?? {}),
          isPublished:   !!p.isPublished,
        });
      } catch {
        if (!cancelled) setError("Failed to load post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [postId, isNew]);

  function set(k: keyof PostData, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError("");
    try {
      const body = {
        title:         form.title,
        slug:          form.slug,
        excerpt:       form.excerpt || undefined,
        coverImageUrl: form.coverImageUrl || undefined,
        bodyRichtext:  form.bodyRichtext ? JSON.parse(form.bodyRichtext) : {},
        isPublished:   publish ?? form.isPublished,
      };

      if (isNew) {
        const res  = await fetch("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.formErrors?.[0] ?? "Failed");
        router.push(`/admin/blog/${data.post.id}`);
      } else {
        const res  = await fetch(`/api/admin/blog/${postId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        if (publish !== undefined) setForm((f) => ({ ...f, isPublished: publish }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!postId || !confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/admin/blog/${postId}`, { method: "DELETE" });
    router.push("/admin/blog");
  }

  if (loading) return <div className="h-96 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />;

  const field = "rounded-xl border px-3 py-2 text-sm outline-none w-full";
  const fieldStyle = { borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          {isNew ? "New Post" : "Edit Post"}
        </h1>
        <div className="flex gap-2">
          {!isNew && (
            <button onClick={handleDelete} className="h-9 px-4 rounded-full text-sm border"
              style={{ borderColor: "var(--ubasti-danger)", color: "var(--ubasti-danger)" }}>Delete</button>
          )}
          <button onClick={() => handleSave(form.isPublished ? false : undefined)} disabled={saving}
            className="h-9 px-4 rounded-full text-sm border"
            style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}>
            {form.isPublished ? "Unpublish" : "Save Draft"}
          </button>
          <button onClick={() => handleSave(!isNew ? undefined : true)} disabled={saving}
            className="h-9 px-4 rounded-full text-sm font-medium"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
            {saving ? "Saving…" : isNew ? "Create & Publish" : form.isPublished ? "Save" : "Publish"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Title *</label>
            <input type="text" value={form.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (isNew) set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
              }}
              className={field} style={fieldStyle} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Excerpt</label>
            <textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={`${field} resize-none`} style={fieldStyle} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Body</label>
            <RichTextEditor content={form.bodyRichtext} onChange={(v) => set("bodyRichtext", v)} placeholder="Write your post…" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Slug *</label>
              <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} className={field} style={fieldStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Cover image URL</label>
              <input type="text" value={form.coverImageUrl} onChange={(e) => set("coverImageUrl", e.target.value)} className={field} style={fieldStyle} />
            </div>
            {form.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImageUrl} alt="Cover preview" className="w-full h-32 object-cover rounded-xl" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
