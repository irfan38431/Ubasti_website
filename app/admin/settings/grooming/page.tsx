"use client";

import { useEffect, useState } from "react";

interface PriceEntry { label: string; price: string }
interface ServicePrices {
  flat?: string;
  cats?: PriceEntry[];
  dogs?: PriceEntry[];
}
interface GroomingService {
  name:       string;
  desc:       string;
  prices:     ServicePrices;
  highlight?: boolean;
}
interface Addon { name: string; price: string }
interface GroomingData {
  mainPackages: GroomingService[];
  spaServices:  GroomingService[];
  addons:       Addon[];
}

function PriceField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-24 shrink-0" style={{ color: "var(--ubasti-sage)" }}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 px-2 rounded-lg text-sm w-28"
        style={{ background: "var(--ubasti-paper)", border: "1px solid var(--ubasti-blush-light)", color: "var(--ubasti-ink)" }}
      />
    </div>
  );
}

function ServiceCard({ service, onChange }: { service: GroomingService; onChange: (s: GroomingService) => void }) {
  function updatePrice(tier: "flat" | "cats" | "dogs", idx: number | null, field: "price" | "label", val: string) {
    const prices = { ...service.prices };
    if (tier === "flat") {
      prices.flat = val;
    } else if (tier === "cats" && prices.cats && idx !== null) {
      const arr = [...prices.cats];
      arr[idx] = { ...arr[idx], [field]: val };
      prices.cats = arr;
    } else if (tier === "dogs" && prices.dogs && idx !== null) {
      const arr = [...prices.dogs];
      arr[idx] = { ...arr[idx], [field]: val };
      prices.dogs = arr;
    }
    onChange({ ...service, prices });
  }

  return (
    <div className="rounded-xl p-4 flex flex-col gap-3" style={{ border: "1px solid var(--ubasti-blush-light)", background: "var(--ubasti-white)" }}>
      <p className="font-medium text-sm" style={{ color: "var(--ubasti-ink)" }}>{service.name}</p>
      {service.prices.flat !== undefined && (
        <PriceField label="Price" value={service.prices.flat} onChange={(v) => updatePrice("flat", null, "price", v)} />
      )}
      {service.prices.cats?.map((entry, i) => (
        <PriceField key={i} label={entry.label} value={entry.price} onChange={(v) => updatePrice("cats", i, "price", v)} />
      ))}
      {service.prices.dogs?.map((entry, i) => (
        <PriceField key={i} label={entry.label} value={entry.price} onChange={(v) => updatePrice("dogs", i, "price", v)} />
      ))}
    </div>
  );
}

export default function GroomingSettingsPage() {
  const [data,    setData]    = useState<GroomingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState("");

  useEffect(() => {
    fetch("/api/admin/settings?key=groomingPackages")
      .then((r) => r.json())
      .then((d) => setData(d.value as GroomingData))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateMain(i: number, s: GroomingService) {
    if (!data) return;
    const mainPackages = [...data.mainPackages];
    mainPackages[i] = s;
    setData({ ...data, mainPackages });
  }

  function updateSpa(i: number, s: GroomingService) {
    if (!data) return;
    const spaServices = [...data.spaServices];
    spaServices[i] = s;
    setData({ ...data, spaServices });
  }

  function updateAddon(i: number, field: "name" | "price", val: string) {
    if (!data) return;
    const addons = [...data.addons];
    addons[i] = { ...addons[i], [field]: val };
    setData({ ...data, addons });
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ key: "groomingPackages", value: data }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setToast("Saved!");
      setTimeout(() => setToast(""), 3000);
    } catch {
      setToast("Error saving");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />;
  if (!data)   return <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>Failed to load grooming data.</p>;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          Grooming Prices
        </h1>
        <div className="flex items-center gap-3">
          {toast && <span className="text-sm" style={{ color: "var(--ubasti-success)" }}>{toast}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-5 rounded-full text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--ubasti-ink)", fontFamily: "var(--font-cormorant)" }}>Main Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.mainPackages.map((s, i) => (
            <ServiceCard key={i} service={s} onChange={(v) => updateMain(i, v)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--ubasti-ink)", fontFamily: "var(--font-cormorant)" }}>Spa Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.spaServices.map((s, i) => (
            <ServiceCard key={i} service={s} onChange={(v) => updateSpa(i, v)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--ubasti-ink)", fontFamily: "var(--font-cormorant)" }}>À La Carte Add-ons</h2>
        <div className="flex flex-col gap-2">
          {data.addons.map((a, i) => (
            <div key={i} className="flex items-center gap-4">
              <input
                value={a.name}
                onChange={(e) => updateAddon(i, "name", e.target.value)}
                className="h-8 px-3 rounded-lg text-sm flex-1"
                style={{ background: "var(--ubasti-paper)", border: "1px solid var(--ubasti-blush-light)", color: "var(--ubasti-ink)" }}
              />
              <input
                value={a.price}
                onChange={(e) => updateAddon(i, "price", e.target.value)}
                className="h-8 px-3 rounded-lg text-sm w-28"
                style={{ background: "var(--ubasti-paper)", border: "1px solid var(--ubasti-blush-light)", color: "var(--ubasti-ink)" }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
