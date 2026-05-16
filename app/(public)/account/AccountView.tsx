"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth";
import { BookingCard } from "@/components/account/BookingCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Appointment {
  id: string; slotStart: string; slotEnd: string; // slotEnd kept for display if needed
  partySize: number; status: string; notes?: string | null;
}

export function AccountView() {
  const router           = useRouter();
  const { user, isLoading, refetch } = useAuth();
  const [bookings,      setBookings]      = useState<Appointment[]>([]);
  const [bLoading,      setBLoading]      = useState(true);
  const [nameModal,     setNameModal]     = useState(false);
  const [newName,       setNewName]       = useState("");
  const [savingName,    setSavingName]    = useState(false);
  const [showPast,      setShowPast]      = useState(false);

  const loadBookings = useCallback(async () => {
    setBLoading(true);
    try {
      const res  = await fetch("/api/appointments");
      const data = await res.json();
      setBookings(data.appointments ?? []);
    } catch {}
    finally { setBLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (user) { void loadBookings(); } }, [user, loadBookings]);

  if (isLoading) return null;
  if (!user) {
    router.push("/login?next=/account");
    return null;
  }

  const now      = new Date();
  const upcoming = bookings.filter((b) => b.status === "confirmed" && new Date(b.slotStart) >= now);
  const past     = bookings.filter((b) => b.status !== "confirmed" || new Date(b.slotStart) < now);

  async function saveName() {
    if (!newName.trim()) return;
    setSavingName(true);
    try {
      await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: newName.trim() }),
      });
      refetch();
      setNameModal(false);
    } finally { setSavingName(false); }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
          >
            Hi, {user.displayName ?? "friend"} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--ubasti-sage)" }}>
            {user.phoneE164}
          </p>
        </div>
        <button
          onClick={() => { setNewName(user.displayName ?? ""); setNameModal(true); }}
          className="text-sm underline underline-offset-2 shrink-0 mt-2"
          style={{ color: "var(--ubasti-mustard)" }}
        >
          Edit name
        </button>
      </div>

      {/* Upcoming bookings */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>
            Upcoming Sessions
          </h2>
          <Link
            href="/book"
            className="text-sm font-medium"
            style={{ color: "var(--ubasti-olive-dark)" }}
          >
            + Book new
          </Link>
        </div>

        {bLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-cream)" }} />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--ubasti-cream)" }}>
            <p className="text-sm mb-4" style={{ color: "var(--ubasti-sage)" }}>No upcoming bookings.</p>
            <Link
              href="/book"
              className="inline-flex h-10 items-center px-6 rounded-full text-sm font-medium"
              style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
            >
              Book a Session
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <BookingCard key={b.id} {...b} onCancelled={loadBookings} />
            ))}
          </div>
        )}
      </section>

      {/* Past bookings */}
      {past.length > 0 && (
        <section>
          <button
            onClick={() => setShowPast((v) => !v)}
            className="text-sm font-medium mb-4 flex items-center gap-2"
            style={{ color: "var(--ubasti-sage)" }}
          >
            Past bookings ({past.length})
            <span>{showPast ? "↑" : "↓"}</span>
          </button>
          {showPast && (
            <div className="space-y-3 opacity-60">
              {past.map((b) => (
                <BookingCard key={b.id} {...b} onCancelled={loadBookings} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Settings */}
      <section className="mt-10 pt-6" style={{ borderTop: "1px solid var(--ubasti-blush-light)" }}>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            refetch();
            router.push("/");
          }}
          className="text-sm"
          style={{ color: "var(--ubasti-danger)" }}
        >
          Log out
        </button>
      </section>

      {/* Edit name modal */}
      <Modal open={nameModal} onClose={() => setNameModal(false)} title="Update your name" size="sm">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Your name"
            className="h-12 rounded-xl border px-4 text-sm outline-none"
            style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
            onKeyDown={(e) => { if (e.key === "Enter") saveName(); }}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setNameModal(false)}>Cancel</Button>
            <Button size="sm" onClick={saveName} loading={savingName} disabled={!newName.trim()}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
