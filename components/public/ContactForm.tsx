"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ContactForm() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Something went wrong");
      setDone(true);
    } catch {
      setError("Couldn't send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="py-16 md:py-24"
      style={{ background: "var(--ubasti-cream)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="max-w-xl mx-auto flex flex-col gap-6">
            <h2
              className="text-4xl md:text-5xl text-center"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
            >
              Connect with US
            </h2>

            {/* Instagram handle */}
            <a
              href="https://instagram.com/ubasti.cafe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center block transition-opacity hover:opacity-70"
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: "2rem",
                fontStyle: "italic",
                color: "var(--ubasti-olive-dark)",
                letterSpacing: "0.02em",
              }}
            >
              @ubasti.cafe
            </a>

            {done ? (
              <div className="rounded-2xl p-8 text-center mt-2" style={{ background: "var(--ubasti-white)" }}>
                <p className="text-2xl mb-2" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-olive-dark)", fontWeight: 600 }}>
                  Thanks, we&apos;ll be in touch!
                </p>
                <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
                  Expect a reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
                      Your name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 rounded-xl border px-4 text-sm outline-none transition-all"
                      style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
                      Email <span className="opacity-50">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border px-4 text-sm outline-none transition-all"
                      style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: "var(--ubasti-ink)" }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="rounded-xl border px-4 py-3 text-sm outline-none transition-all resize-none"
                    style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
                  />
                </div>
                {error && <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 rounded-full font-medium text-sm transition-opacity disabled:opacity-50 mt-2"
                  style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
                >
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
