"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface KittyFormProps {
  initial?: {
    id:          string;
    slug:        string;
    name:        string;
    age:         string | null;
    sex:         string | null;
    personality: string | null;
    bio:         string | null;
    imageUrl:    string | null;
    status:      string;
    sortOrder:   number | null;
  };
}

const STATUSES = ["available", "on-hold", "reserved", "adopted"] as const;

export function KittyForm({ initial }: KittyFormProps) {
  const router  = useRouter();
  const isEdit  = !!initial;

  const [name,        setName]        = useState(initial?.name        ?? "");
  const [slug,        setSlug]        = useState(initial?.slug        ?? "");
  const [age,         setAge]         = useState(initial?.age         ?? "");
  const [sex,         setSex]         = useState(initial?.sex         ?? "");
  const [personality, setPersonality] = useState(initial?.personality ?? "");
  const [bio,         setBio]         = useState(initial?.bio         ?? "");
  const [imageUrl,    setImageUrl]    = useState(initial?.imageUrl    ?? "");
  const [status,      setStatus]      = useState(initial?.status      ?? "available");
  const [sortOrder,   setSortOrder]   = useState(String(initial?.sortOrder ?? 0));
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");
  const [pickerOpen,  setPickerOpen]  = useState(false);

  function autoSlug(n: string) {
    return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = { name, slug, age: age || undefined, sex: sex || undefined, personality: personality || undefined, bio: bio || undefined, imageUrl: imageUrl || undefined, status, sortOrder: Number(sortOrder) };
      const res = isEdit
        ? await fetch(`/api/admin/kitties/${initial!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/admin/kitties", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      if (status === "adopted") {
        router.push("/admin/adoptions");
      } else {
        router.push("/admin/kitties");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    background: "var(--ubasti-paper)",
    border: "1px solid var(--ubasti-blush-light)",
    color: "var(--ubasti-ink)",
    borderRadius: "0.75rem",
    padding: "0.5rem 0.75rem",
    width: "100%",
    fontSize: "0.875rem",
  } as const;

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--ubasti-sage)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "0.25rem",
    display: "block",
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          {isEdit ? `Edit ${initial!.name}` : "Add Kitty"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Name *</label>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(autoSlug(e.target.value)); }}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Slug *</label>
            <input
              style={inputStyle}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              pattern="[a-z0-9-]+"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label style={labelStyle}>Age</label>
            <input style={inputStyle} value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 2 years" />
          </div>
          <div>
            <label style={labelStyle}>Sex</label>
            <select style={inputStyle} value={sex} onChange={(e) => setSex(e.target.value)}>
              <option value="">Unknown</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Personality</label>
          <input style={inputStyle} value={personality} onChange={(e) => setPersonality(e.target.value)} placeholder="e.g. Playful & curious" />
        </div>

        <div>
          <label style={labelStyle}>Bio</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short description of the cat…"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label style={labelStyle}>Photo</label>
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
                  <Image src={imageUrl} alt="Kitty photo" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 text-2xl" style={{ background: "var(--ubasti-blush-light)" }}>🐱</div>
              )}
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="h-9 px-4 rounded-full text-sm font-medium border"
                style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)", background: "var(--ubasti-paper)" }}
              >
                {imageUrl ? "Change Image" : "Upload Image"}
              </button>
              {imageUrl && (
                <button type="button" onClick={() => setImageUrl("")} className="text-xs" style={{ color: "var(--ubasti-danger)" }}>Remove</button>
              )}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Sort Order</label>
            <input style={inputStyle} type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
        </div>
        <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(url) => { setImageUrl(url); setPickerOpen(false); }} />

        {status === "adopted" && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--ubasti-mustard)", color: "var(--ubasti-ink)" }}>
            After saving, you will be taken to the Adoptions page to record the adopter's details and schedule follow-up check-ins.
          </div>
        )}

        {error && <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-6 rounded-full text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Kitty"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/kitties")}
            className="h-10 px-6 rounded-full text-sm font-medium"
            style={{ background: "var(--ubasti-paper)", color: "var(--ubasti-sage)", border: "1px solid var(--ubasti-blush-light)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
