"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface MediaItem {
  id:       string;
  url:      string;
  altText:  string | null;
  mimeType: string | null;
}

interface Props {
  open:     boolean;
  onClose:  () => void;
  onSelect: (url: string, alt: string) => void;
}

export function MediaPicker({ open, onClose, onSelect }: Props) {
  const [media,     setMedia]     = useState<MediaItem[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [altText,   setAltText]   = useState("");
  const [error,     setError]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
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
  }, [open]);

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

  async function handleDelete(id: string) {
    if (!confirm("Remove this image?")) return;
    await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMedia((m) => m.filter((x) => x.id !== id));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: "var(--ubasti-white)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--ubasti-blush-light)" }}>
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>Media Library</h2>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: "var(--ubasti-sage)" }}>×</button>
        </div>

        {/* Upload */}
        <div className="px-6 py-3 flex gap-3 items-center" style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Alt text (required)"
            className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
          />
          <label className="inline-flex items-center h-9 px-4 rounded-full text-sm font-medium cursor-pointer"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
            {uploading ? "Uploading…" : "Upload"}
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleUpload} disabled={uploading} />
          </label>
          {error && <span className="text-xs" style={{ color: "var(--ubasti-danger)" }}>{error}</span>}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
              ))}
            </div>
          ) : media.length === 0 ? (
            <p className="text-center text-sm py-16" style={{ color: "var(--ubasti-sage)" }}>No media yet. Upload your first image above.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {media.map((item) => (
                <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--ubasti-blush-light)" }}>
                  <Image src={item.url} alt={item.altText ?? "media"} fill className="object-cover" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                    style={{ background: "rgba(0,0,0,0.5)" }}>
                    <button
                      onClick={() => { onSelect(item.url, item.altText ?? ""); onClose(); }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: "var(--ubasti-mustard)", color: "var(--ubasti-ink)" }}
                    >
                      Select
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: "var(--ubasti-danger)", color: "white" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
