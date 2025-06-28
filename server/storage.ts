import { 
  users, projects, skills, activities, pricingPlans, contactMessages, siteSettings,
  type User, type InsertUser, type Project, type InsertProject, 
  type Skill, type InsertSkill, type Activity, type InsertActivity,
  type PricingPlan, type InsertPricingPlan, type ContactMessage, type InsertContactMessage,
  type SiteSettings, type InsertSiteSettings
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private skills: Map<number, Skill> = new Map();
  private activities: Map<number, Activity> = new Map();
  private pricingPlans: Map<number, PricingPlan> = new Map();
  private contactMessages: Map<number, ContactMessage> = new Map();
  private siteSettings: SiteSettings;
  private currentId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data
    this.siteSettings = {
      id: 1,
      heroTitle: "Cosmic Developer",
      heroSubtitle: "Crafting digital experiences across the universe of web technologies",
      aboutDescription: "As a passionate fullstack developer, I navigate through the vast cosmos of web technologies, creating stellar applications that bridge the gap between imagination and reality. My mission is to craft digital experiences that are not just functional, but truly cosmic.",
      email: "cosmic@developer.space",
      phone: "+1 (555) 123-SPACE",
      location: "Digital Universe"
    };

    // Sample projects
    this.projects.set(1, {
      id: 1,
      title: "Cosmic E-Commerce",
      description: "Full-stack e-commerce platform with React, Node.js, and Stripe integration",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      liveUrl: "https://cosmic-ecommerce.demo",
      githubUrl: "https://github.com/cosmic/ecommerce",
      featured: true,
      createdAt: new Date()
    });

    this.projects.set(2, {
      id: 2,
      title: "Stellar Tasks",
      description: "Collaborative task management with real-time updates and team features",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400",
      technologies: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
      liveUrl: "https://stellar-tasks.demo",
      githubUrl: "https://github.com/cosmic/tasks",
      featured: false,
      createdAt: new Date()
    });

    this.projects.set(3, {
      id: 3,
      title: "Galaxy Social",
      description: "Modern social media platform with posts, stories, and messaging",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400",
      technologies: ["Next.js", "Prisma", "PostgreSQL", "Redis"],
      liveUrl: "https://galaxy-social.demo",
      githubUrl: "https://github.com/cosmic/social",
      featured: true,
      createdAt: new Date()
    });

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

    skillsData.forEach((skill, index) => {
      this.skills.set(index + 1, { id: index + 1, ...skill });
    });

    // Sample activities
    const activitiesData = [
      {
        title: "Tech Workshops",
        description: "Leading coding workshops and mentoring developers in modern web technologies",
        frequency: "Monthly",
        icon: "fas fa-chalkboard-teacher"
      },
      {
        title: "Open Source",
        description: "Contributing to open source projects and maintaining cosmic development tools",
        frequency: "Ongoing",
        icon: "fas fa-code"
      },
      {
        title: "Tech Talks",
        description: "Speaking at conferences about fullstack development and emerging technologies",
        frequency: "Quarterly",
        icon: "fas fa-microphone"
      },
      {
        title: "Tech Blogging",
        description: "Writing technical articles and tutorials for the developer community",
        frequency: "Weekly",
        icon: "fas fa-blog"
      }
    ];

    activitiesData.forEach((activity, index) => {
      this.activities.set(index + 1, { id: index + 1, ...activity });
    });

    // Sample pricing plans
    const pricingData = [
      {
        name: "Stellar Starter",
        price: 2500,
        duration: "per project",
        features: ["Frontend Development", "Responsive Design", "Basic SEO", "1 Month Support"],
        popular: false
      },
      {
        name: "Galactic Pro",
        price: 5500,
        duration: "per project",
        features: ["Full-Stack Development", "Database Integration", "API Development", "Advanced SEO", "3 Months Support"],
        popular: true
      },
      {
        name: "Cosmic Enterprise",
        price: 12000,
        duration: "per project",
        features: ["Enterprise Architecture", "Microservices", "DevOps & CI/CD", "Performance Optimization", "6 Months Support"],
        popular: false
      }
    ];

    pricingData.forEach((plan, index) => {
      this.pricingPlans.set(index + 1, { id: index + 1, ...plan });
    });

    // Create admin user
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy" // hashed "password"
    });

    this.currentId = 100; // Start from 100 for new entries
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date() 
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error("Project not found");
    
    const updated = { ...existing, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(skill => skill.category === category);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.currentId++;
    const skill: Skill = { ...insertSkill, id };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill> {
    const existing = this.skills.get(id);
    if (!existing) throw new Error("Skill not found");
    
    const updated = { ...existing, ...updates };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: number): Promise<void> {
    this.skills.delete(id);
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: number, updates: Partial<InsertActivity>): Promise<Activity> {
    const existing = this.activities.get(id);
    if (!existing) throw new Error("Activity not found");
    
    const updated = { ...existing, ...updates };
    this.activities.set(id, updated);
    return updated;
  }

  async deleteActivity(id: number): Promise<void> {
    this.activities.delete(id);
  }

  // Pricing Plans
  async getPricingPlans(): Promise<PricingPlan[]> {
    return Array.from(this.pricingPlans.values());
  }

  async createPricingPlan(insertPlan: InsertPricingPlan): Promise<PricingPlan> {
    const id = this.currentId++;
    const plan: PricingPlan = { ...insertPlan, id };
    this.pricingPlans.set(id, plan);
    return plan;
  }

  async updatePricingPlan(id: number, updates: Partial<InsertPricingPlan>): Promise<PricingPlan> {
    const existing = this.pricingPlans.get(id);
    if (!existing) throw new Error("Pricing plan not found");
    
    const updated = { ...existing, ...updates };
    this.pricingPlans.set(id, updated);
    return updated;
  }

  async deletePricingPlan(id: number): Promise<void> {
    this.pricingPlans.delete(id);
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      read: false, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<void> {
    const message = this.contactMessages.get(id);
    if (message) {
      this.contactMessages.set(id, { ...message, read: true });
    }
  }

  async deleteContactMessage(id: number): Promise<void> {
    this.contactMessages.delete(id);
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    return this.siteSettings;
  }

  async updateSiteSettings(updates: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    this.siteSettings = { ...this.siteSettings, ...updates };
    return this.siteSettings;
  }
}

export const storage = new MemStorage();
