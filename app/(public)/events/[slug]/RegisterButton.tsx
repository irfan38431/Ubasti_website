"use client";

import { useState } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Props {
  eventSlug: string;
  isFull:    boolean;
  isFree:    boolean;
  priceInr?: number | null;
}

export function RegisterButton({ eventSlug, isFull, isFree, priceInr }: Props) {
  const { user } = useAuth();
  const [open,       setOpen]       = useState(false);
  const [partySize,  setPartySize]  = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [registered, setRegistered] = useState(false);

  if (isFull) {
    return (
      <div className="rounded-2xl p-5 text-center"
        style={{ background: "var(--ubasti-cream)", border: "1px solid var(--ubasti-blush-light)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--ubasti-danger)" }}>
          This event is fully booked.
        </p>
      </div>
    );
  }

  if (registered) {
    return (
      <div className="rounded-2xl p-5 text-center"
        style={{ background: "var(--ubasti-cream)", border: "1px solid var(--ubasti-blush-light)" }}>
        <p className="text-lg mb-1" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-olive-dark)", fontWeight: 600 }}>
          You&apos;re registered! 🐱
        </p>
        <p className="text-xs" style={{ color: "var(--ubasti-sage)" }}>
          Check your SMS for confirmation details.
        </p>
      </div>
    );
  }

  async function handleRegister() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/events/${eventSlug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partySize }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed");
      setRegistered(true);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!user ? (
        <Link
          href={`/login?next=/events/${eventSlug}`}
          className="flex h-14 items-center justify-center rounded-full font-medium text-base transition-opacity hover:opacity-90"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
        >
          Log in to Register
        </Link>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-full items-center justify-center rounded-full font-medium text-base transition-opacity hover:opacity-90"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
        >
          Register{isFree ? " — Free" : priceInr ? ` — ₹${priceInr}` : ""}
        </button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Register for this event" size="sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
              How many people in your party?
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
          {!isFree && priceInr && (
            <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
              Total: ₹{priceInr * partySize} · Payment on arrival
            </p>
          )}
          {error && <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleRegister} loading={loading}>Confirm Registration</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
