import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  inet,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ── users ──────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:           uuid("id").primaryKey().defaultRandom(),
  phoneE164:    text("phone_e164").unique(),
  email:        text("email").unique(),
  passwordHash: text("password_hash"),
  displayName:  text("display_name"),
  isAdmin:      boolean("is_admin").notNull().default(false),
  isRootAdmin:  boolean("is_root_admin").notNull().default(false),
  lastLoginAt:  timestamp("last_login_at", { withTimezone: true }),
  createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── admins ─────────────────────────────────────────────────────────────────

export const admins = pgTable("admins", {
  userId:    uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  addedBy:   uuid("added_by").references(() => users.id),
  addedAt:   timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  removedAt: timestamp("removed_at", { withTimezone: true }),
  notes:     text("notes"),
});

// ── otp_codes ──────────────────────────────────────────────────────────────

export const otpCodes = pgTable(
  "otp_codes",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    phoneE164:   text("phone_e164").notNull(),
    codeHash:    text("code_hash").notNull(),
    expiresAt:   timestamp("expires_at", { withTimezone: true }).notNull(),
    attempts:    integer("attempts").notNull().default(0),
    verifiedAt:  timestamp("verified_at", { withTimezone: true }),
    ipAddress:   inet("ip_address"),
    userAgent:   text("user_agent"),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("otp_codes_phone_created_idx").on(t.phoneE164, sql`${t.createdAt} DESC`),
  ]
);

// ── email_otp_codes ────────────────────────────────────────────────────────

export const emailOtpCodes = pgTable(
  "email_otp_codes",
  {
    id:         uuid("id").primaryKey().defaultRandom(),
    email:      text("email").notNull(),
    codeHash:   text("code_hash").notNull(),
    expiresAt:  timestamp("expires_at", { withTimezone: true }).notNull(),
    attempts:   integer("attempts").notNull().default(0),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    ipAddress:  inet("ip_address"),
    userAgent:  text("user_agent"),
    createdAt:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("email_otp_codes_email_created_idx").on(t.email, sql`${t.createdAt} DESC`),
  ]
);
