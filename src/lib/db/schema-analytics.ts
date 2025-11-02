import { pgTable, varchar, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Page views tracking
export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  path: varchar("path").notNull(),
  referrer: varchar("referrer"),
  userAgent: text("user_agent"),
  ip: varchar("ip"),
  country: varchar("country"),
  city: varchar("city"),
  device: varchar("device"), // mobile, tablet, desktop
  browser: varchar("browser"),
  os: varchar("os"),
  sessionId: varchar("session_id"),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events tracking
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // click, submit, download, etc.
  category: varchar("category"), // button, form, link, etc.
  label: varchar("label"),
  value: integer("value"),
  metadata: jsonb("metadata"),
  path: varchar("path"),
  sessionId: varchar("session_id"),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sessions tracking
export const sessions = pgTable("analytics_sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id"),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  duration: integer("duration"), // seconds
  pageViews: integer("page_views").default(0),
  events: integer("events").default(0),
  device: varchar("device"),
  browser: varchar("browser"),
  os: varchar("os"),
  country: varchar("country"),
  city: varchar("city"),
});
