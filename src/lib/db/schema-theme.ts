import { pgTable, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Theme settings table
export const themeSettings = pgTable("theme_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Logo settings
  logoUrl: varchar("logo_url"),
  logoWidth: integer("logo_width").default(180),
  logoHeight: integer("logo_height").default(60),
  faviconUrl: varchar("favicon_url"),
  
  // Color scheme
  primaryColor: varchar("primary_color").default("#0066CC"),
  secondaryColor: varchar("secondary_color").default("#FF6B35"),
  accentColor: varchar("accent_color").default("#4ECDC4"),
  backgroundColor: varchar("background_color").default("#FFFFFF"),
  textColor: varchar("text_color").default("#1A1A1A"),
  
  // Typography
  fontFamily: varchar("font_family").default("Inter"),
  headingFontFamily: varchar("heading_font_family").default("Inter"),
  fontSize: varchar("font_size").default("16px"),
  
  // Layout
  containerMaxWidth: varchar("container_max_width").default("1280px"),
  borderRadius: varchar("border_radius").default("8px"),
  
  // Dark mode
  darkModeEnabled: boolean("dark_mode_enabled").default(false),
  darkPrimaryColor: varchar("dark_primary_color").default("#3B82F6"),
  darkBackgroundColor: varchar("dark_background_color").default("#1A1A1A"),
  darkTextColor: varchar("dark_text_color").default("#F5F5F5"),
  
  // Custom CSS
  customCss: text("custom_css"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertThemeSettingsSchema = createInsertSchema(themeSettings);
export type ThemeSettings = typeof themeSettings.$inferSelect;
export type InsertThemeSettings = z.infer<typeof insertThemeSettingsSchema>;
