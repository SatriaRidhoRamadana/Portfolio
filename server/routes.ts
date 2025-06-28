import express from "express";
import { createServer } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { 
  insertProjectSchema, insertSkillSchema, insertActivitySchema, 
  insertPricingPlanSchema, insertContactMessageSchema, insertSiteSettingsSchema 
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Configure Passport
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
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

export function registerRoutes(app: express.Application) {
  const server = createServer(app);

  // API Routes
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  app.put("/api/site-settings", async (req, res) => {
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

  app.post("/api/projects", async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(parseInt(req.params.id), req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
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

  app.post("/api/skills", async (req, res) => {
    try {
      const skill = await storage.createSkill(req.body);
      res.json(skill);
    } catch (error) {
      res.status(500).json({ error: "Failed to create skill" });
    }
  });

  app.put("/api/skills/:id", async (req, res) => {
    try {
      const skill = await storage.updateSkill(parseInt(req.params.id), req.body);
      res.json(skill);
    } catch (error) {
      res.status(500).json({ error: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
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

  app.post("/api/activities", async (req, res) => {
    try {
      const activity = await storage.createActivity(req.body);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create activity" });
    }
  });

  app.put("/api/activities/:id", async (req, res) => {
    try {
      const activity = await storage.updateActivity(parseInt(req.params.id), req.body);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to update activity" });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    try {
      await storage.deleteActivity(parseInt(req.params.id));
      res.json({ message: "Activity deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete activity" });
    }
  });

  app.get("/api/pricing-plans", async (req, res) => {
    try {
      const plans = await storage.getPricingPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pricing plans" });
    }
  });

  app.post("/api/pricing-plans", async (req, res) => {
    try {
      const plan = await storage.createPricingPlan(req.body);
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to create pricing plan" });
    }
  });

  app.put("/api/pricing-plans/:id", async (req, res) => {
    try {
      const plan = await storage.updatePricingPlan(parseInt(req.params.id), req.body);
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update pricing plan" });
    }
  });

  app.delete("/api/pricing-plans/:id", async (req, res) => {
    try {
      await storage.deletePricingPlan(parseInt(req.params.id));
      res.json({ message: "Pricing plan deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete pricing plan" });
    }
  });

  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact-messages", async (req, res) => {
    try {
      const message = await storage.createContactMessage(req.body);
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to create contact message" });
    }
  });

  app.put("/api/contact-messages/:id/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(parseInt(req.params.id));
      res.json({ message: "Message marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  app.delete("/api/contact-messages/:id", async (req, res) => {
    try {
      await storage.deleteContactMessage(parseInt(req.params.id));
      res.json({ message: "Contact message deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact message" });
    }
  });

  // Authentication routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    const token = jwt.sign({ id: req.user.id, username: req.user.username }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token, user: req.user });
  });

  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/profile", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  return server;
}
