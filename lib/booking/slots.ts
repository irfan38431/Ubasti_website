import { toZonedTime, fromZonedTime, format } from "date-fns-tz";
import { db } from "@/lib/db/client";
import { appointments, slotBlocks, loungeSettings } from "@/lib/db/schema";
import { and, eq, gte, lt, count } from "drizzle-orm";

const TZ = "Asia/Kolkata";

export interface Slot {
  start: Date;       // UTC
  end:   Date;       // UTC
  label: string;     // "11:00 AM"
  full:  boolean;
  blocked: boolean;
}

// Default settings when DB is unavailable
const DEFAULT_SETTINGS = {
  openHour:        11,
  closeHour:       19,
  slotDurationMin: 60,
  maxConcurrent:   3,
  closedDays:      [2] as number[],
};

async function getSettings() {
  try {
    const [row] = await db.select().from(loungeSettings).limit(1);
    if (!row) return DEFAULT_SETTINGS;
    return {
      openHour:        row.openHour,
      closeHour:       row.closeHour,
      slotDurationMin: row.slotDurationMin,
      maxConcurrent:   row.maxConcurrent,
      closedDays:      (row.closedDays as number[]) ?? [2],
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Returns all slots for a given calendar date (YYYY-MM-DD in IST).
 * Each slot includes booking count so the UI can show full/available.
 */
export async function getSlotsForDate(dateStr: string): Promise<Slot[]> {
  const settings = await getSettings();
  const { openHour, closeHour, slotDurationMin, maxConcurrent, closedDays } = settings;

  // Parse date in IST
  const [year, month, day] = dateStr.split("-").map(Number);
  const localMidnight = new Date(year, month - 1, day);
  const dayOfWeek = localMidnight.getDay();

  if (closedDays.includes(dayOfWeek)) return [];

  const slots: Slot[] = [];
  let hour = openHour;

  while (hour + slotDurationMin / 60 <= closeHour) {
    // Build slot start/end in IST, convert to UTC
    const slotStart = fromZonedTime(
      new Date(year, month - 1, day, hour, 0, 0),
      TZ
    );
    const slotEnd = new Date(slotStart.getTime() + slotDurationMin * 60_000);

    // Skip past slots
    if (slotEnd <= new Date()) {
      hour += slotDurationMin / 60;
      continue;
    }

    // Count confirmed bookings for this exact slot
    let bookingCount = 0;
    let isBlocked = false;
    try {
      const [{ value }] = await db
        .select({ value: count() })
        .from(appointments)
        .where(
          and(
            eq(appointments.slotStart, slotStart),
            eq(appointments.status, "confirmed")
          )
        );
      bookingCount = Number(value);

      // Check admin-blocked slots
      const blocked = await db
        .select()
        .from(slotBlocks)
        .where(
          and(
            gte(slotBlocks.slotStart, slotStart),
            lt(slotBlocks.slotStart, slotEnd)
          )
        )
        .limit(1);
      isBlocked = blocked.length > 0;
    } catch {
      // DB unavailable — show all slots as available
    }

    const zonedStart = toZonedTime(slotStart, TZ);
    const label = format(zonedStart, "h:mm aa", { timeZone: TZ });

    slots.push({
      start:   slotStart,
      end:     slotEnd,
      label,
      full:    bookingCount >= maxConcurrent,
      blocked: isBlocked,
    });

    hour += slotDurationMin / 60;
  }

  return slots;
}

/** Returns the next 30 available booking dates as YYYY-MM-DD strings (IST). */
export function getBookableDates(): string[] {
  const dates: string[] = [];
  const now = toZonedTime(new Date(), TZ);
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    dates.push(format(d, "yyyy-MM-dd", { timeZone: TZ }));
  }
  return dates;
}
