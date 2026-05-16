"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

interface Props {
  id:          string;
  slotStart:   string;
  partySize:   number;
  status:      string;
  notes?:      string | null;
  onCancelled: () => void;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

const statusColor = (s: string): "green" | "yellow" | "red" | "blue" | "gray" =>
  s === "confirmed" ? "green" : s === "cancelled" ? "red" : s === "completed" ? "blue" : "gray";

export function BookingCard({ id, slotStart, partySize, status, notes, onCancelled }: Props) {
  const { toast } = useToast();
  const [confirm,  setConfirm]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [nowMs]                 = useState(() => Date.now());

  const canCancel =
    status === "confirmed" &&
    new Date(slotStart).getTime() - nowMs > 24 * 60 * 60 * 1000;

  async function handleCancel() {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast("Booking cancelled.", "info");
      onCancelled();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to cancel", "error");
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  }

  return (
    <>
      <div
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-base" style={{ color: "var(--ubasti-ink)" }}>
              {fmt(slotStart)}
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--ubasti-sage)" }}>
              {partySize} guest{partySize > 1 ? "s" : ""} · Ubasti Cat Cafe, Chennai
            </p>
            {notes && <p className="text-xs mt-1 italic" style={{ color: "var(--ubasti-sage)" }}>&ldquo;{notes}&rdquo;</p>}
          </div>
          <StatusBadge
            label={status === "no-show" ? "No Show" : status.charAt(0).toUpperCase() + status.slice(1)}
            color={statusColor(status)}
          />
        </div>

        <div className="flex gap-3">
          <a
            href={`/api/appointments/${id}/ics`}
            className="text-xs underline underline-offset-2"
            style={{ color: "var(--ubasti-sage)" }}
          >
            Add to calendar
          </a>
          {canCancel && (
            <button
              onClick={() => setConfirm(true)}
              className="text-xs underline underline-offset-2"
              style={{ color: "var(--ubasti-danger)" }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={handleCancel}
        title="Cancel booking?"
        message="This session will be cancelled. You can book again anytime."
        confirmLabel="Yes, cancel"
        danger
        loading={loading}
      />
    </>
  );
}
