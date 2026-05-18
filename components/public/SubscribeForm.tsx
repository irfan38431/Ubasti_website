"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res  = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus("success");
      setMessage(data.message ?? "Subscribed!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return <p className="text-sm opacity-70" style={{ color: "var(--ubasti-cream)" }}>{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 w-full max-w-xs">
      <p className="text-xs opacity-60 uppercase tracking-widest" style={{ color: "var(--ubasti-cream)" }}>Stay in the loop</p>
      <div className="flex w-full rounded-full overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.25)" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:opacity-40"
          style={{ color: "var(--ubasti-cream)" }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 text-xs font-medium shrink-0 disabled:opacity-50"
          style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && <p className="text-xs opacity-70" style={{ color: "var(--ubasti-blush)" }}>{message}</p>}
    </form>
  );
}
