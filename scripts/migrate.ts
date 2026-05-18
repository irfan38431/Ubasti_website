#!/usr/bin/env tsx
/**
 * Direct SQL migration — run when drizzle-kit push fails.
 * Safe to re-run (all statements are idempotent).
 */
import "dotenv/config";
import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL not set");

const sql = postgres(DB_URL, { prepare: false });

async function main() {
  console.log("Running migration...");

  // 1. Make phone_e164 nullable in users
  await sql`
    ALTER TABLE users
      ALTER COLUMN phone_e164 DROP NOT NULL
  `.catch((e) => {
    if (e.message?.includes("already nullable") || e.message?.includes("does not exist")) return;
    throw e;
  });
  console.log("✓ users.phone_e164 is now nullable");

  // 2. Add email column (idempotent)
  await sql`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS email text
  `;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'users_email_unique' AND conrelid = 'users'::regclass
      ) THEN
        ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
      END IF;
    END $$
  `;
  console.log("✓ users.email column added");

  // 3. Add password_hash column (idempotent)
  await sql`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password_hash text
  `;
  console.log("✓ users.password_hash column added");

  // 4. Create site_settings table (idempotent)
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key        text        PRIMARY KEY,
      value      jsonb       NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  console.log("✓ site_settings table created");

  // 5. Create email_otp_codes table (idempotent)
  await sql`
    CREATE TABLE IF NOT EXISTS email_otp_codes (
      id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
      email       text        NOT NULL,
      code_hash   text        NOT NULL,
      expires_at  timestamptz NOT NULL,
      attempts    integer     NOT NULL DEFAULT 0,
      verified_at timestamptz,
      ip_address  inet,
      user_agent  text,
      created_at  timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS email_otp_codes_email_created_idx
      ON email_otp_codes (email, created_at DESC)
  `;
  console.log("✓ email_otp_codes table created");

  // 6. Add registration_url to events (idempotent)
  await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_url text`;
  console.log("✓ events.registration_url column added");

  // 7. Create grooming_bookings table (idempotent)
  await sql`
    CREATE TABLE IF NOT EXISTS grooming_bookings (
      id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id        uuid        NOT NULL REFERENCES users(id),
      services       jsonb       NOT NULL,
      scheduled_date text        NOT NULL,
      pet_name       text        NOT NULL,
      pet_breed      text,
      pet_notes      text,
      status         text        NOT NULL DEFAULT 'pending',
      admin_notes    text,
      created_at     timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS grooming_bookings_user_idx ON grooming_bookings (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS grooming_bookings_date_idx ON grooming_bookings (scheduled_date)`;
  console.log("✓ grooming_bookings table created");

  await sql.end();
  console.log("\nMigration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
