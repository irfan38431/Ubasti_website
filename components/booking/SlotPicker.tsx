"use client";

import { cn } from "@/lib/utils";

export interface SlotOption {
  start:   string;  // ISO string (UTC)
  end:     string;
  label:   string;  // "11:00 AM"
  full:    boolean;
  blocked: boolean;
}

interface Props {
  slots:    SlotOption[];
  value:    string;         // selected slot start ISO
  onChange: (start: string, end: string) => void;
  loading?: boolean;
}

export function SlotPicker({ slots, value, onChange, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl" style={{ background: "var(--ubasti-cream)" }} />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: "var(--ubasti-sage)" }}>
        No available slots on this day. Please pick another date.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
        Choose a time
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {slots.map((slot) => {
          const unavailable = slot.full || slot.blocked;
          const selected    = slot.start === value;

          return (
            <button
              key={slot.start}
              onClick={() => !unavailable && onChange(slot.start, slot.end)}
              disabled={unavailable}
              title={slot.full ? "Fully booked" : slot.blocked ? "Not available" : undefined}
              className={cn(
                "h-12 rounded-xl text-sm font-medium border transition-all",
                selected
                  ? "bg-[var(--ubasti-olive-dark)] border-[var(--ubasti-olive-dark)] text-[var(--ubasti-cream)]"
                  : unavailable
                  ? "opacity-40 cursor-not-allowed border-[var(--ubasti-blush-light)]"
                  : "border-[var(--ubasti-blush-light)] hover:border-[var(--ubasti-sage)] text-[var(--ubasti-ink)]"
              )}
            >
              {slot.label}
              {slot.full && <span className="block text-[10px] opacity-60">Full</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
