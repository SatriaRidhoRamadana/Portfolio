import express from "express";
import { createServer } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { 
  insertProjectSchema, insertSkillSchema, insertActivitySchema, 
  insertPricingPlanSchema, insertContactMessageSchema, insertSiteSettingsSchema 
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Setup multer storage
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storageMulter = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storageMulter });

// JWT Authentication middleware
const authenticateJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: "Token invalid" });
      }
      
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Token required" });
  }
};

// Configure Passport
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await storage.getUserByUsername(username);
    console.log('Login attempt:', { username, user });
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    if (!isValidPassword) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated (for session-based auth)
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
};

export function registerRoutes(app: express.Application) {
  const server = createServer(app);

  // Initialize database and test connection
  (async () => {
    try {
      console.log('Testing database connection...');
      const connection = await (storage as any).pool?.getConnection();
      if (connection) {
        connection.release();
        console.log('Database connection successful');
        
        // Initialize data if needed
        await (storage as any).initializeData();
      }
    } catch (error) {
      console.error('Database connection failed:', error);
      // Don't crash the app, just log the error
    }
  })();

  // Health check endpoint for Railway
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Routes
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  app.patch("/api/admin/settings", authenticateJWT, async (req, res) => {
    try {
      const updatedSettings = await storage.updateSiteSettings(req.body);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update site settings" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Admin CRUD endpoints for projects
  app.post("/api/admin/projects", authenticateJWT, async (req, res) => {
    try {
      console.log('Creating project with data:', JSON.stringify(req.body, null, 2));
      console.log('Request body type:', typeof req.body);
      console.log('Request body keys:', Object.keys(req.body));
      
      // Validate required fields
      const { title, description, image, technologies } = req.body;
      if (!title || !description || !image || !technologies) {
        console.error('Missing required fields:', { title: !!title, description: !!description, image: !!image, technologies: !!technologies });
        return res.status(400).json({ 
          error: "Missing required fields", 
          details: "Title, description, image, and technologies are required" 
        });
      }
      
      const project = await storage.createProject(req.body);
      console.log('Project created successfully:', project);
      res.json(project);
    } catch (error) {
      console.error('API /api/admin/projects error:', error);
      console.error('Error stack:', (error as Error)?.stack);
      res.status(500).json({ error: "Failed to create project", details: (error as Error)?.message });
    }
  });

  app.patch("/api/admin/projects/:id", authenticateJWT, async (req, res) => {
    try {
      console.log('Updating project with data:', { id: req.params.id, data: JSON.stringify(req.body, null, 2) });
      console.log('Request body type:', typeof req.body);
      console.log('Request body keys:', Object.keys(req.body));
      
      const project = await storage.updateProject(parseInt(req.params.id), req.body);
      console.log('Project updated successfully:', project);
      res.json(project);
    } catch (error) {
      console.error('API /api/admin/projects/:id error:', error);
      console.error('Error stack:', (error as Error)?.stack);
      res.status(500).json({ error: "Failed to update project", details: (error as Error)?.message });
    }
  });

  app.delete("/api/admin/projects/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteProject(parseInt(req.params.id));
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.get("/api/skills", async (req, res) => {
    try {
      const { category } = req.query;
      const skills = category 
        ? await storage.getSkillsByCategory(category as string)
        : await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  // Admin CRUD endpoints for skills
  app.post("/api/admin/skills", authenticateJWT, async (req, res) => {
    try {
      const skill = await storage.createSkill(req.body);
      res.json(skill);
    } catch (error) {
      res.status(500).json({ error: "Failed to create skill" });
    }
  });

  app.patch("/api/admin/skills/:id", authenticateJWT, async (req, res) => {
    try {
      const skill = await storage.updateSkill(parseInt(req.params.id), req.body);
      res.json(skill);
    } catch (error) {
      res.status(500).json({ error: "Failed to update skill" });
    }
  });

  app.delete("/api/admin/skills/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteSkill(parseInt(req.params.id));
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Admin CRUD endpoints for activities
  app.post("/api/admin/activities", authenticateJWT, async (req, res) => {
    try {
      console.log('Creating activity with data:', req.body);
      const activity = await storage.createActivity(req.body);
      console.log('Activity created:', activity);
      res.json(activity);
    } catch (error) {
      console.error('API /api/admin/activities error:', error);
      res.status(500).json({ error: "Failed to create activity", details: (error as Error)?.message });
    }
  });

  app.patch("/api/admin/activities/:id", authenticateJWT, async (req, res) => {
    try {
      console.log('Updating activity with data:', { id: req.params.id, data: req.body });
      const activity = await storage.updateActivity(parseInt(req.params.id), req.body);
      console.log('Activity updated:', activity);
      res.json(activity);
    } catch (error) {
      console.error('API /api/admin/activities/:id error:', error);
      res.status(500).json({ error: "Failed to update activity", details: (error as Error)?.message });
    }
  });

  app.delete("/api/admin/activities/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteActivity(parseInt(req.params.id));
      res.json({ message: "Activity deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete activity" });
    }
  });

  app.get("/api/pricing", async (req, res) => {
    try {
      const plans = await storage.getPricingPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pricing plans" });
    }
  });

  // Admin CRUD endpoints for pricing plans
  app.post("/api/admin/pricing", authenticateJWT, async (req, res) => {
    try {
      console.log('Creating pricing plan with data:', JSON.stringify(req.body, null, 2));
      console.log('Request body type:', typeof req.body);
      console.log('Request body keys:', Object.keys(req.body));
      
      // Validate required fields
      const { name, price, duration, features } = req.body;
      if (!name || !price || !duration || !features) {
        console.error('Missing required fields:', { name: !!name, price: !!price, duration: !!duration, features: !!features });
        return res.status(400).json({ 
          error: "Missing required fields", 
          details: "Name, price, duration, and features are required" 
        });
      }
      
      const plan = await storage.createPricingPlan(req.body);
      console.log('Pricing plan created successfully:', plan);
      res.json(plan);
    } catch (error) {
      console.error('API /api/admin/pricing error:', error);
      console.error('Error stack:', (error as Error)?.stack);
      res.status(500).json({ error: "Failed to create pricing plan", details: (error as Error)?.message });
    }
  });

  app.patch("/api/admin/pricing/:id", authenticateJWT, async (req, res) => {
    try {
      console.log('Updating pricing plan with data:', { id: req.params.id, data: JSON.stringify(req.body, null, 2) });
      console.log('Request body type:', typeof req.body);
      console.log('Request body keys:', Object.keys(req.body));
      
      const plan = await storage.updatePricingPlan(parseInt(req.params.id), req.body);
      console.log('Pricing plan updated successfully:', plan);
      res.json(plan);
    } catch (error) {
      console.error('API /api/admin/pricing/:id error:', error);
      console.error('Error stack:', (error as Error)?.stack);
      res.status(500).json({ error: "Failed to update pricing plan", details: (error as Error)?.message });
    }
  });

  app.delete("/api/admin/pricing/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deletePricingPlan(parseInt(req.params.id));
      res.json({ message: "Pricing plan deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete pricing plan" });
    }
  });

  app.get("/api/admin/messages", authenticateJWT, async (req, res) => {
    try {
      console.log('Fetching contact messages...');
      const messages = await storage.getContactMessages();
      console.log('Contact messages fetched successfully:', messages);
      res.json(messages);
    } catch (error) {
      console.error('API /api/admin/messages error:', error);
      console.error('Error stack:', (error as Error)?.stack);
      res.status(500).json({ error: "Failed to fetch contact messages", details: (error as Error)?.message });
    }
  });

  app.patch("/api/admin/messages/:id/read", authenticateJWT, async (req, res) => {
    try {
      await storage.markMessageAsRead(parseInt(req.params.id));
      res.json({ message: "Message marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  app.delete("/api/admin/messages/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteContactMessage(parseInt(req.params.id));
      res.json({ message: "Contact message deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact message" });
    }
  });

  // Public contact endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      console.log('Contact form data received:', JSON.stringify(req.body, null, 2));
      
      // Validate the data before processing
      const { name, email, subject, message } = req.body;
      
      // Ensure all fields are strings and not undefined/null
      const cleanData = {
        name: String(name || '').trim(),
        email: String(email || '').trim(),
        subject: String(subject || '').trim(),
        message: String(message || '').trim(),
      };
      
      if (!cleanData.name || !cleanData.email || !cleanData.subject || !cleanData.message) {
        return res.status(400).json({ 
          error: "Missing required fields", 
          details: "Name, email, subject, and message are required" 
        });
      }
      
      console.log('Clean contact data being sent to storage:', JSON.stringify(cleanData, null, 2));
      
      const messageResult = await storage.createContactMessage(cleanData);
      console.log('Contact message created successfully:', messageResult);
      res.json(messageResult);
    } catch (error) {
      console.error('API /api/contact error:', error);
      console.error('Error stack:', (error as Error)?.stack);
      res.status(500).json({ error: "Failed to create contact message", details: (error as Error)?.message });
    }
  });

  // Authentication routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    const user = req.user as any;
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token, user });
  });

  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/profile", authenticateJWT, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    res.json(req.user);
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  app.patch("/api/admin/settings", authenticateJWT, async (req, res) => {
    try {
      const updatedSettings = await storage.updateSiteSettings(req.body);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update site settings" });
    }
  });

  // Upload endpoint
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Return URL to access the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Serve uploads statically
  app.use("/uploads", express.static(uploadDir));

  // Social Links endpoints
  app.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      res.json(links);
    } catch (error) {
      console.error('API /api/social-links error:', error);
      console.error('Error stack:', (error as Error)?.stack);
      res.status(500).json({ error: "Failed to fetch social links", details: (error as Error)?.message });
    }
  });
  app.post("/api/admin/social-links", authenticateJWT, async (req, res) => {
    try {
      console.log('Creating social link with data:', JSON.stringify(req.body, null, 2));
      
      // Validate required fields
      const { name, icon, url } = req.body;
      if (!name || !icon || !url) {
        console.error('Missing required fields:', { name: !!name, icon: !!icon, url: !!url });
        return res.status(400).json({ 
          error: "Missing required fields", 
          details: "Name, icon, and url are required" 
        });
      }
      
      const link = await storage.createSocialLink(req.body);
      console.log('Social link created successfully:', link);
      res.json(link);
    } catch (error) {
      console.error('API /api/admin/social-links error:', error);
      console.error('Error stack:', (error as Error)?.stack);
      res.status(500).json({ error: "Failed to create social link", details: (error as Error)?.message });
    }
  });
  app.patch("/api/admin/social-links/:id", authenticateJWT, async (req, res) => {
    try {
      const link = await storage.updateSocialLink(parseInt(req.params.id), req.body);
      res.json(link);
    } catch (error) {
      res.status(500).json({ error: "Failed to update social link" });
    }
  });
  app.delete("/api/admin/social-links/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteSocialLink(parseInt(req.params.id));
      res.json({ message: "Social link deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete social link" });
    }
  });

  // Articles public
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(parseInt(req.params.id));
      if (!article) return res.status(404).json({ error: "Article not found" });
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Admin CRUD endpoints for articles
  app.post("/api/admin/articles", authenticateJWT, async (req, res) => {
    try {
      const article = await storage.createArticle(req.body);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.patch("/api/admin/articles/:id", authenticateJWT, async (req, res) => {
    try {
      const article = await storage.updateArticle(parseInt(req.params.id), req.body);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/admin/articles/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteArticle(parseInt(req.params.id));
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Education endpoints
  app.get("/api/education", async (req, res) => {
    try {
      const data = await storage.getEducation();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch education" });
    }
  });
  app.post("/api/admin/education", authenticateJWT, async (req, res) => {
    try {
      const edu = await storage.createEducation(req.body);
      res.json(edu);
    } catch (error) {
      res.status(500).json({ error: "Failed to create education" });
    }
  });
  app.patch("/api/admin/education/:id", authenticateJWT, async (req, res) => {
    try {
      const edu = await storage.updateEducation(parseInt(req.params.id), req.body);
      res.json(edu);
    } catch (error) {
      res.status(500).json({ error: "Failed to update education" });
    }
  });
  app.delete("/api/admin/education/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteEducation(parseInt(req.params.id));
      res.json({ message: "Education deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete education" });
    }
  });

  return server;
}
