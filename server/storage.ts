import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { 
  users, projects, skills, activities, pricingPlans, contactMessages, siteSettings, socialLinks,
  type User, type InsertUser, type Project, type InsertProject, 
  type Skill, type InsertSkill, type Activity, type InsertActivity,
  type PricingPlan, type InsertPricingPlan, type ContactMessage, type InsertContactMessage,
  type SiteSettings, type InsertSiteSettings, type SocialLink, type InsertSocialLink,
  type Article, type InsertArticle, articles, education, type Education, type InsertEducation
} from "@shared/schema";
import { eq } from 'drizzle-orm';

// Initialize MySQL database
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
});
const db = drizzle(pool);

// Test database connection
async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    await pool.getConnection();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

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

  // Social Links
  getSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: number, updates: Partial<InsertSocialLink>): Promise<SocialLink>;
  deleteSocialLink(id: number): Promise<void>;

  // Articles
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;

  // Education
  getEducation(): Promise<Education[]>;
  createEducation(data: InsertEducation): Promise<Education>;
  updateEducation(id: number, updates: Partial<InsertEducation>): Promise<Education>;
  deleteEducation(id: number): Promise<void>;
}

export class MySQLStorage implements IStorage {
  constructor() {
    // Don't call initializeData in constructor, call it explicitly
  }

