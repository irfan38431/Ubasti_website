"use client";

import { useState, useEffect } from "react";
import { DatePicker }             from "@/components/booking/DatePicker";
import { SlotPicker, type SlotOption } from "@/components/booking/SlotPicker";
import { Button }                  from "@/components/ui/Button";
import { useAuth }                 from "@/lib/contexts/auth";
import Link                        from "next/link";

type Step = "date" | "slot" | "details" | "review" | "confirmed";

interface BookingResult {
  id: string;
  slotStart: string;
  slotEnd:   string;
  partySize: number;
  notes?:    string;
}

interface Props {
  dates: string[];
}

export function BookWizard({ dates }: Props) {
  const { user, isLoading } = useAuth();

  const [step,        setStep]        = useState<Step>("date");
  const [date,        setDate]        = useState(dates[0] ?? "");
  const [slots,       setSlots]       = useState<SlotOption[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotStart,   setSlotStart]   = useState("");
  const [slotEnd,     setSlotEnd]     = useState("");
  const [slotLabel,   setSlotLabel]   = useState("");
  const [partySize,   setPartySize]   = useState(1);
  const [notes,       setNotes]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [confirmed,   setConfirmed]   = useState<BookingResult | null>(null);
  const [smsOk,       setSmsOk]       = useState(true);

  // Load slots when date changes
  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    async function load() {
      setSlotsLoading(true);
      setSlotStart("");
      setSlotEnd("");
      setSlotLabel("");
      try {
        const r = await fetch(`/api/slots?date=${date}`);
        const d = await r.json();
        if (!cancelled) setSlots(d.slots ?? []);
      } catch {
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [date]);

  if (isLoading) return null;

  if (!user) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}
      >
        <p className="text-base mb-6" style={{ color: "var(--ubasti-sage)" }}>
          You need to log in to book a session.
        </p>
        <Link
          href="/login?next=/book"
          className="inline-flex h-12 items-center px-8 rounded-full font-medium text-sm"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
        >
          Log in to continue
        </Link>
      </div>
    );
  }

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotStart, slotEnd, partySize, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setConfirmed(data.appointment);
      setSmsOk(!data.smsError);
      setStep("confirmed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(d: string) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  }


  const card = "rounded-2xl p-6 md:p-8 flex flex-col gap-6";
  const cardStyle = { background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" };

  // ── Step: Date ──────────────────────────────────────────────────────────
  if (step === "date") return (
    <div className={card} style={cardStyle}>
      <DatePicker dates={dates} value={date} onChange={(d) => { setDate(d); }} />
      <Button
        onClick={() => setStep("slot")}
        disabled={!date}
        className="self-end"
      >
        Next: Pick a time →
      </Button>
    </div>
  );

  // ── Step: Slot ──────────────────────────────────────────────────────────
  if (step === "slot") return (
    <div className={card} style={cardStyle}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--ubasti-sage)" }}>{formatDate(date)}</p>
        <button className="text-sm underline" style={{ color: "var(--ubasti-mustard)" }} onClick={() => setStep("date")}>Change date</button>
      </div>
      <SlotPicker
        slots={slots}
        value={slotStart}
        onChange={(s, e) => {
          setSlotStart(s);
          setSlotEnd(e);
          setSlotLabel(slots.find((sl) => sl.start === s)?.label ?? "");
        }}
        loading={slotsLoading}
      />
      <Button onClick={() => setStep("details")} disabled={!slotStart} className="self-end">
        Next: Party size →
      </Button>
    </div>
  );

  // ── Step: Details ───────────────────────────────────────────────────────
  if (step === "details") return (
    <div className={card} style={cardStyle}>
      <div className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
        {formatDate(date)} · {slotLabel}
        <button className="ml-3 underline" style={{ color: "var(--ubasti-mustard)" }} onClick={() => setStep("slot")}>Change</button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
          Party size (1–4 guests)
        </label>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setPartySize(n)}
              className="w-14 h-14 rounded-xl border-2 text-lg font-bold transition-all"
              style={{
                borderColor: partySize === n ? "var(--ubasti-olive-dark)" : "var(--ubasti-blush-light)",
                background:  partySize === n ? "var(--ubasti-olive-dark)" : "transparent",
                color:       partySize === n ? "var(--ubasti-cream)"      : "var(--ubasti-ink)",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
          Notes <span className="opacity-50">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. celebrating a birthday, first-time visitor…"
          className="rounded-xl border px-4 py-3 text-sm resize-none outline-none"
          style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
        />
      </div>

      <Button onClick={() => setStep("review")} className="self-end">
        Review booking →
      </Button>
    </div>
  );

  // ── Step: Review ────────────────────────────────────────────────────────
  if (step === "review") return (
    <div className={card} style={cardStyle}>
      <h2 className="text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
        Review your booking
      </h2>
      <dl className="flex flex-col gap-3 text-sm">
        {[
          ["Date",       formatDate(date)],
          ["Time",       slotLabel],
          ["Party size", `${partySize} guest${partySize > 1 ? "s" : ""}`],
          notes && ["Notes", notes],
        ].filter(Boolean).map(([label, val]) => (
          <div key={label as string} className="flex justify-between gap-4">
            <dt style={{ color: "var(--ubasti-sage)" }}>{label}</dt>
            <dd className="text-right font-medium" style={{ color: "var(--ubasti-ink)" }}>{val as string}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs opacity-60 text-center" style={{ color: "var(--ubasti-ink)" }}>
        Payment on arrival · Cancel up to 24h before
      </p>
      {error && <p className="text-sm text-center" style={{ color: "var(--ubasti-danger)" }}>{error}</p>}
      <div className="flex gap-3 justify-between">
        <Button variant="ghost" onClick={() => setStep("details")}>← Edit</Button>
        <Button onClick={handleConfirm} loading={loading}>Confirm Booking</Button>
      </div>
    </div>
  );

  // ── Step: Confirmed ─────────────────────────────────────────────────────
  if (step === "confirmed" && confirmed) {
    const icsUrl = `/api/appointments/${confirmed.id}/ics`;
    return (
      <div className={card} style={{ ...cardStyle, textAlign: "center" }}>
        <div className="text-4xl">🐱</div>
        <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-olive-dark)", fontWeight: 600 }}>
          You&apos;re booked!
        </h2>
        <div className="text-sm flex flex-col gap-1" style={{ color: "var(--ubasti-sage)" }}>
          <p className="font-medium text-base" style={{ color: "var(--ubasti-ink)" }}>
            {formatDate(date)} · {slotLabel}
          </p>
          <p>{confirmed.partySize} guest{confirmed.partySize > 1 ? "s" : ""} · Ubasti Cat Cafe, Chennai</p>
        </div>
        {!smsOk && (
          <p className="text-xs rounded-xl px-4 py-2" style={{ background: "var(--ubasti-blush-light)", color: "var(--ubasti-ink)" }}>
            We couldn&apos;t send your confirmation SMS, but your booking is confirmed. Screenshot this page!
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={icsUrl}
            className="inline-flex h-11 items-center justify-center px-6 rounded-full text-sm font-medium border"
            style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-ink)" }}
          >
            Add to Calendar
          </a>
          <Link
            href="/account"
            className="inline-flex h-11 items-center justify-center px-6 rounded-full text-sm font-medium"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
          >
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
