import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  bigserial,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./auth";

// ── private_party_inquiries ────────────────────────────────────────────────

export const privatePartyInquiries = pgTable("private_party_inquiries", {
  id:            uuid("id").primaryKey().defaultRandom(),
  fullName:      text("full_name").notNull(),
  phoneE164:     text("phone_e164").notNull(),
  email:         text("email"),
  requestedDate: timestamp("requested_date", { withTimezone: true }).notNull(),
  partySize:     integer("party_size").notNull(),
  occasion:      text("occasion").notNull(),
  message:       text("message"),
  status:        text("status").notNull().default("new"),
  adminNotes:    text("admin_notes"),
  handledBy:     uuid("handled_by").references(() => users.id),
  createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── blog_posts ─────────────────────────────────────────────────────────────

export const blogPosts = pgTable(
  "blog_posts",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    slug:           text("slug").unique().notNull(),
    title:          text("title").notNull(),
    excerpt:        text("excerpt"),
    coverImageUrl:  text("cover_image_url"),
    bodyRichtext:   jsonb("body_richtext").notNull().default(sql`'{}'::jsonb`),
    isPublished:    boolean("is_published").notNull().default(false),
    publishedAt:    timestamp("published_at", { withTimezone: true }),
    authorId:       uuid("author_id").references(() => users.id),
    updatedAt:      timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("blog_posts_published_at_idx")
      .on(sql`${t.publishedAt} DESC`)
      .where(sql`${t.isPublished} = true`),
  ]
);

// ── pages (CMS) ────────────────────────────────────────────────────────────

export const pages = pgTable("pages", {
  slug:        text("slug").primaryKey(),
  title:       text("title").notNull(),
  blocks:      jsonb("blocks").notNull().default(sql`'[]'::jsonb`),
  draftBlocks: jsonb("draft_blocks"),
  isPublished: boolean("is_published").notNull().default(true),
  updatedBy:   uuid("updated_by").references(() => users.id),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── media_library ──────────────────────────────────────────────────────────

export const mediaLibrary = pgTable("media_library", {
  id:          uuid("id").primaryKey().defaultRandom(),
  url:         text("url").notNull(),
  altText:     text("alt_text"),
  width:       integer("width"),
  height:      integer("height"),
  sizeBytes:   integer("size_bytes"),
  mimeType:    text("mime_type"),
  uploadedBy:  uuid("uploaded_by").references(() => users.id),
  tags:        text("tags").array(),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── kitties ────────────────────────────────────────────────────────────────

export const kitties = pgTable("kitties", {
  id:          uuid("id").primaryKey().defaultRandom(),
  slug:        text("slug").unique().notNull(),
  name:        text("name").notNull(),
  imageUrl:    text("image_url"),
  age:         text("age"),
  sex:         text("sex"),
  personality: text("personality"),
  bio:         text("bio"),
  bondedToId:  uuid("bonded_to_id"),  // self-ref added via migration
  status:      text("status").notNull().default("available"),
  sortOrder:   integer("sort_order").default(0),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── audit_log ──────────────────────────────────────────────────────────────

export const auditLog = pgTable(
  "audit_log",
  {
    id:          bigserial("id", { mode: "number" }).primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id),
    action:      text("action").notNull(),
    targetType:  text("target_type"),
    targetId:    text("target_id"),
    payload:     jsonb("payload"),
    ipAddress:   text("ip_address"),
    userAgent:   text("user_agent"),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("audit_log_actor_idx").on(t.actorUserId, sql`${t.createdAt} DESC`),
    index("audit_log_action_idx").on(t.action, sql`${t.createdAt} DESC`),
  ]
);

// ── site_settings ──────────────────────────────────────────────────────────

export const siteSettings = pgTable("site_settings", {
  key:       text("key").primaryKey(),
  value:     jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── contact_submissions ────────────────────────────────────────────────────

export const contactSubmissions = pgTable("contact_submissions", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      text("name").notNull(),
  email:     text("email"),
  message:   text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