  private async initializeData() {
    try {
      console.log('Initializing database with sample data...');
      
      // Check if data already exists
      const existingSettings = await db.select().from(siteSettings).limit(1);
      if (existingSettings.length > 0) {
        console.log('Database already has data, skipping initialization');
        return;
      }

      console.log('No existing data found, creating sample data...');

      // Initialize with sample data
      await db.insert(siteSettings).values({
        heroTitle: "Professional Developer",
        heroSubtitle: "Building modern web applications with cutting-edge technologies",
        aboutDescription: "As a dedicated fullstack developer, I specialize in creating robust, scalable web applications using modern technologies. With expertise in both frontend and backend development, I deliver high-quality solutions that meet business requirements and provide excellent user experiences.",
        email: "contact@developer.com",
        phone: "+1 (555) 123-4567",
        location: "Remote / Available Worldwide"
      });

      console.log('Site settings created');

      // Sample projects
      await db.insert(projects).values([
        {
          title: "E-Commerce Platform",
          description: "Full-stack e-commerce solution with React, Node.js, and payment integration",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400",
          technologies: JSON.stringify(["React", "Node.js", "MongoDB", "Stripe"]),
          liveUrl: "https://ecommerce-demo.vercel.app",
          githubUrl: "https://github.com/developer/ecommerce",
          featured: 1,
          createdAt: new Date()
        },
        {
          title: "Task Management System",
          description: "Collaborative project management application with real-time synchronization",
          image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400",
          technologies: JSON.stringify(["Vue.js", "Express", "Socket.io", "PostgreSQL"]),
          liveUrl: "https://taskmanager-demo.vercel.app",
          githubUrl: "https://github.com/developer/taskmanager",
          featured: 0,
          createdAt: new Date()
        },
        {
          title: "Social Media Dashboard",
          description: "Modern social media management platform with analytics and scheduling",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400",
          technologies: JSON.stringify(["Next.js", "Prisma", "PostgreSQL", "Redis"]),
          liveUrl: "https://social-dashboard.vercel.app",
          githubUrl: "https://github.com/developer/social-dashboard",
          featured: 1,
          createdAt: new Date()
        }
      ]);

      console.log('Projects created');

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
      console.log('Skills created');

      // Sample activities
      const activitiesData = [
        {
          title: "Senior Full Stack Developer",
          description: "Leading development teams and architecting scalable web applications for enterprise clients",
          frequency: "2021 - Present",
          icon: "fas fa-code",
          active: 1
        },
        {
          title: "Technical Lead",
          description: "Managing cross-functional teams and overseeing technical implementation of complex projects",
          frequency: "2019 - 2021",
          icon: "fas fa-users",
          active: 1
        },
        {
          title: "Open Source Contributor",
          description: "Contributing to popular open source projects and maintaining community libraries",
          frequency: "2018 - Present",
          icon: "fab fa-github",
          active: 1
        },
        {
          title: "Tech Conference Speaker",
          description: "Speaking at industry conferences about modern web development practices and emerging technologies",
          frequency: "2020 - Present",
          icon: "fas fa-microphone",
          active: 1
        }
      ];

      await db.insert(activities).values(activitiesData);
      console.log('Activities created');

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
      console.log('Pricing plans created');

      // Sample social links
      const socialLinksData = [
        {
          name: "GitHub",
          icon: "fa-github",
          url: "https://github.com/username",
          order: 1
        },
        {
          name: "LinkedIn",
          icon: "fa-linkedin",
          url: "https://linkedin.com/in/username",
          order: 2
        },
        {
          name: "Instagram",
          icon: "fa-instagram",
          url: "https://instagram.com/username",
          order: 3
        },
        {
          name: "Twitter",
          icon: "fa-twitter",
          url: "https://twitter.com/username",
          order: 4
        }
      ];

      await db.insert(socialLinks).values(socialLinksData);
      console.log('Social links created');

      // Create admin user
      await db.insert(users).values({
        username: "admin",
        password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy" // hashed "password"
      });
      console.log('Admin user created');

      console.log('Database initialization completed successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      // Don't throw error, just log it
    }
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
    const result = await db.insert(users).values(user);
    return { ...user, id: (result as any).insertId };
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
    try {
      // Hapus field createdAt dari project jika ada, biarkan database yang mengisi otomatis
      const { createdAt, ...cleanProject } = project as any;
      console.log('Creating project with clean data:', cleanProject);
      const result = await db.insert(projects).values(cleanProject);
      console.log('Project created successfully:', result);
      return { ...cleanProject, id: (result as any).insertId, createdAt: null };
    } catch (err) {
      console.error('Error in createProject:', err);
      throw err;
    }
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    try {
      // Hapus field createdAt dari updates jika ada
      const { createdAt, ...cleanUpdates } = updates as any;
      console.log('Updating project with clean data:', { id, updates: cleanUpdates });
      const result = await db.update(projects).set(cleanUpdates).where(eq(projects.id, id));
      console.log('Project updated successfully:', result);
      return { ...cleanUpdates, id, createdAt: null };
    } catch (err) {
      console.error('Error in updateProject:', err);
      throw err;
    }
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
    const result = await db.insert(skills).values(skill);
    return { ...skill, id: (result as any).insertId };
  }

  async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill> {
    const result = await db.update(skills).set(updates).where(eq(skills.id, id));
    return { ...updates, id } as Skill;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(activities.id);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    try {
      // Hapus field createdAt dari activity jika ada, biarkan database yang mengisi otomatis
      const { createdAt, ...cleanActivity } = activity as any;
      console.log('Creating activity with clean data:', cleanActivity);
      const result = await db.insert(activities).values(cleanActivity);
      console.log('Activity created successfully:', result);
      return { ...cleanActivity, id: (result as any).insertId };
    } catch (err) {
      console.error('Error in createActivity:', err);
      throw err;
    }
  }

  async updateActivity(id: number, updates: Partial<InsertActivity>): Promise<Activity> {
    try {
      // Hapus field createdAt dari updates jika ada
      const { createdAt, ...cleanUpdates } = updates as any;
      console.log('Updating activity with clean data:', { id, updates: cleanUpdates });
      const result = await db.update(activities).set(cleanUpdates).where(eq(activities.id, id));
      console.log('Activity updated successfully:', result);
      return { ...cleanUpdates, id } as Activity;
    } catch (err) {
      console.error('Error in updateActivity:', err);
      throw err;
    }
  }

  async deleteActivity(id: number): Promise<void> {
    await db.delete(activities).where(eq(activities.id, id));
  }

  // Pricing Plans
  async getPricingPlans(): Promise<PricingPlan[]> {
    return await db.select().from(pricingPlans).orderBy(pricingPlans.id);
  }

  async createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan> {
    try {
      // Hapus field createdAt dari plan jika ada, biarkan database yang mengisi otomatis
      const { createdAt, ...cleanPlan } = plan as any;
      console.log('Creating pricing plan with clean data:', cleanPlan);
      const result = await db.insert(pricingPlans).values(cleanPlan);
      console.log('Pricing plan created successfully:', result);
      return { ...cleanPlan, id: (result as any).insertId };
    } catch (err) {
      console.error('Error in createPricingPlan:', err);
      throw err;
    }
  }

  async updatePricingPlan(id: number, updates: Partial<InsertPricingPlan>): Promise<PricingPlan> {
    try {
      // Hapus field createdAt dari updates jika ada
      const { createdAt, ...cleanUpdates } = updates as any;
      console.log('Updating pricing plan with clean data:', { id, updates: cleanUpdates });
      const result = await db.update(pricingPlans).set(cleanUpdates).where(eq(pricingPlans.id, id));
      console.log('Pricing plan updated successfully:', result);
      return { ...cleanUpdates, id } as PricingPlan;
    } catch (err) {
      console.error('Error in updatePricingPlan:', err);
      throw err;
    }
  }

  async deletePricingPlan(id: number): Promise<void> {
    await db.delete(pricingPlans).where(eq(pricingPlans.id, id));
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    try {
      console.log('Storage createContactMessage called with:', JSON.stringify(message, null, 2));
      
      console.log('Creating contact message with data:', JSON.stringify(message, null, 2));
      
      const result = await db.insert(contactMessages).values(message);
      console.log('Contact message inserted successfully:', result);
      return { ...message, id: (result as any).insertId, createdAt: null, read: null };
    } catch (err) {
      console.error('Error in createContactMessage:', err);
      console.error('Error stack:', (err as Error)?.stack);
      throw err;
    }
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
    const result = await db.update(siteSettings).set(updates).where(eq(siteSettings.id, 1));
    return { ...updates, id: 1 } as SiteSettings;
  }

  // Social Links
  async getSocialLinks(): Promise<SocialLink[]> {
    try {
      return await db.select().from(socialLinks).orderBy(socialLinks.order);
    } catch (err) {
      console.error('Error in getSocialLinks:', err);
      return [];
    }
  }

  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    // Cek apakah sudah ada link dengan nama yang sama
    const existing = await db.select().from(socialLinks).where(eq(socialLinks.name, link.name));
    if (existing.length > 0) {
      // Update jika sudah ada
      const result = await db.update(socialLinks).set(link).where(eq(socialLinks.name, link.name));
      return { ...link, id: (result as any).insertId, order: link.order || null };
    } else {
      // Insert jika belum ada
      const result = await db.insert(socialLinks).values(link);
      return { ...link, id: (result as any).insertId, order: link.order || null };
    }
  }

