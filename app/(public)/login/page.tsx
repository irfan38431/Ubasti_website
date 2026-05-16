"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OtpInput }   from "@/components/auth/OtpInput";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const nextPath     = searchParams.get("next") ?? "/account";

  const [step,       setStep]       = useState<Step>("phone");
  const [phone,      setPhone]      = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [otp,        setOtp]        = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [resendSecs, setResendSecs] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (resendSecs <= 0) return;
    const t = setTimeout(() => setResendSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSecs]);

  async function handleSendCode() {
    if (!phoneValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send code");
      setStep("otp");
      setResendSecs(30);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (otp.trim().length < 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");
      router.push(nextPath);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
      setOtp("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--ubasti-paper)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-sm flex flex-col gap-6"
        style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}
      >
        {/* Logo stub */}
        <div className="text-center">
          <p
            className="text-2xl tracking-widest uppercase"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}
          >
            Ubasti
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--ubasti-sage)" }}>
            {step === "phone" ? "Enter your phone number to continue" : "Enter the code we sent you"}
          </p>
        </div>

        {step === "phone" ? (
          <>
            <PhoneInput
              onChange={(e164, valid) => { setPhone(e164); setPhoneValid(valid); }}
              disabled={loading}
            />
            {error && (
              <p role="alert" className="text-sm text-center" style={{ color: "var(--ubasti-danger)" }}>
                {error}
              </p>
            )}
            <button
              onClick={handleSendCode}
              disabled={!phoneValid || loading}
              className="h-12 w-full rounded-full font-medium text-sm transition-opacity disabled:opacity-50"
              style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
            >
              {loading ? "Sending…" : "Send Code"}
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <OtpInput value={otp} onChange={setOtp} disabled={loading} autoFocus />
              <p className="text-xs text-center" style={{ color: "var(--ubasti-sage)" }}>
                Sent to {phone}
              </p>
            </div>

            {error && (
              <p role="alert" aria-live="polite" className="text-sm text-center" style={{ color: "var(--ubasti-danger)" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleVerify}
              disabled={otp.trim().length < 6 || loading}
              className="h-12 w-full rounded-full font-medium text-sm transition-opacity disabled:opacity-50"
              style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
            >
              {loading ? "Verifying…" : "Verify"}
            </button>

            <div className="flex justify-between text-sm">
              <button
                onClick={() => { setStep("phone"); setError(""); setOtp(""); }}
                style={{ color: "var(--ubasti-sage)" }}
              >
                Change number
              </button>
              <button
                onClick={() => { handleSendCode(); setResendSecs(30); setOtp(""); setError(""); }}
                disabled={resendSecs > 0 || loading}
                style={{ color: resendSecs > 0 ? "var(--ubasti-sage-light)" : "var(--ubasti-mustard)" }}
              >
                {resendSecs > 0 ? `Resend in ${resendSecs}s` : "Resend code"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
