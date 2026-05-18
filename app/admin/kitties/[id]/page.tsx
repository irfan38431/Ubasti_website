"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { KittyForm } from "../KittyForm";

export default function EditKittyPage() {
  const { id } = useParams<{ id: string }>();
  const [kitty,   setKitty]   = useState<Parameters<typeof KittyForm>[0]["initial"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch("/api/admin/kitties");
        const data = await res.json();
        const k = (data.kitties ?? []).find((k: { id: string }) => k.id === id) ?? null;
        if (!k) { setError("Kitty not found"); return; }
        setKitty(k);
      } catch {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  if (loading) return <div className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />;
  if (error || !kitty) return <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{error || "Not found"}</p>;

  return <KittyForm initial={kitty} />;
}
