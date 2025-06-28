import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").notNull(), // Will store as JSON string
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  featured: integer("featured").default(0), // 0 = false, 1 = true
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now),
});

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(), // frontend, backend, database
  level: integer("level").notNull(), // 1-100
  icon: text("icon").notNull(),
});

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  frequency: text("frequency").notNull(),
  icon: text("icon").notNull(),
});

export const pricingPlans = sqliteTable("pricing_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  duration: text("duration").notNull(),
  features: text("features").notNull(), // Will store as JSON string
  popular: integer("popular").default(0), // 0 = false, 1 = true
});

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: integer("read").default(0), // 0 = false, 1 = true
  createdAt: integer("created_at", { mode: 'timestamp' }).default(Date.now),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  heroTitle: text("hero_title").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  aboutDescription: text("about_description").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });
export const insertPricingPlanSchema = createInsertSchema(pricingPlans).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, read: true, createdAt: true });
export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type PricingPlan = typeof pricingPlans.$inferSelect;
export type InsertPricingPlan = z.infer<typeof insertPricingPlanSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
