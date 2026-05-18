"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts/auth";

type Step = "services" | "date" | "pet" | "review" | "confirmed";

const ALL_SERVICES = [
  // Main packages
  { group: "Grooming Packages", name: "Classic Bath" },
  { group: "Grooming Packages", name: "The Royal Treatment" },
  { group: "Grooming Packages", name: "Signature Groom" },
  { group: "Grooming Packages", name: "Couture Cut" },
  { group: "Grooming Packages", name: "Neat & Tidy" },
  { group: "Grooming Packages", name: "The Detailed Groom" },
  // Spa
  { group: "Spa Services", name: "Full Body Massage (30 Mins)" },
  { group: "Spa Services", name: "Pawdicure Massage (15 Mins)" },
  { group: "Spa Services", name: "The Healing Bath" },
  { group: "Spa Services", name: "The Tick-Free Bath (1 Hr)" },
  { group: "Spa Services", name: "The Colour Pop" },
  { group: "Spa Services", name: "Dematting" },
  { group: "Spa Services", name: "Deshedding" },
  { group: "Spa Services", name: "Signature Spa Combo" },
  // Add-ons
  { group: "À La Carte Add-ons", name: "Anal Gland Cleansing" },
  { group: "À La Carte Add-ons", name: "Hair Brushing" },
  { group: "À La Carte Add-ons", name: "Eye Trim" },
  { group: "À La Carte Add-ons", name: "Eye Hair Removal" },
  { group: "À La Carte Add-ons", name: "Paw Trim" },
  { group: "À La Carte Add-ons", name: "Toothbrush" },
];

const GROUPS = Array.from(new Set(ALL_SERVICES.map((s) => s.group)));

function getBookableDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 2) continue; // skip Tuesdays (closed)
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });
}

interface ConfirmedBooking {
  id: string;
  scheduledDate: string;
  petName: string;
}

