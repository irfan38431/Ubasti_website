"use client";

import { useState } from "react";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

interface Props {
  onChange: (e164: string, isValid: boolean) => void;
  disabled?: boolean;
}

const COUNTRIES = [
  { code: "+91",  flag: "🇮🇳", label: "India" },
  { code: "+1",   flag: "🇺🇸", label: "USA" },
  { code: "+44",  flag: "🇬🇧", label: "UK" },
  { code: "+61",  flag: "🇦🇺", label: "Australia" },
  { code: "+65",  flag: "🇸🇬", label: "Singapore" },
  { code: "+971", flag: "🇦🇪", label: "UAE" },
];

export function PhoneInput({ onChange, disabled }: Props) {
  const [prefix, setPrefix] = useState("+91");
  const [local, setLocal]   = useState("");
  const [error, setError]   = useState("");

  function handleChange(rawLocal: string) {
    setLocal(rawLocal);
    const full = `${prefix}${rawLocal.replace(/\s/g, "")}`;
    try {
      if (rawLocal.length > 3 && isValidPhoneNumber(full)) {
        const e164 = parsePhoneNumber(full).format("E.164");
        setError("");
        onChange(e164, true);
      } else {
        onChange(full, false);
        setError("");
      }
    } catch {
      setError("Invalid number");
      onChange(full, false);
    }
  }

  function handleBlur() {
    const full = `${prefix}${local.replace(/\s/g, "")}`;
    if (local && !isValidPhoneNumber(full)) {
      setError("Enter a valid phone number");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
        Phone number
      </label>
      <div className="flex gap-2">
        <select
          value={prefix}
          onChange={(e) => { setPrefix(e.target.value); handleChange(local); }}
          disabled={disabled}
          aria-label="Country code"
          className="h-12 rounded-lg border px-3 text-sm"
          style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)" }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>

        <input
          type="tel"
          inputMode="numeric"
          value={local}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="98765 43210"
          aria-label="Phone number"
          aria-invalid={!!error}
          aria-describedby={error ? "phone-error" : undefined}
          className="flex-1 h-12 rounded-lg border px-4 text-base outline-none transition-all"
          style={{
            borderColor: error ? "var(--ubasti-danger)" : "var(--ubasti-sage-light)",
            background: "var(--ubasti-paper)",
            color: "var(--ubasti-ink)",
          }}
        />
      </div>
      {error && (
        <p id="phone-error" role="alert" className="text-sm" style={{ color: "var(--ubasti-danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
