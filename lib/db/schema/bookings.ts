import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  check,
  index,
  unique,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./auth";

// ── appointments ───────────────────────────────────────────────────────────

export const appointments = pgTable(
  "appointments",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    userId:          uuid("user_id").notNull().references(() => users.id),
    slotStart:       timestamp("slot_start", { withTimezone: true }).notNull(),
    slotEnd:         timestamp("slot_end", { withTimezone: true }).notNull(),
    partySize:       integer("party_size").notNull(),
    status:          text("status").notNull().default("confirmed"),
    cancelReason:    text("cancel_reason"),
    cancelledAt:     timestamp("cancelled_at", { withTimezone: true }),
    cancelledBy:     uuid("cancelled_by").references(() => users.id),
    notes:           text("notes"),
    adminNotes:      text("admin_notes"),
    smsSentAt:       timestamp("sms_sent_at", { withTimezone: true }),
    smsProviderId:   text("sms_provider_id"),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("appointments_party_size_check", sql`${t.partySize} BETWEEN 1 AND 4`),
    check(
      "appointments_status_check",
      sql`${t.status} IN ('confirmed','cancelled','completed','no-show')`
    ),
    index("appointments_slot_start_idx").on(t.slotStart),
    index("appointments_user_slot_idx").on(t.userId, sql`${t.slotStart} DESC`),
  ]
);

// ── slot_blocks (admin-blocked slots) ──────────────────────────────────────

export const slotBlocks = pgTable("slot_blocks", {
  id:        uuid("id").primaryKey().defaultRandom(),
  slotStart: timestamp("slot_start", { withTimezone: true }).notNull(),
  slotEnd:   timestamp("slot_end", { withTimezone: true }).notNull(),
  reason:    text("reason"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── events ─────────────────────────────────────────────────────────────────

export const events = pgTable(
  "events",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    slug:           text("slug").unique().notNull(),
    title:          text("title").notNull(),
    description:    text("description"),
    bodyRichtext:   text("body_richtext"),  // Tiptap JSON stored as text
    coverImageUrl:  text("cover_image_url"),
    startsAt:       timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt:         timestamp("ends_at", { withTimezone: true }).notNull(),
    location:       text("location").default("Ubasti Lounge, Chennai"),
    capacity:       integer("capacity"),
    priceInr:       integer("price_inr"),
    isPublished:    boolean("is_published").notNull().default(false),
    createdBy:      uuid("created_by").references(() => users.id),
    updatedBy:      uuid("updated_by").references(() => users.id),
    updatedAt:      timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("events_starts_at_idx").on(t.startsAt),
    index("events_slug_idx").on(t.slug),
  ]
);

// ── event_registrations ────────────────────────────────────────────────────

export const eventRegistrations = pgTable(
  "event_registrations",
  {
    id:         uuid("id").primaryKey().defaultRandom(),
    eventId:    uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    userId:     uuid("user_id").notNull().references(() => users.id),
    partySize:  integer("party_size").notNull().default(1),
    status:     text("status").notNull().default("confirmed"),
    smsSentAt:  timestamp("sms_sent_at", { withTimezone: true }),
    createdAt:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("event_registrations_event_user_unique").on(t.eventId, t.userId),
    check(
      "event_registrations_status_check",
      sql`${t.status} IN ('confirmed','cancelled','waitlist')`
    ),
  ]
);

// ── lounge_settings ────────────────────────────────────────────────────────
// Single row; updated by admin. Key fields stored as columns for type safety.

export const loungeSettings = pgTable("lounge_settings", {
  id:              integer("id").primaryKey().default(1),  // always row 1
  openHour:        integer("open_hour").notNull().default(11),   // 11 = 11:00 IST
  closeHour:       integer("close_hour").notNull().default(19),  // 19 = 19:00 IST
  slotDurationMin: integer("slot_duration_min").notNull().default(60),
  maxConcurrent:   integer("max_concurrent").notNull().default(3),
  closedDays:      jsonb("closed_days").notNull().default([2]),   // 0=Sun..6=Sat; default: Tue=2
  updatedAt:       timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
