"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OtpInput }   from "@/components/auth/OtpInput";

type Tab      = "email" | "phone";
type EmailStep = "input" | "otp";
type PhoneStep = "phone" | "otp";

export function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const nextPath     = searchParams.get("next") ?? "/account";

  const [tab, setTab] = useState<Tab>("email");

  // Email OTP state
  const [emailStep,    setEmailStep]    = useState<EmailStep>("input");
  const [email,        setEmail]        = useState("");
  const [emailOtp,     setEmailOtp]     = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError,   setEmailError]   = useState("");
  const [emailResend,  setEmailResend]  = useState(0);

  // Phone OTP state
  const [phoneStep,    setPhoneStep]    = useState<PhoneStep>("phone");
  const [phone,        setPhone]        = useState("");
  const [phoneValid,   setPhoneValid]   = useState(false);
  const [phoneOtp,     setPhoneOtp]     = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError,   setPhoneError]   = useState("");
  const [phoneResend,  setPhoneResend]  = useState(0);

  useEffect(() => {
    if (emailResend <= 0) return;
    const t = setTimeout(() => setEmailResend((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [emailResend]);

  useEffect(() => {
    if (phoneResend <= 0) return;
    const t = setTimeout(() => setPhoneResend((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phoneResend]);

  async function handleSendEmailCode() {
    if (!email) return;
    setEmailLoading(true);
    setEmailError("");
    try {
      const res  = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send code");
      setEmailStep("otp");
      setEmailResend(30);
    } catch (e) {
      setEmailError(e instanceof Error ? e.message : "Failed to send code");
    } finally {
      setEmailLoading(false);
    }
  }

  async function handleVerifyEmail() {
    if (emailOtp.trim().length < 6) return;
    setEmailLoading(true);
    setEmailError("");
    try {
      const res  = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: emailOtp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");
      router.push(nextPath);
    } catch (e) {
      setEmailError(e instanceof Error ? e.message : "Verification failed");
      setEmailOtp("");
    } finally {
      setEmailLoading(false);
    }
  }

  async function handleSendPhoneCode() {
    if (!phoneValid) return;
    setPhoneLoading(true);
    setPhoneError("");
    try {
      const res  = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send code");
      setPhoneStep("otp");
      setPhoneResend(30);
    } catch (e) {
      setPhoneError(e instanceof Error ? e.message : "Failed to send code");
    } finally {
      setPhoneLoading(false);
    }
  }

  async function handleVerifyPhone() {
    if (phoneOtp.trim().length < 6) return;
    setPhoneLoading(true);
    setPhoneError("");
    try {
      const res  = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: phoneOtp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");
      router.push(nextPath);
    } catch (e) {
      setPhoneError(e instanceof Error ? e.message : "Verification failed");
      setPhoneOtp("");
    } finally {
      setPhoneLoading(false);
    }
  }

  const inputStyle = {
    background: "var(--ubasti-paper)",
    border: "1px solid var(--ubasti-blush-light)",
    color: "var(--ubasti-ink)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--ubasti-paper)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-sm flex flex-col gap-6"
        style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}
      >
        <div className="text-center">
          <p
            className="text-2xl tracking-widest uppercase"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}
          >
            Ubasti
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-full overflow-hidden" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
          {(["email", "phone"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 text-sm font-medium capitalize transition-colors"
              style={{
                background: tab === t ? "var(--ubasti-olive-dark)" : "transparent",
                color:      tab === t ? "var(--ubasti-cream)"      : "var(--ubasti-sage)",
              }}
            >
              {t === "email" ? "Email" : "Phone"}
            </button>
          ))}
        </div>

        {/* Email OTP tab */}
        {tab === "email" && (
          <>
            <p className="text-sm text-center" style={{ color: "var(--ubasti-sage)" }}>
              {emailStep === "input"
                ? "Enter your email to receive a login code"
                : `Enter the code sent to ${email}`}
            </p>

            {emailStep === "input" ? (
              <>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={emailLoading}
                  onKeyDown={(e) => e.key === "Enter" && handleSendEmailCode()}
                  className="h-11 w-full rounded-xl px-4 text-sm outline-none"
                  style={inputStyle}
                />
                {emailError && (
                  <p role="alert" className="text-sm text-center" style={{ color: "var(--ubasti-danger)" }}>
                    {emailError}
                  </p>
                )}
                <button
                  onClick={handleSendEmailCode}
                  disabled={!email || emailLoading}
                  className="h-12 w-full rounded-full font-medium text-sm transition-opacity disabled:opacity-50"
                  style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
                >
                  {emailLoading ? "Sending…" : "Send Code"}
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <OtpInput value={emailOtp} onChange={setEmailOtp} disabled={emailLoading} autoFocus />
                </div>
                {emailError && (
                  <p role="alert" aria-live="polite" className="text-sm text-center" style={{ color: "var(--ubasti-danger)" }}>
                    {emailError}
                  </p>
                )}
                <button
                  onClick={handleVerifyEmail}
                  disabled={emailOtp.trim().length < 6 || emailLoading}
                  className="h-12 w-full rounded-full font-medium text-sm transition-opacity disabled:opacity-50"
                  style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
                >
                  {emailLoading ? "Verifying…" : "Verify"}
                </button>
                <div className="flex justify-between text-sm">
                  <button
                    onClick={() => { setEmailStep("input"); setEmailError(""); setEmailOtp(""); }}
                    style={{ color: "var(--ubasti-sage)" }}
                  >
                    Change email
                  </button>
                  <button
                    onClick={() => { handleSendEmailCode(); setEmailResend(30); setEmailOtp(""); setEmailError(""); }}
                    disabled={emailResend > 0 || emailLoading}
                    style={{ color: emailResend > 0 ? "var(--ubasti-sage-light)" : "var(--ubasti-mustard)" }}
                  >
                    {emailResend > 0 ? `Resend in ${emailResend}s` : "Resend code"}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* Phone OTP tab */}
        {tab === "phone" && (
          <>
            <p className="text-sm text-center" style={{ color: "var(--ubasti-sage)" }}>
              {phoneStep === "phone" ? "Enter your phone number to continue" : "Enter the code we sent you"}
            </p>
            {phoneStep === "phone" ? (
              <>
                <PhoneInput
                  onChange={(e164, valid) => { setPhone(e164); setPhoneValid(valid); }}
                  disabled={phoneLoading}
                />
                {phoneError && (
                  <p role="alert" className="text-sm text-center" style={{ color: "var(--ubasti-danger)" }}>
                    {phoneError}
                  </p>
                )}
                <button
                  onClick={handleSendPhoneCode}
                  disabled={!phoneValid || phoneLoading}
                  className="h-12 w-full rounded-full font-medium text-sm transition-opacity disabled:opacity-50"
                  style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
                >
                  {phoneLoading ? "Sending…" : "Send Code"}
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <OtpInput value={phoneOtp} onChange={setPhoneOtp} disabled={phoneLoading} autoFocus />
                  <p className="text-xs text-center" style={{ color: "var(--ubasti-sage)" }}>
                    Sent to {phone}
                  </p>
                </div>
                {phoneError && (
                  <p role="alert" aria-live="polite" className="text-sm text-center" style={{ color: "var(--ubasti-danger)" }}>
                    {phoneError}
                  </p>
                )}
                <button
                  onClick={handleVerifyPhone}
                  disabled={phoneOtp.trim().length < 6 || phoneLoading}
                  className="h-12 w-full rounded-full font-medium text-sm transition-opacity disabled:opacity-50"
                  style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
                >
                  {phoneLoading ? "Verifying…" : "Verify"}
                </button>
                <div className="flex justify-between text-sm">
                  <button
                    onClick={() => { setPhoneStep("phone"); setPhoneError(""); setPhoneOtp(""); }}
                    style={{ color: "var(--ubasti-sage)" }}
                  >
                    Change number
                  </button>
                  <button
                    onClick={() => { handleSendPhoneCode(); setPhoneResend(30); setPhoneOtp(""); setPhoneError(""); }}
                    disabled={phoneResend > 0 || phoneLoading}
                    style={{ color: phoneResend > 0 ? "var(--ubasti-sage-light)" : "var(--ubasti-mustard)" }}
                  >
                    {phoneResend > 0 ? `Resend in ${phoneResend}s` : "Resend code"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
