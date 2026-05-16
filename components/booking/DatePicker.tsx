"use client";

import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  dates: string[];        // YYYY-MM-DD strings
  value: string;          // selected date
  onChange: (d: string) => void;
  disabled?: boolean;
}

export function DatePicker({ dates, value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
        Choose a date
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {dates.map((d) => {
          const date    = parseISO(d);
          const dayName = format(date, "EEE");
          const dayNum  = format(date, "d");
          const month   = format(date, "MMM");
          const selected = d === value;

          return (
            <button
              key={d}
              onClick={() => onChange(d)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center py-3 px-2 rounded-xl text-sm transition-all border",
                selected
                  ? "border-[var(--ubasti-olive-dark)] bg-[var(--ubasti-olive-dark)]"
                  : "border-[var(--ubasti-blush-light)] hover:border-[var(--ubasti-sage)]"
              )}
            >
              <span
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: selected ? "var(--ubasti-sage-light)" : "var(--ubasti-sage)" }}
              >
                {dayName}
              </span>
              <span
                className="text-xl font-bold leading-none mt-1"
                style={{ color: selected ? "var(--ubasti-cream)" : "var(--ubasti-ink)" }}
              >
                {dayNum}
              </span>
              <span
                className="text-xs mt-0.5"
                style={{ color: selected ? "var(--ubasti-sage-light)" : "var(--ubasti-sage)" }}
              >
                {month}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
