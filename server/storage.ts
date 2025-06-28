import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { 
  users, projects, skills, activities, pricingPlans, contactMessages, siteSettings,
  type User, type InsertUser, type Project, type InsertProject, 
  type Skill, type InsertSkill, type Activity, type InsertActivity,
  type PricingPlan, type InsertPricingPlan, type ContactMessage, type InsertContactMessage,
  type SiteSettings, type InsertSiteSettings
} from "@shared/schema";
import { eq } from 'drizzle-orm';

// Initialize SQLite database
const sqlite = new Database(process.env.DATABASE_URL || './database.sqlite');
const db = drizzle(sqlite);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Skills
  getSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: string): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;

  // Activities
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity>;
  deleteActivity(id: number): Promise<void>;

  // Pricing Plans
  getPricingPlans(): Promise<PricingPlan[]>;
  createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan>;
  updatePricingPlan(id: number, plan: Partial<InsertPricingPlan>): Promise<PricingPlan>;
  deletePricingPlan(id: number): Promise<void>;

  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<void>;
  deleteContactMessage(id: number): Promise<void>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
}

export class SQLiteStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Check if data already exists
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length > 0) return;

    // Initialize with sample data
    await db.insert(siteSettings).values({
      heroTitle: "Professional Developer",
      heroSubtitle: "Building modern web applications with cutting-edge technologies",
      aboutDescription: "As a dedicated fullstack developer, I specialize in creating robust, scalable web applications using modern technologies. With expertise in both frontend and backend development, I deliver high-quality solutions that meet business requirements and provide excellent user experiences.",
      email: "contact@developer.com",
      phone: "+1 (555) 123-4567",
      location: "Remote / Available Worldwide"
    });

    // Sample projects
    await db.insert(projects).values([
      {
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with React, Node.js, and payment integration",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400",
        technologies: JSON.stringify(["React", "Node.js", "MongoDB", "Stripe"]),
        liveUrl: "https://ecommerce-demo.vercel.app",
        githubUrl: "https://github.com/developer/ecommerce",
        featured: 1
      },
      {
        title: "Task Management System",
        description: "Collaborative project management application with real-time synchronization",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400",
        technologies: JSON.stringify(["Vue.js", "Express", "Socket.io", "PostgreSQL"]),
        liveUrl: "https://taskmanager-demo.vercel.app",
        githubUrl: "https://github.com/developer/taskmanager",
        featured: 0
      },
      {
        title: "Social Media Dashboard",
        description: "Modern social media management platform with analytics and scheduling",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400",
        technologies: JSON.stringify(["Next.js", "Prisma", "PostgreSQL", "Redis"]),
        liveUrl: "https://social-dashboard.vercel.app",
        githubUrl: "https://github.com/developer/social-dashboard",
        featured: 1
      }
    ]);

    // Sample skills
    const skillsData = [
      { name: "React.js", category: "Frontend", level: 95, icon: "fab fa-react" },
      { name: "TypeScript", category: "Frontend", level: 90, icon: "fab fa-js" },
      { name: "Tailwind CSS", category: "Frontend", level: 92, icon: "fas fa-palette" },
      { name: "Node.js", category: "Backend", level: 88, icon: "fab fa-node-js" },
      { name: "Express.js", category: "Backend", level: 85, icon: "fas fa-server" },
      { name: "Prisma ORM", category: "Backend", level: 80, icon: "fas fa-layer-group" },
      { name: "SQLite", category: "Database", level: 85, icon: "fas fa-database" },
      { name: "PostgreSQL", category: "Database", level: 82, icon: "fas fa-database" },
      { name: "MongoDB", category: "Database", level: 78, icon: "fas fa-leaf" }
    ];

    await db.insert(skills).values(skillsData);

    // Sample activities
    const activitiesData = [
      {
        title: "Senior Full Stack Developer",
        description: "Leading development teams and architecting scalable web applications for enterprise clients",
        frequency: "2021 - Present",
        icon: "fas fa-code"
      },
      {
        title: "Technical Lead",
        description: "Managing cross-functional teams and overseeing technical implementation of complex projects",
        frequency: "2019 - 2021",
        icon: "fas fa-users"
      },
      {
        title: "Open Source Contributor",
        description: "Contributing to popular open source projects and maintaining community libraries",
        frequency: "2018 - Present",
        icon: "fab fa-github"
      },
      {
        title: "Tech Conference Speaker",
        description: "Speaking at industry conferences about modern web development practices and emerging technologies",
        frequency: "2020 - Present",
        icon: "fas fa-microphone"
      }
    ];

    await db.insert(activities).values(activitiesData);

    // Sample pricing plans
    const pricingData = [
      {
        name: "Basic Development",
        price: 2500,
        duration: "per project",
        features: JSON.stringify(["Frontend Development", "Responsive Design", "Basic SEO", "1 Month Support"]),
        popular: 0
      },
      {
        name: "Professional Package",
        price: 5500,
        duration: "per project",
        features: JSON.stringify(["Full-Stack Development", "Database Integration", "API Development", "Advanced SEO", "3 Months Support"]),
        popular: 1
      },
      {
        name: "Enterprise Solution",
        price: 12000,
        duration: "per project",
        features: JSON.stringify(["Enterprise Architecture", "Microservices", "DevOps & CI/CD", "Performance Optimization", "6 Months Support"]),
        popular: 0
      }
    ];

    await db.insert(pricingPlans).values(pricingData);

    // Create admin user
    await db.insert(users).values({
      username: "admin",
      password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy" // hashed "password"
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.createdAt);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const result = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return result[0];
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.name);
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return await db.select().from(skills).where(eq(skills.category, category)).orderBy(skills.name);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values(skill).returning();
    return result[0];
  }

  async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill> {
    const result = await db.update(skills).set(updates).where(eq(skills.id, id)).returning();
    return result[0];
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(activities.id);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  }

  async updateActivity(id: number, updates: Partial<InsertActivity>): Promise<Activity> {
    const result = await db.update(activities).set(updates).where(eq(activities.id, id)).returning();
    return result[0];
  }

  async deleteActivity(id: number): Promise<void> {
    await db.delete(activities).where(eq(activities.id, id));
  }

  // Pricing Plans
  async getPricingPlans(): Promise<PricingPlan[]> {
    return await db.select().from(pricingPlans).orderBy(pricingPlans.id);
  }

  async createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan> {
    const result = await db.insert(pricingPlans).values(plan).returning();
    return result[0];
  }

  async updatePricingPlan(id: number, updates: Partial<InsertPricingPlan>): Promise<PricingPlan> {
    const result = await db.update(pricingPlans).set(updates).where(eq(pricingPlans.id, id)).returning();
    return result[0];
  }

  async deletePricingPlan(id: number): Promise<void> {
    await db.delete(pricingPlans).where(eq(pricingPlans.id, id));
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }

  async markMessageAsRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ read: 1 }).where(eq(contactMessages.id, id));
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    const result = await db.select().from(siteSettings).limit(1);
    return result[0];
  }

  async updateSiteSettings(updates: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const result = await db.update(siteSettings).set(updates).where(eq(siteSettings.id, 1)).returning();
    return result[0];
  }
}

// Export the SQLite storage instance
export const storage = new SQLiteStorage();
