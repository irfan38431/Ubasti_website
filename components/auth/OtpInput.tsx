"use client";

import { useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from "react";

interface Props {
  value: string;           // 6-char string
  onChange: (v: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({ value, onChange, disabled, autoFocus }: Props) {
  const digits = (value + "      ").slice(0, 6).split("");
  const refs   = useRef<(HTMLInputElement | null)[]>([]);

  // Web OTP API — auto-fill on supporting browsers
  useEffect(() => {
    if (!("OTPCredential" in window)) return;
    const ac = new AbortController();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator.credentials as any)
      .get({ otp: { transport: ["sms"] }, signal: ac.signal })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((otp: any) => {
        if (otp?.code) onChange(otp.code.slice(0, 6));
      })
      .catch(() => {});
    return () => ac.abort();
    // onChange is stable in practice (passed from useState setter) — exhaustive-deps false positive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function focus(idx: number) {
    refs.current[idx]?.focus();
  }

  function set(idx: number, char: string) {
    const arr = digits.slice();
    arr[idx] = char || " ";
    onChange(arr.join("").trimEnd());
  }

  function handleKey(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[idx].trim()) {
        set(idx, " ");
      } else {
        focus(idx - 1);
        set(idx - 1, " ");
      }
      return;
    }
    if (e.key === "ArrowLeft")  { focus(idx - 1); return; }
    if (e.key === "ArrowRight") { focus(idx + 1); return; }
    if (/^\d$/.test(e.key)) {
      set(idx, e.key);
      focus(idx + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text) {
      onChange(text.padEnd(6, " ").slice(0, 6).trimEnd());
      focus(Math.min(text.length, 5));
    }
    e.preventDefault();
  }

  return (
    <div role="group" aria-label="One-time password" className="flex gap-3 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          autoFocus={autoFocus && i === 0}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of 6`}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onChange={() => {}} // controlled via onKeyDown
          className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
          style={{
            borderColor: d.trim() ? "var(--ubasti-olive-dark)" : "var(--ubasti-sage-light)",
            background:  "var(--ubasti-paper)",
            color:       "var(--ubasti-ink)",
          }}
        />
      ))}
    </div>
  );
}
