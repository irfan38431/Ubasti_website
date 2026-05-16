"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface MediaItem {
  id:        string;
  url:       string;
  altText:   string | null;
  mimeType:  string | null;
  sizeBytes: number | null;
  createdAt: string;
}

export default function AdminMedia() {
  const [media,     setMedia]     = useState<MediaItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [altText,   setAltText]   = useState("");
  const [error,     setError]     = useState("");
  const [selected,  setSelected]  = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res  = await fetch("/api/admin/media");
        const data = await res.json();
        if (!cancelled) setMedia(data.media ?? []);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!altText.trim()) { setError("Enter alt text before uploading"); return; }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("altText", altText.trim());
      const res  = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setMedia((m) => [data.media, ...m]);
      setAltText("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteSelected() {
    if (!confirm(`Delete ${selected.size} image(s)? This cannot be undone.`)) return;
    for (const id of selected) {
      await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    }
    setMedia((m) => m.filter((x) => !selected.has(x.id)));
    setSelected(new Set());
  }

  function toggleSelect(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>Media Library</h1>
        {selected.size > 0 && (
          <button onClick={handleDeleteSelected}
            className="h-9 px-4 rounded-full text-sm border"
            style={{ borderColor: "var(--ubasti-danger)", color: "var(--ubasti-danger)" }}>
            Delete {selected.size} selected
          </button>
        )}
      </div>

      {/* Upload bar */}
      <div className="flex gap-3 items-center flex-wrap">
        <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)}
          placeholder="Alt text (required)"
          className="rounded-xl border px-3 py-2 text-sm outline-none flex-1 min-w-[200px]"
          style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
        />
        <label className="inline-flex items-center h-10 px-5 rounded-full text-sm font-medium cursor-pointer"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
          {uploading ? "Uploading…" : "+ Upload Image"}
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleUpload} disabled={uploading} />
        </label>
        {error && <span className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{error}</span>}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
          ))}
        </div>
      ) : media.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              style={{
                border: selected.has(item.id) ? "3px solid var(--ubasti-mustard)" : "1px solid var(--ubasti-blush-light)",
              }}
              onClick={() => toggleSelect(item.id)}
            >
              <Image src={item.url} alt={item.altText ?? "media"} fill className="object-cover" />
              {selected.has(item.id) && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "var(--ubasti-mustard)", color: "var(--ubasti-ink)", fontSize: 10, fontWeight: 700 }}>
                  ✓
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.6)" }}>
                <p className="text-white text-xs truncate">{item.altText ?? "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