  async updateSocialLink(id: number, updates: Partial<InsertSocialLink>): Promise<SocialLink> {
    const result = await db.update(socialLinks).set(updates).where(eq(socialLinks.id, id));
    return { ...updates, id, order: updates.order || null } as SocialLink;
  }

  async deleteSocialLink(id: number): Promise<void> {
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    try {
      return await db.select().from(articles).orderBy(articles.createdAt);
    } catch (err) {
      console.error('Error in getArticles:', err);
      return [];
    }
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(article);
    return { ...article, id: (result as any).insertId, createdAt: null, image: article.image || null };
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article> {
    const result = await db.update(articles).set(updates).where(eq(articles.id, id));
    return { ...updates, id, createdAt: null, image: updates.image || null } as Article;
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return await db.select().from(education).orderBy(education.yearEnd);
  }

  async createEducation(data: InsertEducation): Promise<Education> {
    const result = await db.insert(education).values(data);
    return { ...data, id: (result as any).insertId, description: data.description || null };
  }

  async updateEducation(id: number, updates: Partial<InsertEducation>): Promise<Education> {
    const result = await db.update(education).set(updates).where(eq(education.id, id));
    return { ...updates, id, description: updates.description || null } as Education;
  }

  async deleteEducation(id: number): Promise<void> {
    await db.delete(education).where(eq(education.id, id));
  }
}

// Export the MySQL storage instance
export const storage = new MySQLStorage();
