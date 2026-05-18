"use client";

import { useEffect, useState } from "react";

interface CounterOverrides {
  rescued?: number | null;
  atCafe?:  number | null;
  adopted?: number | null;
}

export default function CountersSettingsPage() {
  const [rescued, setRescued] = useState("");
  const [atCafe,  setAtCafe]  = useState("");
  const [adopted, setAdopted] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState("");

  useEffect(() => {
    fetch("/api/admin/settings?key=impactCounters")
      .then((r) => r.json())
      .then((d) => {
        const v = (d.value ?? {}) as CounterOverrides;
        setRescued(v.rescued != null ? String(v.rescued) : "");
        setAtCafe( v.atCafe  != null ? String(v.atCafe)  : "");
        setAdopted(v.adopted != null ? String(v.adopted) : "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const value: CounterOverrides = {
        rescued: rescued !== "" ? Number(rescued) : null,
        atCafe:  atCafe  !== "" ? Number(atCafe)  : null,
        adopted: adopted !== "" ? Number(adopted) : null,
      };
      const res = await fetch("/api/admin/settings", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ key: "impactCounters", value }),
      });
      if (!res.ok) throw new Error("Failed");
      setToast("Saved!");
      setTimeout(() => setToast(""), 3000);
    } catch {
      setToast("Error saving");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    height: "2.5rem",
    width: "100%",
    padding: "0 0.75rem",
    borderRadius: "0.75rem",
    background: "var(--ubasti-paper)",
    border: "1px solid var(--ubasti-blush-light)",
    color: "var(--ubasti-ink)",
    fontSize: "0.875rem",
  } as const;

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--ubasti-sage)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "0.25rem",
  };

  if (loading) return <div className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />;

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          Impact Counters
        </h1>
        {toast && <span className="text-sm" style={{ color: "var(--ubasti-success)" }}>{toast}</span>}
      </div>

      <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
        Override the home page impact counters. Leave blank to use live counts from the database.
      </p>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div>
          <label style={labelStyle}>Cats Rescued</label>
          <input style={inputStyle} type="number" min="0" value={rescued} onChange={(e) => setRescued(e.target.value)} placeholder="Auto from DB" />
        </div>
        <div>
          <label style={labelStyle}>Cats at the Cafe</label>
          <input style={inputStyle} type="number" min="0" value={atCafe}  onChange={(e) => setAtCafe(e.target.value)}  placeholder="Auto from DB" />
        </div>
        <div>
          <label style={labelStyle}>Cats Adopted</label>
          <input style={inputStyle} type="number" min="0" value={adopted} onChange={(e) => setAdopted(e.target.value)} placeholder="Auto from DB" />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="h-10 px-6 rounded-full text-sm font-medium disabled:opacity-50 self-start"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
        >
          {saving ? "Saving…" : "Save Overrides"}
        </button>
      </form>
    </div>
  );
}
