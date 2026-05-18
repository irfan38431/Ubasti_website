"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Clock, X, RefreshCw } from "lucide-react";

type Status = "pending" | "confirmed" | "completed" | "cancelled";

interface Booking {
  id: string;
  stayType: "lounge" | "enclosure";
  foodOption: "ubasti" | "own";
  checkIn: string;
  checkOut: string;
  petName: string;
  petBreed: string | null;
  petNotes: string | null;
  status: Status;
  adminNotes: string | null;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
}

const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  pending:   { bg: "var(--ubasti-cream)", text: "var(--ubasti-mustard)"    },
  confirmed: { bg: "#EAF0E4",             text: "var(--ubasti-olive-dark)" },
  completed: { bg: "#E4EAF0",             text: "var(--ubasti-info)"       },
  cancelled: { bg: "#F9EDED",             text: "var(--ubasti-danger)"     },
};

const STAY_LABELS = { lounge: "Lounge", enclosure: "Enclosure" };
const FOOD_LABELS = { ubasti: "Ubasti food", own: "Own food" };

const PRICING: Record<"lounge" | "enclosure", Record<"ubasti" | "own", number>> = {
  lounge:    { ubasti: 1000, own: 900 },
  enclosure: { ubasti: 800,  own: 700 },
};

function nightsBetween(checkIn: string, checkOut: string) {
  return Math.round((new Date(checkOut + "T00:00:00").getTime() - new Date(checkIn + "T00:00:00").getTime()) / 86_400_000);
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatCreatedAt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function BoardingBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/boarding-bookings");
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function updateStatus(id: string, status: Status) {
    setUpdating(id);
    try {
      await fetch("/api/admin/boarding-bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    } finally {
      setUpdating(null);
    }
  }

  const th = "px-4 py-3 text-left text-xs font-bold uppercase tracking-wider";
  const td = "px-4 py-3 text-sm align-top";

  return (
    <div className="p-6 md:p-8" style={{ color: "var(--ubasti-ink)" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-cormorant)" }}>
            Boarding Bookings
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--ubasti-sage)" }}>
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-lg hover:bg-[var(--ubasti-cream)] transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} style={{ color: "var(--ubasti-sage)" }} />
        </button>
      </div>

      {loading ? (
        <div className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--ubasti-cream)" }} />
      ) : bookings.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--ubasti-sage)" }}>
          No boarding bookings yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid var(--ubasti-blush-light)" }}>
          <table className="w-full text-sm" style={{ background: "var(--ubasti-white)" }}>
            <thead style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
              <tr>
                {["Booked", "Customer", "Check-in", "Check-out", "Nights", "Stay", "Cat", "Status", "Actions"].map((h) => (
                  <th key={h} className={th} style={{ color: "var(--ubasti-sage)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => {
                const colors = STATUS_COLORS[b.status];
                const nights = nightsBetween(b.checkIn, b.checkOut);
                const price  = PRICING[b.stayType][b.foodOption];
                return (
                  <tr
                    key={b.id}
                    style={{ borderTop: i > 0 ? "1px solid var(--ubasti-blush-light)" : undefined }}
                  >
                    <td className={td} style={{ color: "var(--ubasti-sage)", whiteSpace: "nowrap" }}>
                      {formatCreatedAt(b.createdAt)}
                    </td>
                    <td className={td}>
                      <p className="font-medium">{b.userName ?? "—"}</p>
                      <p className="text-xs" style={{ color: "var(--ubasti-sage)" }}>{b.userEmail ?? b.userPhone ?? ""}</p>
                    </td>
                    <td className={td} style={{ whiteSpace: "nowrap" }}>{formatDate(b.checkIn)}</td>
                    <td className={td} style={{ whiteSpace: "nowrap" }}>{formatDate(b.checkOut)}</td>
                    <td className={td}>
                      <p>{nights}n</p>
                      <p className="text-xs" style={{ color: "var(--ubasti-sage)" }}>
                        ₹{(nights * price).toLocaleString("en-IN")}
                      </p>
                    </td>
                    <td className={td}>
                      <p>{STAY_LABELS[b.stayType]}</p>
                      <p className="text-xs" style={{ color: "var(--ubasti-sage)" }}>{FOOD_LABELS[b.foodOption]}</p>
                    </td>
                    <td className={td}>
                      <p className="font-medium">{b.petName}</p>
                      {b.petBreed && <p className="text-xs" style={{ color: "var(--ubasti-sage)" }}>{b.petBreed}</p>}
                      {b.petNotes && <p className="text-xs mt-1 italic" style={{ color: "var(--ubasti-sage)" }}>{b.petNotes}</p>}
                    </td>
                    <td className={td}>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                        style={{ background: colors.bg, color: colors.text }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className={td}>
                      {b.status !== "completed" && b.status !== "cancelled" && (
                        <div className="flex gap-1 flex-wrap">
                          {b.status === "pending" && (
                            <button
                              onClick={() => updateStatus(b.id, "confirmed")}
                              disabled={updating === b.id}
                              title="Confirm"
                              className="p-1.5 rounded-lg hover:bg-[var(--ubasti-cream)] transition-colors"
                            >
                              <CheckCircle size={14} style={{ color: "var(--ubasti-olive-dark)" }} />
                            </button>
                          )}
                          {b.status === "confirmed" && (
                            <button
                              onClick={() => updateStatus(b.id, "completed")}
                              disabled={updating === b.id}
                              title="Mark completed"
                              className="p-1.5 rounded-lg hover:bg-[var(--ubasti-cream)] transition-colors"
                            >
                              <Clock size={14} style={{ color: "var(--ubasti-info)" }} />
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(b.id, "cancelled")}
                            disabled={updating === b.id}
                            title="Cancel"
                            className="p-1.5 rounded-lg hover:bg-[var(--ubasti-cream)] transition-colors"
                          >
                            <X size={14} style={{ color: "var(--ubasti-danger)" }} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
