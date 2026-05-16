"use client";

import { useState } from "react";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

const OCCASIONS = ["Birthday", "Anniversary", "Bachelorette", "Corporate", "Other"];

export function InquiryForm() {
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", requestedDate: "",
    partySize: 2, occasion: "Birthday", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  function set(key: string, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPhoneNumber(form.phone)) {
      setError("Please enter a valid phone number with country code (e.g. +91 98765 43210)");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const phoneE164 = parsePhoneNumber(form.phone).format("E.164");
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: phoneE164 }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "h-12 rounded-xl border px-4 text-sm outline-none transition-all w-full";
  const inputStyle = { borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" };
  const labelClass = "text-sm font-medium";
  const labelStyle = { color: "var(--ubasti-ink)" };

  if (done) {
    return (
      <div id="inquiry" className="rounded-2xl p-10 text-center" style={{ background: "var(--ubasti-cream)" }}>
        <p className="text-3xl mb-2" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-olive-dark)", fontWeight: 600 }}>
          Thanks! We&apos;ll be in touch within 24 hours. 🐱
        </p>
        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
          We reply via WhatsApp/SMS to the number you provided.
        </p>
      </div>
    );
  }

  return (
    <form id="inquiry" onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} style={labelStyle}>Full name *</label>
          <input required type="text" value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
            className={inputClass} style={inputStyle} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} style={labelStyle}>Phone (with country code) *</label>
          <input required type="tel" value={form.phone} placeholder="+91 98765 43210"
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} style={labelStyle}>Email <span className="opacity-50">(optional)</span></label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
            className={inputClass} style={inputStyle} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} style={labelStyle}>Preferred date *</label>
          <input required type="date" value={form.requestedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => set("requestedDate", e.target.value)}
            className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} style={labelStyle}>Party size *</label>
          <input required type="number" min={2} max={12} value={form.partySize}
            onChange={(e) => set("partySize", Number(e.target.value))}
            className={inputClass} style={inputStyle} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} style={labelStyle}>Occasion *</label>
          <select required value={form.occasion} onChange={(e) => set("occasion", e.target.value)}
            className={inputClass} style={inputStyle}>
            {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} style={labelStyle}>Message <span className="opacity-50">(optional)</span></label>
        <textarea rows={3} value={form.message} onChange={(e) => set("message", e.target.value)}
          placeholder="Any special requirements, dietary needs, or notes for us…"
          className="rounded-xl border px-4 py-3 text-sm resize-none outline-none"
          style={inputStyle} />
      </div>

      {error && <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{error}</p>}

      <button type="submit" disabled={loading}
        className="h-13 rounded-full font-medium text-sm transition-opacity disabled:opacity-50 py-3"
        style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
        {loading ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
