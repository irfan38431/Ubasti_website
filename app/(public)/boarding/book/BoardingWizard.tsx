"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts/auth";

type Step      = "stay" | "dates" | "pet" | "review" | "confirmed";
type StayType  = "lounge" | "enclosure";
type FoodOpt   = "ubasti" | "own";

const PRICING: Record<StayType, Record<FoodOpt, number>> = {
  lounge:    { ubasti: 1000, own: 900  },
  enclosure: { ubasti: 800,  own: 700  },
};

const STAY_LABELS: Record<StayType, string>  = { lounge: "Lounge Stay", enclosure: "Enclosure Stay" };
const FOOD_LABELS: Record<FoodOpt, string>   = { ubasti: "Ubasti food & litter", own: "My food & litter" };

function getBookableDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i <= 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const d1 = new Date(checkIn  + "T00:00:00");
  const d2 = new Date(checkOut + "T00:00:00");
  return Math.round((d2.getTime() - d1.getTime()) / 86_400_000);
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });
}

interface ConfirmedBooking {
  id: string;
  checkIn: string;
  checkOut: string;
  stayType: string;
  petName: string;
}

const card      = "rounded-2xl p-6 md:p-8 flex flex-col gap-6";
const cardStyle = { background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" };

export function BoardingWizard() {
  const { user, isLoading } = useAuth();

  const [step,       setStep]       = useState<Step>("stay");
  const [stayType,   setStayType]   = useState<StayType>("lounge");
  const [foodOpt,    setFoodOpt]    = useState<FoodOpt>("ubasti");
  const [checkIn,    setCheckIn]    = useState("");
  const [checkOut,   setCheckOut]   = useState("");
  const [petName,    setPetName]    = useState("");
  const [petBreed,   setPetBreed]   = useState("");
  const [petNotes,   setPetNotes]   = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [confirmed,  setConfirmed]  = useState<ConfirmedBooking | null>(null);

  const dates   = getBookableDates();
  const price   = PRICING[stayType][foodOpt];
  const nights  = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const total   = nights * price;

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/boarding-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stayType, foodOption: foodOpt, checkIn, checkOut,
          petName, petBreed: petBreed || undefined, petNotes: petNotes || undefined,
        }),
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
    return (
      <div className="rounded-2xl p-8 text-center" style={cardStyle}>
        <p className="text-base mb-6" style={{ color: "var(--ubasti-sage)" }}>
          You need to log in to book a boarding stay.
        </p>
        <Link
          href="/login?next=/boarding/book"
          className="inline-flex h-12 items-center px-8 rounded-full font-medium text-sm"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
        >
          Log in to continue
        </Link>
      </div>
    );
  }

  // ── Step: Stay type & food ───────────────────────────────────────────────
  if (step === "stay") return (
    <div className={card} style={cardStyle}>
      <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>
        Choose Stay Type
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(["lounge", "enclosure"] as StayType[]).map((type) => (
          <button
            key={type}
            onClick={() => setStayType(type)}
            className="p-4 rounded-2xl border-2 text-left transition-all"
            style={{
              borderColor: stayType === type ? "var(--ubasti-olive-dark)" : "var(--ubasti-blush-light)",
              background:  stayType === type ? "var(--ubasti-cream)"      : "var(--ubasti-paper)",
            }}
          >
            <p className="font-semibold text-sm" style={{ color: "var(--ubasti-ink)" }}>
              {STAY_LABELS[type]}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--ubasti-sage)" }}>
              {type === "lounge"
                ? "Roams with feline friends in the lounge"
                : "Private cozy boarding enclosure"}
            </p>
            <p className="text-sm font-bold mt-2" style={{ color: "var(--ubasti-olive-dark)" }}>
              from ₹{PRICING[type].own}/night
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>Food & Litter</p>
        <div className="flex gap-3">
          {(["ubasti", "own"] as FoodOpt[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setFoodOpt(opt)}
              className="flex-1 py-2.5 px-4 rounded-xl border-2 text-sm transition-all"
              style={{
                borderColor: foodOpt === opt ? "var(--ubasti-olive-dark)" : "var(--ubasti-blush-light)",
                background:  foodOpt === opt ? "var(--ubasti-olive-dark)" : "transparent",
                color:       foodOpt === opt ? "var(--ubasti-cream)"      : "var(--ubasti-ink)",
              }}
            >
              {opt === "ubasti" ? "Ubasti provides (₹" + PRICING[stayType].ubasti + "/night)" : "I bring my own (₹" + PRICING[stayType].own + "/night)"}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center py-2">
        <span className="text-2xl font-bold" style={{ color: "var(--ubasti-olive-dark)", fontFamily: "var(--font-cormorant)" }}>
          ₹{price}
        </span>
        <span className="text-sm ml-1" style={{ color: "var(--ubasti-sage)" }}>/night</span>
      </div>

      <Button onClick={() => setStep("dates")} className="self-end">
        Next: Choose dates →
      </Button>
    </div>
  );

  // ── Step: Dates ──────────────────────────────────────────────────────────
  if (step === "dates") return (
    <div className={card} style={cardStyle}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>
          Select Dates
        </h2>
        <button className="text-sm underline" style={{ color: "var(--ubasti-mustard)" }} onClick={() => setStep("stay")}>
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>Check-in</label>
          <select
            value={checkIn}
            onChange={(e) => { setCheckIn(e.target.value); setCheckOut(""); }}
            className="h-11 rounded-xl px-3 text-sm outline-none"
            style={{ background: "var(--ubasti-paper)", border: "1px solid var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}
          >
            <option value="">Select date</option>
            {dates.map((d) => (
              <option key={d} value={d}>
                {new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>Check-out</label>
          <select
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            disabled={!checkIn}
            className="h-11 rounded-xl px-3 text-sm outline-none disabled:opacity-50"
            style={{ background: "var(--ubasti-paper)", border: "1px solid var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}
          >
            <option value="">Select date</option>
            {dates.filter((d) => d > checkIn).map((d) => (
              <option key={d} value={d}>
                {new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {nights > 0 && (
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "var(--ubasti-cream)", border: "1px solid var(--ubasti-blush-light)" }}
        >
          <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
            {nights} night{nights > 1 ? "s" : ""} · {STAY_LABELS[stayType]} · {FOOD_LABELS[foodOpt]}
          </p>
          <p className="text-xl font-bold mt-1" style={{ color: "var(--ubasti-olive-dark)", fontFamily: "var(--font-cormorant)" }}>
            Estimated total: ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
      )}

      <Button onClick={() => setStep("pet")} disabled={!checkIn || !checkOut || nights <= 0} className="self-end">
        Next: Pet details →
      </Button>
    </div>
  );

  // ── Step: Pet details ────────────────────────────────────────────────────
  if (step === "pet") return (
    <div className={card} style={cardStyle}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>
          Your Cat's Details
        </h2>
        <button className="text-sm underline" style={{ color: "var(--ubasti-mustard)" }} onClick={() => setStep("dates")}>
          ← Back
        </button>
      </div>

      {[
        { label: "Cat's name", value: petName, onChange: setPetName, required: true, placeholder: "e.g. Luna" },
        { label: "Breed (optional)", value: petBreed, onChange: setPetBreed, required: false, placeholder: "e.g. Persian, DSH" },
      ].map(({ label, value, onChange, required, placeholder }) => (
        <div key={label} className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>{label}</label>
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
          placeholder="e.g. medications, food preferences, temperament, vaccination status…"
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
          ["Stay type",  STAY_LABELS[stayType]],
          ["Food",       FOOD_LABELS[foodOpt]],
          ["Check-in",   formatDate(checkIn)],
          ["Check-out",  formatDate(checkOut)],
          ["Nights",     `${nights} night${nights > 1 ? "s" : ""}`],
          ["Estimate",   `₹${total.toLocaleString("en-IN")}`],
          ["Cat",        petName + (petBreed ? ` (${petBreed})` : "")],
          petNotes ? ["Notes", petNotes] : null,
        ].filter((x): x is [string, string] => x !== null).map(([label, val]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt style={{ color: "var(--ubasti-sage)" }}>{label}</dt>
            <dd className="text-right font-medium" style={{ color: "var(--ubasti-ink)", maxWidth: "60%" }}>{val}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs opacity-60 text-center" style={{ color: "var(--ubasti-ink)" }}>
        A deposit is required to confirm · Full balance paid at check-in · Drop off & pick up during business hours
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
      <div className="text-4xl">🐱</div>
      <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-olive-dark)", fontWeight: 600 }}>
        Stay Booked!
      </h2>
      <div className="text-sm flex flex-col gap-1" style={{ color: "var(--ubasti-sage)" }}>
        <p className="font-medium text-base" style={{ color: "var(--ubasti-ink)" }}>
          {formatDate(confirmed.checkIn)} → {formatDate(confirmed.checkOut)}
        </p>
        <p>{confirmed.petName} · {STAY_LABELS[confirmed.stayType as StayType]}</p>
        <p className="mt-1">Our team will contact you regarding the deposit to confirm your booking.</p>
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
          href="/boarding"
          className="inline-flex h-11 items-center justify-center px-6 rounded-full text-sm font-medium border"
          style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}
        >
          Back to Boarding
        </Link>
      </div>
    </div>
  );

  return null;
}