const card    = "rounded-2xl p-6 md:p-8 flex flex-col gap-6";
const cardStyle = { background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" };

export function GroomingWizard() {
  const { user, isLoading } = useAuth();
  const searchParams        = useSearchParams();
  const preselect           = searchParams.get("service") ?? "";

  const [step,      setStep]      = useState<Step>("services");
  const [selected,  setSelected]  = useState<string[]>(preselect ? [preselect] : []);
  const [date,      setDate]      = useState("");
  const [petName,   setPetName]   = useState("");
  const [petBreed,  setPetBreed]  = useState("");
  const [petNotes,  setPetNotes]  = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  const dates = getBookableDates();

  function toggleService(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  }

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/grooming-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: selected, scheduledDate: date, petName, petBreed: petBreed || undefined, petNotes: petNotes || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setConfirmed(data.booking);
      setStep("confirmed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return null;

  if (!user) {
    const nextUrl = `/grooming/book${preselect ? `?service=${encodeURIComponent(preselect)}` : ""}`;
    return (
      <div className="rounded-2xl p-8 text-center" style={cardStyle}>
        <p className="text-base mb-6" style={{ color: "var(--ubasti-sage)" }}>
          You need to log in to book an appointment.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(nextUrl)}`}
          className="inline-flex h-12 items-center px-8 rounded-full font-medium text-sm"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
        >
          Log in to continue
        </Link>
      </div>
    );
  }

  // ── Step: Services ───────────────────────────────────────────────────────
  if (step === "services") return (
    <div className={card} style={cardStyle}>
      <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>
        Select Services
      </h2>
      {GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--ubasti-mustard)" }}>
            {group}
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_SERVICES.filter((s) => s.group === group).map((s) => {
              const active = selected.includes(s.name);
              return (
                <button
                  key={s.name}
                  onClick={() => toggleService(s.name)}
                  className="px-3 py-1.5 rounded-full text-sm border-2 transition-all"
                  style={{
                    borderColor: active ? "var(--ubasti-olive-dark)" : "var(--ubasti-blush-light)",
                    background:  active ? "var(--ubasti-olive-dark)" : "transparent",
                    color:       active ? "var(--ubasti-cream)"      : "var(--ubasti-ink)",
                  }}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {selected.length > 0 && (
        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
          {selected.length} service{selected.length > 1 ? "s" : ""} selected
        </p>
      )}
      <Button onClick={() => setStep("date")} disabled={selected.length === 0} className="self-end">
        Next: Pick a date →
      </Button>
    </div>
  );

  // ── Step: Date ───────────────────────────────────────────────────────────
  if (step === "date") return (
    <div className={card} style={cardStyle}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>
          Choose a Date
        </h2>
        <button className="text-sm underline" style={{ color: "var(--ubasti-mustard)" }} onClick={() => setStep("services")}>
          ← Back
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {dates.map((d) => (
          <button
            key={d}
            onClick={() => setDate(d)}
            className="p-3 rounded-xl border-2 text-sm text-left transition-all"
            style={{
              borderColor: date === d ? "var(--ubasti-olive-dark)" : "var(--ubasti-blush-light)",
              background:  date === d ? "var(--ubasti-olive-dark)" : "var(--ubasti-paper)",
              color:       date === d ? "var(--ubasti-cream)"      : "var(--ubasti-ink)",
            }}
          >
            <span className="block font-medium">
              {new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" })}
            </span>
            <span className="block text-xs opacity-75">
              {new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </button>
        ))}
      </div>
      <Button onClick={() => setStep("pet")} disabled={!date} className="self-end">
        Next: Pet details →
      </Button>
    </div>
  );

  // ── Step: Pet details ────────────────────────────────────────────────────
  if (step === "pet") return (
    <div className={card} style={cardStyle}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>
          Your Pet's Details
        </h2>
        <button className="text-sm underline" style={{ color: "var(--ubasti-mustard)" }} onClick={() => setStep("date")}>
          ← Back
        </button>
      </div>

      {[
        { label: "Pet name", value: petName, onChange: setPetName, required: true, placeholder: "e.g. Mittens" },
        { label: "Breed (optional)", value: petBreed, onChange: setPetBreed, required: false, placeholder: "e.g. Persian, Labrador" },
      ].map(({ label, value, onChange, required, placeholder }) => (
        <div key={label} className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
            {label}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="h-11 rounded-xl px-4 text-sm outline-none"
            style={{ background: "var(--ubasti-paper)", border: "1px solid var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}
          />
        </div>
      ))}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
          Notes <span className="opacity-50">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={petNotes}
          onChange={(e) => setPetNotes(e.target.value)}
          placeholder="e.g. matted fur, nervous with strangers, allergies…"
          className="rounded-xl border px-4 py-3 text-sm resize-none outline-none"
          style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
        />
      </div>

      <Button onClick={() => setStep("review")} disabled={!petName.trim()} className="self-end">
        Review booking →
      </Button>
    </div>
  );

  // ── Step: Review ─────────────────────────────────────────────────────────
  if (step === "review") return (
    <div className={card} style={cardStyle}>
      <h2 className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
        Review your booking
      </h2>
      <dl className="flex flex-col gap-3 text-sm">
        {[
          ["Date", formatDate(date)],
          ["Pet", petName + (petBreed ? ` (${petBreed})` : "")],
          ["Services", selected.join(", ")],
          petNotes ? ["Notes", petNotes] : null,
        ].filter((x): x is [string, string] => x !== null).map(([label, val]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt style={{ color: "var(--ubasti-sage)" }}>{label}</dt>
            <dd className="text-right font-medium" style={{ color: "var(--ubasti-ink)", maxWidth: "60%" }}>{val}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs opacity-60 text-center" style={{ color: "var(--ubasti-ink)" }}>
        Pay at the cafe after your service · We'll call to confirm your appointment time
      </p>
      {error && <p className="text-sm text-center" style={{ color: "var(--ubasti-danger)" }}>{error}</p>}
      <div className="flex gap-3 justify-between">
        <Button variant="ghost" onClick={() => setStep("pet")}>← Edit</Button>
        <Button onClick={handleConfirm} loading={loading}>Confirm Booking</Button>
      </div>
    </div>
  );

  // ── Step: Confirmed ───────────────────────────────────────────────────────
  if (step === "confirmed" && confirmed) return (
    <div className={card} style={{ ...cardStyle, textAlign: "center" }}>
      <div className="text-4xl">🐾</div>
      <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-olive-dark)", fontWeight: 600 }}>
        Booking Confirmed!
      </h2>
      <div className="text-sm flex flex-col gap-1" style={{ color: "var(--ubasti-sage)" }}>
        <p className="font-medium text-base" style={{ color: "var(--ubasti-ink)" }}>
          {formatDate(confirmed.scheduledDate)}
        </p>
        <p>{confirmed.petName} · Ubasti Cat Cafe, Chennai</p>
        <p className="mt-1">We'll call you to confirm the appointment time.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/account"
          className="inline-flex h-11 items-center justify-center px-6 rounded-full text-sm font-medium"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
        >
          View My Bookings
        </Link>
        <Link
          href="/grooming"
          className="inline-flex h-11 items-center justify-center px-6 rounded-full text-sm font-medium border"
          style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}
        >
          Back to Grooming
        </Link>
      </div>
    </div>
  );

  return null;
}
