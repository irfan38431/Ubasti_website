"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth";

interface TeamMember {
  id:          string;
  phoneE164:   string;
  displayName: string | null;
  isRootAdmin: boolean;
  lastLoginAt: string | null;
  createdAt:   string;
}

export default function AdminTeam() {
  const { user }  = useAuth();
  const [team,    setTeam]    = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite form
  const [phone, setPhone]   = useState("");
  const [name,  setName]    = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  // Transfer form
  const [transferId,    setTransferId]    = useState("");
  const [transferOtp,   setTransferOtp]   = useState("");
  const [transferring,  setTransferring]  = useState(false);
  const [transferError, setTransferError] = useState("");
  const [transferDone,  setTransferDone]  = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res  = await fetch("/api/admin/team");
        const data = await res.json();
        if (!cancelled) setTeam(data.team ?? []);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setInviting(true);
    setInviteError("");
    try {
      const res  = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), displayName: name.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setPhone("");
      setName("");
      // Reload
      const res2  = await fetch("/api/admin/team");
      const data2 = await res2.json();
      setTeam(data2.team ?? []);
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Remove this admin? They will lose admin access immediately.")) return;
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    setTeam((t) => t.filter((m) => m.id !== id));
  }

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    setTransferring(true);
    setTransferError("");
    try {
      const res  = await fetch("/api/admin/team/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRootId: transferId, otpCode: transferOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Transfer failed");
      setTransferDone(true);
    } catch (err) {
      setTransferError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setTransferring(false);
    }
  }

  const isRoot = team.find((m) => m.id === user?.id)?.isRootAdmin ?? false;
  const field  = "rounded-xl border px-3 py-2 text-sm outline-none";
  const fs     = { borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>Team</h1>

      {/* Team table */}
      {loading ? (
        <div className="h-32 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-blush-light)" }} />
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                {["Name", "Phone", "Role", "Last Login", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {team.map((m, i) => (
                <tr key={m.id} style={{ background: i % 2 === 0 ? "var(--ubasti-white)" : "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--ubasti-ink)" }}>
                    {m.displayName ?? "—"} {m.id === user?.id ? <span className="text-xs" style={{ color: "var(--ubasti-sage)" }}>(you)</span> : null}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--ubasti-sage)" }}>{m.phoneE164}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                      style={{ background: m.isRootAdmin ? "var(--ubasti-mustard)" : "var(--ubasti-blush-light)", color: m.isRootAdmin ? "var(--ubasti-ink)" : "var(--ubasti-sage)" }}>
                      {m.isRootAdmin ? "Root Admin" : "Admin"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--ubasti-sage)" }}>
                    {m.lastLoginAt ? new Date(m.lastLoginAt).toLocaleDateString("en-IN") : "Never"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!m.isRootAdmin && m.id !== user?.id && (
                      <button onClick={() => handleRemove(m.id)}
                        className="text-xs border px-3 py-1 rounded-full"
                        style={{ borderColor: "var(--ubasti-danger)", color: "var(--ubasti-danger)" }}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite form */}
      <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}>
        <h2 className="text-lg font-semibold" style={{ color: "var(--ubasti-ink)" }}>Invite Admin</h2>
        <form onSubmit={handleInvite} className="flex gap-3 flex-wrap">
          <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)}
            required className={field} style={{ ...fs, minWidth: 160 }} />
          <input type="text" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)}
            className={field} style={{ ...fs, minWidth: 160 }} />
          <button type="submit" disabled={inviting}
            className="h-10 px-5 rounded-full text-sm font-medium"
            style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
            {inviting ? "Inviting…" : "Invite"}
          </button>
        </form>
        {inviteError && <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{inviteError}</p>}
        <p className="text-xs" style={{ color: "var(--ubasti-sage)" }}>
          The invited person gains admin access on their next login. They must already have or create an account via OTP.
        </p>
      </div>

      {/* Root admin transfer — only shown to root admin */}
      {isRoot && (
        <div className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: "var(--ubasti-cream)", border: "1px solid var(--ubasti-mustard)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--ubasti-ink)" }}>Transfer Root Admin Status</h2>
          <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>
            Transferring root status is permanent and requires OTP verification. You will lose root access immediately.
          </p>
          {transferDone ? (
            <p className="text-sm font-medium" style={{ color: "var(--ubasti-success)" }}>Root admin transferred successfully. Please refresh the page.</p>
          ) : (
            <form onSubmit={handleTransfer} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Transfer to (select admin)</label>
                <select value={transferId} onChange={(e) => setTransferId(e.target.value)} required className={field} style={fs}>
                  <option value="">— Choose admin —</option>
                  {team.filter((m) => !m.isRootAdmin).map((m) => (
                    <option key={m.id} value={m.id}>{m.displayName ?? m.phoneE164}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Your OTP (request via login page)</label>
                <input type="text" placeholder="123456" maxLength={6} value={transferOtp} onChange={(e) => setTransferOtp(e.target.value.replace(/\D/g, ""))}
                  required className={field} style={{ ...fs, letterSpacing: "0.2em", fontFamily: "var(--font-jetbrains)" }} />
              </div>
              {transferError && <p className="text-sm" style={{ color: "var(--ubasti-danger)" }}>{transferError}</p>}
              <button type="submit" disabled={transferring || !transferId || transferOtp.length !== 6}
                className="h-10 px-5 rounded-full text-sm font-medium self-start"
                style={{ background: "var(--ubasti-danger)", color: "white" }}>
                {transferring ? "Transferring…" : "Confirm Transfer"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
