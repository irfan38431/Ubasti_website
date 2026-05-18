"use client";

import { useEffect, useState } from "react";

interface Subscriber {
  id:           string;
  email:        string;
  name:         string | null;
  status:       string;
  subscribedAt: string;
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [subject,     setSubject]     = useState("");
  const [body,        setBody]        = useState("");
  const [sending,     setSending]     = useState(false);
  const [sendResult,  setSendResult]  = useState<{ sent: number; failed: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((r) => r.json())
      .then((d) => setSubscribers(d.subscribers ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleUnsubscribe(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    await fetch("/api/admin/subscribers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setSubscribers((s) => s.filter((x) => x.id !== id));
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setSendResult(null);
    const res  = await fetch("/api/admin/subscribers/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, body }) });
    const data = await res.json();
    setSendResult(data);
    setSending(false);
    if (res.ok) { setSubject(""); setBody(""); }
  }

  const active = subscribers.filter((s) => s.status === "active");
  const field = { background: "var(--ubasti-paper)", border: "1px solid var(--ubasti-blush-light)", color: "var(--ubasti-ink)", borderRadius: "0.75rem", padding: "0.5rem 0.75rem", width: "100%", fontSize: "0.875rem" } as const;
  const label = { fontSize: "0.75rem", fontWeight: 600 as const, color: "var(--ubasti-sage)", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.25rem", display: "block" };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          Subscribers
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: "var(--ubasti-sage)" }}>{active.length} active</span>
          <button
            onClick={() => setShowModal(true)}
            className="h-9 px-5 rounded-full text-sm font-medium"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
          >
            Send Newsletter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
      ) : subscribers.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>No subscribers yet.</p>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                {["Email", "Name", "Status", "Subscribed", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={s.id} style={{ background: i % 2 === 0 ? "var(--ubasti-white)" : "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                  <td className="px-4 py-2.5 text-xs" style={{ color: "var(--ubasti-ink)" }}>{s.email}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: "var(--ubasti-sage)" }}>{s.name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                      background: s.status === "active" ? "var(--ubasti-sage-light)" : "var(--ubasti-blush-light)",
                      color: s.status === "active" ? "var(--ubasti-olive-dark)" : "var(--ubasti-sage)",
                    }}>{s.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: "var(--ubasti-sage)" }}>
                    {new Date(s.subscribedAt).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {s.status === "active" && (
                      <button onClick={() => handleUnsubscribe(s.id)} className="text-xs" style={{ color: "var(--ubasti-danger)" }}>Remove</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Newsletter Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col gap-5 p-6" style={{ background: "var(--ubasti-white)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}>
                Send Newsletter
              </h2>
              <button onClick={() => { setShowModal(false); setSendResult(null); }} className="text-2xl leading-none" style={{ color: "var(--ubasti-sage)" }}>×</button>
            </div>
            <div className="flex flex-col gap-1">
              <span style={label}>Subject</span>
              <input style={field} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. New cats available for adoption!" />
            </div>
            <div className="flex flex-col gap-1">
              <span style={label}>Message</span>
              <textarea style={{ ...field, minHeight: 160, resize: "vertical" }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message here…" />
            </div>
            {sendResult && (
              <p className="text-sm" style={{ color: sendResult.failed === 0 ? "var(--ubasti-olive-dark)" : "var(--ubasti-danger)" }}>
                Sent to {sendResult.sent} subscriber{sendResult.sent !== 1 ? "s" : ""}{sendResult.failed > 0 ? `, ${sendResult.failed} failed` : ""}.
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowModal(false); setSendResult(null); }} className="h-9 px-5 rounded-full text-sm border" style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-sage)" }}>
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !subject.trim() || !body.trim()}
                className="h-9 px-5 rounded-full text-sm font-medium disabled:opacity-50"
                style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
              >
                {sending ? `Sending to ${active.length}…` : `Send to ${active.length} subscriber${active.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
