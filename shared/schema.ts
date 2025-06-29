import { mysqlTable, varchar, int, text, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const projects = mysqlTable("projects", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  technologies: text("technologies").notNull(),
  liveUrl: varchar("live_url", { length: 255 }),
  githubUrl: varchar("github_url", { length: 255 }),
  featured: int("featured").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const skills = mysqlTable("skills", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  level: int("level").notNull(),
  icon: varchar("icon", { length: 255 }).notNull(),
});

export const activities = mysqlTable("activities", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  frequency: varchar("frequency", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }).notNull(),
  active: int("active").default(1),
});

export const pricingPlans = mysqlTable("pricing_plans", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price").notNull(),
  duration: varchar("duration", { length: 255 }).notNull(),
  features: text("features").notNull(),
  popular: int("popular").default(0),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: int("read").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey().autoincrement(),
  heroTitle: varchar("hero_title", { length: 255 }).notNull(),
  heroSubtitle: varchar("hero_subtitle", { length: 255 }).notNull(),
  aboutDescription: text("about_description").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  profilePhoto: varchar("profile_photo", { length: 255 }),
  aboutPhoto: varchar("about_photo", { length: 255 }),
});

export const socialLinks = mysqlTable("social_links", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  order: int("order").default(0),
});

export const articles = mysqlTable("articles", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  image: varchar("image", { length: 255 }),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const education = mysqlTable("education", {
  id: int("id").primaryKey().autoincrement(),
  degree: varchar("degree", { length: 255 }).notNull(),
  school: varchar("school", { length: 255 }).notNull(),
  yearStart: int("year_start").notNull(),
  yearEnd: int("year_end").notNull(),
  description: text("description"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true }).extend({
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });
export const insertPricingPlanSchema = createInsertSchema(pricingPlans).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, read: true, createdAt: true });
export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({ id: true });
export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({ id: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, createdAt: true });
export const insertEducationSchema = createInsertSchema(education).omit({ id: true });

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
export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
