import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Save,
  LogOut,
  Settings,
  MessageSquare,
  FolderOpen,
  Zap,
  Calendar,
  DollarSign,
  Instagram,
  Linkedin,
  Github,
  Send,
  Youtube,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import {
  insertProjectSchema,
  insertSkillSchema,
  insertActivitySchema,
  insertPricingPlanSchema,
  insertSiteSettingsSchema,
  type Project,
  type Skill,
  type Activity,
  type PricingPlan,
  type ContactMessage,
  type SiteSettings,
  type SocialLink,
  type Article,
  type Education,
  type InsertEducation,
  insertEducationSchema,
} from "@shared/schema";
import { z } from "zod";
import { FaIconLibrary } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  const { logout, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("projects");
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showEditActivityDialog, setShowEditActivityDialog] = useState<number | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editEducation, setEditEducation] = useState<Education | null>(null);

  useEffect(() => {
    fetch('/api/social-links').then(r => r.json()).then(setSocialLinks);
  }, []);

  useEffect(() => {
    fetch('/api/education').then(r => r.json()).then(setEducations);
  }, []);

  // Fetch data
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: () => fetch("/api/projects").then(res => res.json()),
  });

  const { data: skills } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
    queryFn: () => fetch("/api/skills").then(res => res.json()),
  });

  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
    queryFn: () => fetch("/api/activities").then(res => res.json()),
  });

  const { data: pricingPlans } = useQuery<PricingPlan[]>({
    queryKey: ["/api/pricing"],
    queryFn: () => fetch("/api/pricing").then(res => res.json()),
  });

  const { data: messages } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
    queryFn: () => fetch("/api/settings").then(res => res.json()),
  });

  // --- PROJECTS ---
  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating project with data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data));
      try {
        const response = await apiRequest("POST", "/api/admin/projects", data, token);
        console.log('Project creation response:', response);
        return response;
      } catch (error) {
        console.error('Project creation API error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created successfully! 🚀" });
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Project creation error:', error);
      toast({ title: "Creation failed", description: error?.message || "Please try again.", variant: "destructive" });
    },
  });
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      console.log('Updating project with data:', { id, data });
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data));
      try {
        const response = await apiRequest("PATCH", `/api/admin/projects/${id}`, data, token);
        console.log('Project update response:', response);
        return response;
      } catch (error) {
        console.error('Project update API error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project updated successfully! ✨" });
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Project update error:', error);
      toast({ title: "Update failed", description: error?.message || "Please try again.", variant: "destructive" });
    },
  });
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/admin/projects/${id}`, undefined, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted successfully! 🗑️" });
    },
    onError: () => {
      toast({ title: "Deletion failed", description: "Please try again.", variant: "destructive" });
    },
  });

  // --- SKILLS ---
  const createSkillMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/admin/skills", data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill created successfully! 🚀" });
      setEditingItem(null);
    },
    onError: () => {
      toast({ title: "Creation failed", description: "Please try again.", variant: "destructive" });
    },
  });
  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => apiRequest("PATCH", `/api/admin/skills/${id}`, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill updated successfully! ✨" });
      setEditingItem(null);
    },
    onError: () => {
      toast({ title: "Update failed", description: "Please try again.", variant: "destructive" });
    },
  });
  const deleteSkillMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/admin/skills/${id}`, undefined, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill deleted successfully! 🗑️" });
    },
    onError: () => {
      toast({ title: "Deletion failed", description: "Please try again.", variant: "destructive" });
    },
  });

  // --- ACTIVITIES ---
  const createActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating activity with data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data));
      try {
        const response = await apiRequest("POST", "/api/admin/activities", data, token);
        console.log('Activity creation response:', response);
        return response;
      } catch (error) {
        console.error('Activity creation API error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({ title: "Activity created successfully! 🚀" });
      setEditingItem(null);
      setShowActivityDialog(false);
    },
    onError: (error) => {
      console.error('Activity creation error:', error);
      toast({ title: "Creation failed", description: error?.message || "Please try again.", variant: "destructive" });
    },
  });
  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      console.log('Updating activity with data:', { id, data });
      return apiRequest("PATCH", `/api/admin/activities/${id}`, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({ title: "Activity updated successfully! ✨" });
      setEditingItem(null);
      setShowEditActivityDialog(null);
    },
    onError: (error) => {
      console.error('Activity update error:', error);
      toast({ title: "Update failed", description: "Please try again.", variant: "destructive" });
    },
  });
  const deleteActivityMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/admin/activities/${id}`, undefined, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({ title: "Activity deleted successfully! 🗑️" });
    },
    onError: () => {
      toast({ title: "Deletion failed", description: "Please try again.", variant: "destructive" });
    },
  });

  // --- PRICING PLANS ---
  const createPricingMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating pricing plan with data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data));
      try {
        const response = await apiRequest("POST", "/api/admin/pricing", data, token);
        console.log('Pricing plan creation response:', response);
        return response;
      } catch (error) {
        console.error('Pricing plan creation API error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pricing"] });
      toast({ title: "Plan created successfully! 🚀" });
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Pricing plan creation error:', error);
      toast({ title: "Creation failed", description: error?.message || "Please try again.", variant: "destructive" });
    },
  });
  const updatePricingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      console.log('Updating pricing plan with data:', { id, data });
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data));
      try {
        const response = await apiRequest("PATCH", `/api/admin/pricing/${id}`, data, token);
        console.log('Pricing plan update response:', response);
        return response;
      } catch (error) {
        console.error('Pricing plan update API error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pricing"] });
      toast({ title: "Plan updated successfully! ✨" });
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Pricing plan update error:', error);
      toast({ title: "Update failed", description: error?.message || "Please try again.", variant: "destructive" });
    },
  });
  const deletePricingMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/admin/pricing/${id}`, undefined, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pricing"] });
      toast({ title: "Plan deleted successfully! 🗑️" });
    },
    onError: () => {
      toast({ title: "Deletion failed", description: "Please try again.", variant: "destructive" });
    },
  });

  // --- MESSAGES ---
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("PATCH", `/api/admin/messages/${id}/read`, undefined, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/admin/messages/${id}`, undefined, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });

  // --- SOCIAL LINKS ---
  const createSocialLinkMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/admin/social-links", data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      toast({ title: "Social link created!" });
      setEditingItem(null);
    },
    onError: () => {
      toast({ title: "Creation failed", description: "Please try again.", variant: "destructive" });
    },
  });
  const updateSocialLinkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => apiRequest("PATCH", `/api/admin/social-links/${id}`, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      toast({ title: "Social link updated!" });
      setEditingItem(null);
    },
    onError: () => {
      toast({ title: "Update failed", description: "Please try again.", variant: "destructive" });
    },
  });
  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/admin/social-links/${id}`, undefined, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      toast({ title: "Social link deleted!" });
    },
    onError: () => {
      toast({ title: "Deletion failed", description: "Please try again.", variant: "destructive" });
    },
  });

  // Technology Selector Component
  const TechnologySelector = ({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) => {
    const [customTech, setCustomTech] = useState("");
    const commonTechnologies = [
      "React", "TypeScript", "JavaScript", "Node.js", "Express.js", "PostgreSQL", 
      "MongoDB", "MySQL", "Docker", "AWS", "Vercel", "Netlify", "Git", "GitHub",
      "Tailwind CSS", "Bootstrap", "Material-UI", "Next.js", "Vue.js", "Angular",
      "Python", "Django", "Flask", "PHP", "Laravel", "WordPress", "Shopify",
      "Stripe", "PayPal", "Firebase", "Supabase", "GraphQL", "REST API"
    ];

    const addCustomTech = () => {
      if (customTech.trim() && !value.includes(customTech.trim())) {
        onChange([...value, customTech.trim()]);
        setCustomTech("");
      }
    };

    const removeTech = (tech: string) => {
      onChange(value.filter(t => t !== tech));
    };

    const toggleTech = (tech: string) => {
      if (value.includes(tech)) {
        removeTech(tech);
      } else {
        onChange([...value, tech]);
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            placeholder="Tambah teknologi custom..."
            className="bg-slate-800 border-slate-600"
            onKeyPress={(e) => e.key === 'Enter' && addCustomTech()}
          />
          <Button type="button" onClick={addCustomTech} className="cosmic-btn">
            Tambah
          </Button>
        </div>
        
        <div className="text-xs text-slate-400 mb-2">
          Teknologi yang dipilih: {value.length > 0 ? value.join(", ") : "Belum ada"}
        </div>

        <div className="max-h-40 overflow-y-auto border border-slate-600 rounded-md p-3">
          <div className="text-sm font-medium mb-2 text-slate-300">Teknologi Umum:</div>
          <div className="grid grid-cols-2 gap-2">
            {commonTechnologies.map((tech) => (
              <label key={tech} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.includes(tech)}
                  onChange={() => toggleTech(tech)}
                  className="rounded border-slate-600 bg-slate-800"
                />
                <span className="text-sm text-slate-300">{tech}</span>
              </label>
            ))}
          </div>
        </div>

        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-pink-500/20 text-pink-300">
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="ml-1 hover:text-red-400"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Feature Selector Component
  const FeatureSelector = ({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) => {
    const [customFeature, setCustomFeature] = useState("");
    const commonFeatures = [
      "Frontend Development", "Backend Development", "Database Design", "API Development",
      "Responsive Design", "Mobile-First Design", "SEO Optimization", "Performance Optimization",
      "Security Implementation", "Testing & QA", "Deployment", "Maintenance & Support",
      "UI/UX Design", "E-commerce Integration", "Payment Gateway", "User Authentication",
      "Content Management", "Analytics Integration", "Third-party APIs", "Cloud Services",
      "DevOps & CI/CD", "Code Review", "Documentation", "Training & Support"
    ];

    const addCustomFeature = () => {
      if (customFeature.trim() && !value.includes(customFeature.trim())) {
        onChange([...value, customFeature.trim()]);
        setCustomFeature("");
      }
    };

    const removeFeature = (feature: string) => {
      onChange(value.filter(f => f !== feature));
    };

    const toggleFeature = (feature: string) => {
      if (value.includes(feature)) {
        removeFeature(feature);
      } else {
        onChange([...value, feature]);
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            placeholder="Tambah fitur custom..."
            className="bg-slate-800 border-slate-600"
            onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
          />
          <Button type="button" onClick={addCustomFeature} className="cosmic-btn">
            Tambah
          </Button>
        </div>
        
        <div className="text-xs text-slate-400 mb-2">
          Fitur yang dipilih: {value.length > 0 ? value.join(", ") : "Belum ada"}
        </div>

        <div className="max-h-40 overflow-y-auto border border-slate-600 rounded-md p-3">
          <div className="text-sm font-medium mb-2 text-slate-300">Fitur Umum:</div>
          <div className="grid grid-cols-1 gap-2">
            {commonFeatures.map((feature) => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                  className="rounded border-slate-600 bg-slate-800"
                />
                <span className="text-sm text-slate-300">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((feature) => (
              <Badge key={feature} variant="secondary" className="bg-blue-500/20 text-blue-300">
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="ml-1 hover:text-red-400"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Forms
  const ProjectForm = ({ project, onSubmit }: { project?: Project; onSubmit: (data: any) => void }) => {
    const form = useForm({
      resolver: zodResolver(insertProjectSchema),
      defaultValues: {
        title: project?.title || "",
        description: project?.description || "",
        image: project?.image || "",
        technologies: project?.technologies
          ? (Array.isArray(project.technologies) ? project.technologies.join(", ") : JSON.parse(project.technologies).join(", "))
          : "",
        liveUrl: project?.liveUrl || "",
        githubUrl: project?.githubUrl || "",
        featured: project?.featured === 1 || project?.featured === true ? 1 : 0,
      },
    });
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(project?.image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          form.setValue("image", data.url);
          setPreview(data.url);
        }
      } catch (err) {
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    };

    const handleSubmit = (data: any) => {
      console.log('Raw form data:', data);
      
      // Ensure all required fields are present
      if (!data.title || !data.description || !data.image || !data.technologies) {
        console.error('Missing required fields:', { title: !!data.title, description: !!data.description, image: !!data.image, technologies: !!data.technologies });
        alert('Please fill in all required fields: Title, Description, Image, and Technologies');
        return;
      }

      const processedData = {
        ...data,
        technologies: JSON.stringify(data.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)),
        liveUrl: data.liveUrl || "",
        githubUrl: data.githubUrl || "",
      };
      console.log('Project form data:', processedData);
      onSubmit(processedData);
    };

    const onFormError = (errors: any) => {
      console.error('Form validation errors:', errors);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit, onFormError)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="E-Commerce Platform with Payment Gateway" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Contoh: "AI Chatbot for Customer Service", "Mobile App for Food Delivery"
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-slate-800 border-slate-600" placeholder="A full-stack e-commerce platform with real-time inventory management, secure payment processing, and admin dashboard..." />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Jelaskan fitur utama, teknologi yang digunakan, dan hasil yang dicapai
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="https://example.com/project-image.jpg" />
                </FormControl>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="block text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600"
                  />
                  {uploading && <span className="text-xs text-pink-500">Uploading...</span>}
                </div>
                <div className="text-xs text-slate-400">
                  Upload gambar atau masukkan URL. Ukuran yang disarankan: 800x600px
                </div>
                {preview && (
                  <img src={preview} alt="Preview" className="mt-2 rounded-md max-h-32 border border-slate-700" />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies *</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="Contoh: React, Node.js, PostgreSQL" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Masukkan teknologi yang digunakan, pisahkan dengan koma. Contoh: React, Node.js, PostgreSQL
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="https://myproject.vercel.app" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  URL website yang sudah live. Contoh: https://myproject.vercel.app, https://demo.myproject.com
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="https://github.com/username/project-name" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Link repository GitHub. Contoh: https://github.com/username/project-name
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch checked={field.value === 1} onCheckedChange={val => field.onChange(val ? 1 : 0)} />
                </FormControl>
                <FormLabel>Featured</FormLabel>
              </FormItem>
            )}
          />
          <Button type="submit" className="cosmic-btn">
            <Save className="mr-2 h-4 w-4" />
            Save Project
          </Button>
        </form>
      </Form>
    );
  };

  const SkillForm = ({ skill, onSubmit }: { skill?: Skill; onSubmit: (data: any) => void }) => {
    const form = useForm({
      resolver: zodResolver(insertSkillSchema),
      defaultValues: {
        name: skill?.name || "",
        category: skill?.category || "",
        level: skill?.level || 50,
        icon: skill?.icon || "",
      },
    });
    const handleSubmit = (data: any) => {
      const processedData = {
        ...data,
        level: parseInt(data.level, 10) || 0,
      };
      onSubmit(processedData);
    };
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="React.js" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Nama teknologi atau skill. Contoh: React.js, Node.js, PostgreSQL, Docker
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="ai">AI/ML</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-slate-400">
                  Pilih kategori yang sesuai dengan skill tersebut
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level (1-100)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="100" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="bg-slate-800 border-slate-600" 
                    placeholder="85" 
                  />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Tingkat keahlian dari 1-100. 1-30: Beginner, 31-60: Intermediate, 61-85: Advanced, 86-100: Expert
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon (FontAwesome)</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="fab fa-react" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Nama icon FontAwesome. Contoh: fab fa-react, fab fa-node-js, fas fa-database, fab fa-docker
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="cosmic-btn">
            <Save className="mr-2 h-4 w-4" />
            Save Skill
          </Button>
        </form>
      </Form>
    );
  };

  const ActivityForm = ({ activity, onSubmit }: { activity?: Activity; onSubmit: (data: any) => void }) => {
    console.log('ActivityForm rendered with activity:', activity);
    
    const form = useForm({
      resolver: zodResolver(insertActivitySchema),
      defaultValues: {
        title: activity?.title || "",
        description: activity?.description || "",
        frequency: activity?.frequency || "",
        icon: activity?.icon || "",
        active: activity?.active === 1 ? 1 : 0,
      },
    });

    const handleSubmit = (data: any) => {
      console.log('ActivityForm handleSubmit called with data:', data);
      
      // Validasi data sebelum submit
      if (!data.title || !data.description || !data.frequency || !data.icon) {
        console.error('Missing required fields:', { 
          title: !!data.title, 
          description: !!data.description, 
          frequency: !!data.frequency, 
          icon: !!data.icon 
        });
        alert('Please fill in all required fields: Title, Description, Frequency, and Icon');
        return;
      }

      const processedData = {
        ...data,
        active: data.active ? 1 : 0,
      };
      console.log('Activity form processed data:', processedData);
      console.log('Calling onSubmit with processed data');
      onSubmit(processedData);
    };

    const onFormError = (errors: any) => {
      console.error('Activity form validation errors:', errors);
    };

    const handleFormSubmit = form.handleSubmit(handleSubmit, onFormError);

    return (
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="e.g. Senior Full Stack Developer" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Position or activity title. Example: "Senior Full Stack Developer", "Tech Lead", "Open Source Contributor"
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-slate-800 border-slate-600" placeholder="Describe your responsibilities, achievements, or contributions..." />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Detailed description about responsibilities, achievements, or contributions
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="e.g. 2022 - Present" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Time period or frequency. Example: "2022 - Present", "Jan 2023 - Dec 2023", "Weekly"
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon (FontAwesome) *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="e.g. fas fa-code" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  FontAwesome icon name. Example: fas fa-code, fas fa-briefcase, fas fa-graduation-cap, fas fa-trophy
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch checked={field.value === 1} onCheckedChange={v => field.onChange(v ? 1 : 0)} />
                </FormControl>
                <FormLabel>Active</FormLabel>
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="cosmic-btn"
            onClick={() => console.log('Activity form submit button clicked')}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Activity
          </Button>
        </form>
      </Form>
    );
  };

  const PricingForm = ({ plan, onSubmit }: { plan?: PricingPlan; onSubmit: (data: any) => void }) => {
    const form = useForm({
      resolver: zodResolver(insertPricingPlanSchema),
      defaultValues: {
        name: plan?.name || "",
        price: plan?.price || 0,
        duration: plan?.duration || "",
        features: plan?.features
          ? (Array.isArray(plan.features) ? plan.features.join(", ") : JSON.parse(plan.features).join(", "))
          : "",
        popular: plan?.popular === 1 || plan?.popular === true ? 1 : 0,
      },
    });
    const handleSubmit = (data: any) => {
      console.log('Raw pricing form data:', data);
      
      // Ensure all required fields are present
      if (!data.name || !data.price || !data.duration || !data.features) {
        console.error('Missing required fields:', { name: !!data.name, price: !!data.price, duration: !!data.duration, features: !!data.features });
        alert('Please fill in all required fields: Name, Price, Duration, and Features');
        return;
      }

      const processedData = {
        ...data,
        price: parseInt(data.price, 10) || 0,
        features: JSON.stringify(data.features.split(",").map((f: string) => f.trim()).filter(Boolean)),
        // popular sudah number dari awal
      };
      console.log('Pricing form data:', processedData);
      onSubmit(processedData);
    };

    const onFormError = (errors: any) => {
      console.error('Pricing form validation errors:', errors);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit, onFormError)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="Basic Development Package" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Nama paket layanan. Contoh: "Basic Development", "Professional Package", "Enterprise Solution"
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="bg-slate-800 border-slate-600"
                    placeholder="2500"
                  />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Harga dalam USD. Contoh: 2500, 5500, 12000
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="per project" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Durasi atau satuan harga. Contoh: "per project", "per month", "per hour"
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features *</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-slate-800 border-slate-600 text-white" placeholder="Contoh: Frontend Development, Responsive Design, Basic SEO" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Masukkan fitur utama, pisahkan dengan koma. Contoh: Frontend Development, Responsive Design, Basic SEO
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="popular"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch checked={field.value === 1} onCheckedChange={val => field.onChange(val ? 1 : 0)} />
                </FormControl>
                <FormLabel>Popular</FormLabel>
              </FormItem>
            )}
          />
          <Button type="submit" className="cosmic-btn">
            <Save className="mr-2 h-4 w-4" />
            Save Plan
          </Button>
        </form>
      </Form>
    );
  };

  const SettingsForm = () => {
    const form = useForm({
      resolver: zodResolver(insertSiteSettingsSchema.partial()),
      defaultValues: {
        heroTitle: settings?.heroTitle || "",
        heroSubtitle: settings?.heroSubtitle || "",
        aboutDescription: settings?.aboutDescription || "",
        email: settings?.email || "",
        phone: settings?.phone || "",
        location: settings?.location || "",
        profilePhoto: settings?.profilePhoto || "",
        aboutPhoto: settings?.aboutPhoto || "", // NEW FIELD
      },
    });

    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(settings?.profilePhoto || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // NEW STATE for aboutPhoto
    const [aboutUploading, setAboutUploading] = useState(false);
    const [aboutPreview, setAboutPreview] = useState<string | null>(settings?.aboutPhoto || null);
    const aboutFileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          form.setValue("profilePhoto", data.url);
          setPreview(data.url);
        }
      } catch (err) {
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    };

    // NEW: handle aboutPhoto upload
    const handleAboutFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setAboutUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          form.setValue("aboutPhoto", data.url);
          setAboutPreview(data.url);
        }
      } catch (err) {
        alert("Upload failed");
      } finally {
        setAboutUploading(false);
      }
    };

    const updateSettingsMutation = useMutation({
      mutationFn: async (data: any) => {
        return apiRequest("PATCH", "/api/admin/settings", data, token);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
        toast({ title: "Settings updated successfully! ⚙️" });
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => updateSettingsMutation.mutate(data))} className="space-y-4">
          {/* Profile Photo */}
          <FormField
            control={form.control}
            name="profilePhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="https://example.com/profile.jpg" />
                </FormControl>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="block text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600"
                  />
                  {uploading && <span className="text-xs text-pink-500">Uploading...</span>}
                </div>
                <div className="text-xs text-slate-400">
                  Upload foto profil atau masukkan URL. Ukuran yang disarankan: 400x400px
                </div>
                {preview && (
                  <img src={preview} alt="Profile Preview" className="mt-2 rounded-full w-20 h-20 border border-slate-700 object-cover" />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* About Me Photo */}
          <FormField
            control={form.control}
            name="aboutPhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About Me Photo</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="https://example.com/about-bg.jpg" />
                </FormControl>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={aboutFileInputRef}
                    onChange={handleAboutFileChange}
                    className="block text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600"
                  />
                  {aboutUploading && <span className="text-xs text-pink-500">Uploading...</span>}
                </div>
                <div className="text-xs text-slate-400">
                  Upload foto background About Me atau masukkan URL. Disarankan landscape, min 800x400px
                </div>
                {aboutPreview && (
                  <img src={aboutPreview} alt="About Me Preview" className="mt-2 rounded-md w-full max-w-xs border border-slate-700 object-cover" />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heroTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Title</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="Professional Full Stack Developer" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Judul utama di halaman hero. Contoh: "Professional Full Stack Developer", "Creative Web Designer"
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heroSubtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Subtitle</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-slate-800 border-slate-600" placeholder="Passionate about creating innovative web solutions with cutting-edge technologies" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Subtitle atau deskripsi singkat di bawah judul utama
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aboutDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-slate-800 border-slate-600" placeholder="I'm a passionate developer with 5+ years of experience in web development..." />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Deskripsi lengkap tentang diri Anda, pengalaman, dan keahlian
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="hello@example.com" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Email untuk kontak. Contoh: hello@example.com, contact@yourname.com
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="+62 812-3456-7890" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Nomor telepon dengan format internasional. Contoh: +62 812-3456-7890, +1 (555) 123-4567
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="Jakarta, Indonesia" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Lokasi atau kota tempat tinggal. Contoh: Jakarta, Indonesia, New York, USA
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="cosmic-btn" disabled={updateSettingsMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Form>
    );
  };

  const SocialLinkForm = ({ link, onSubmit }: { link?: SocialLink; onSubmit: (data: any) => void }) => {
    const form = useForm({
      defaultValues: {
        name: link?.name || "",
        icon: link?.icon || "fa-instagram",
        url: link?.url || "",
        order: link?.order || 0,
      },
    });
    const handleSubmit = (data: any) => {
      const processedData = {
        ...data,
        order: parseInt(data.order, 10) || 0,
      };
      onSubmit(processedData);
    };
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="GitHub" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Nama platform sosial media. Contoh: GitHub, LinkedIn, Instagram, Twitter, YouTube
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FontAwesome Icon</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input {...field} className="bg-slate-800 border-slate-600" placeholder="fa-github" />
                    <span className="text-xl">
                      <i className={`fab ${field.value}`}></i>
                    </span>
                  </div>
                </FormControl>
                <div className="text-xs text-slate-400">
                  Nama icon FontAwesome. Contoh: fa-github, fa-linkedin, fa-instagram, fa-twitter, fa-youtube
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" placeholder="https://t.me/username" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Masukkan link lengkap ke profil sosial media (misal: https://t.me/username, https://linkedin.com/in/username)
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="bg-slate-800 border-slate-600" placeholder="1" />
                </FormControl>
                <div className="text-xs text-slate-400">
                  Urutan tampilan (1 = pertama, 2 = kedua, dst). Contoh: 1, 2, 3, 4
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="cosmic-btn">
            <Save className="mr-2 h-4 w-4" />
            Save Link
          </Button>
        </form>
      </Form>
    );
  };

  const unreadMessagesCount = messages?.filter((msg) => !msg.read).length || 0;

  useEffect(() => {
    if (activeTab === "articles") {
      fetch("/api/articles")
        .then((res) => res.json())
        .then(setArticles);
    }
  }, [activeTab]);

  async function handleSaveArticle(data: Partial<Article>) {
    if (!data.title || !data.summary || !data.content) {
      alert('Title, summary, dan content wajib diisi!');
      return;
    }
    const method = editArticle ? "PATCH" : "POST";
    const url = editArticle ? `/api/admin/articles/${editArticle.id}` : "/api/admin/articles";
    const cleanData = {
      title: data.title,
      summary: data.summary,
      content: data.content,
      ...(data.image ? { image: data.image } : {}),
    };
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(cleanData),
    });
    if (res.ok) {
      setShowArticleForm(false);
      setEditArticle(null);
      fetch("/api/articles").then((r) => r.json()).then(setArticles);
    } else {
      const err = await res.json();
      alert('Gagal menyimpan artikel: ' + (err?.error || 'Unknown error'));
      console.error('Article save error:', err);
    }
  }

  async function handleDeleteArticle(id: number) {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/admin/articles/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    fetch("/api/articles").then((r) => r.json()).then(setArticles);
  }

  const SOCIAL_PLATFORMS = [
    { name: 'Instagram', icon: <Instagram className="text-pink-500" /> },
    { name: 'LinkedIn', icon: <Linkedin className="text-blue-600" /> },
    { name: 'GitHub', icon: <Github className="text-gray-800" /> },
    { name: 'Telegram', icon: <Send className="text-blue-400" /> },
    { name: 'YouTube', icon: <Youtube className="text-red-600" /> },
    { name: 'Facebook', icon: <Facebook className="text-blue-700" /> },
  ];

  function handleSaveSocialLinks(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    (async () => {
      for (const platform of SOCIAL_PLATFORMS) {
        const url = socialLinks.find(
          (l) => l.name.toLowerCase() === platform.name.toLowerCase()
        )?.url || "";
        const existing = socialLinks.find(
          (l) => l.name.toLowerCase() === platform.name.toLowerCase()
        );
        const data = {
          name: platform.name,
          icon: `fa-${platform.name.toLowerCase()}`,
          url,
          order: SOCIAL_PLATFORMS.findIndex((p) => p.name === platform.name) + 1,
        };
        if (url) {
          if (existing) {
            await fetch(`/api/admin/social-links/${existing.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(data),
            });
          } else {
            await fetch('/api/admin/social-links', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(data),
            });
          }
        } else if (existing) {
          await fetch(`/api/admin/social-links/${existing.id}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
        }
      }
      // Refresh
      fetch('/api/social-links').then(r => r.json()).then(setSocialLinks);
    })();
  }

  // Tambahkan fungsi ini di dalam komponen Dashboard
  function handleSocialLinkChange(name: string, url: string) {
    setSocialLinks((prev) => {
      const exists = prev.find((l) => l.name === name);
      if (exists) {
        return prev.map((l) => l.name === name ? { ...l, url } : l);
      } else {
        return [...prev, { name, url, icon: `fa-${name.toLowerCase()}`, order: 0 }];
      }
    });
  }

  async function handleSaveEducation(data: Partial<Education>) {
    if (!data.degree || !data.school || !data.yearStart || !data.yearEnd) {
      alert('Degree, school, year start, dan year end wajib diisi!');
      return;
    }
    const method = editEducation ? "PATCH" : "POST";
    const url = editEducation ? `/api/admin/education/${editEducation.id}` : "/api/admin/education";
    const cleanData = {
      degree: data.degree,
      school: data.school,
      yearStart: Number(data.yearStart),
      yearEnd: Number(data.yearEnd),
      description: data.description || "",
    };
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(cleanData),
    });
    if (res.ok) {
      setShowEducationForm(false);
      setEditEducation(null);
      fetch("/api/education").then((r) => r.json()).then(setEducations);
    } else {
      const err = await res.json();
      alert('Gagal menyimpan education: ' + (err?.error || 'Unknown error'));
      console.error('Education save error:', err);
    }
  }

  async function handleDeleteEducation(id: number) {
    if (!confirm("Delete this education?")) return;
    await fetch(`/api/admin/education/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    fetch("/api/education").then((r) => r.json()).then(setEducations);
  }

  // EducationForm
  const EducationForm = ({ education, onSave, onCancel }: { education?: Education | null, onSave: (data: Partial<Education>) => void, onCancel: () => void }) => {
    const form = useForm({
      resolver: zodResolver(insertEducationSchema.partial()),
      defaultValues: {
        degree: education?.degree || "",
        school: education?.school || "",
        yearStart: education?.yearStart || "",
        yearEnd: education?.yearEnd || "",
        description: education?.description || "",
      },
    });
    const handleSubmit = (data: any) => {
      // Convert year fields to numbers
      const processedData = {
        ...data,
        yearStart: parseInt(data.yearStart, 10) || 0,
        yearEnd: parseInt(data.yearEnd, 10) || 0,
      };
      onSave(processedData);
    };
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField control={form.control} name="degree" render={({ field }) => (
            <FormItem>
              <FormLabel>Degree *</FormLabel>
              <FormControl><Input {...field} placeholder="S1 Teknik Informatika" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="school" render={({ field }) => (
            <FormItem>
              <FormLabel>School *</FormLabel>
              <FormControl><Input {...field} placeholder="Universitas X" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="flex gap-2">
            <FormField control={form.control} name="yearStart" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Year Start *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder="2017" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="yearEnd" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Year End *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder="2021" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea {...field} placeholder="Deskripsi singkat pendidikan..." /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="cosmic-btn">Save</Button>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="orbitron text-2xl font-bold">Dashboard</h2>
          <p className="text-slate-400">Manage your cosmic portfolio</p>
        </div>
        <Button
          onClick={() => logout()}
          variant="outline"
          className="glassmorphism border-pink-500/30 hover:border-pink-500/50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-row flex-wrap w-full overflow-x-auto gap-x-4 gap-y-0 items-center glassmorphism">
          <TabsTrigger value="projects" className="flex flex-row items-center gap-2 px-4 py-2 bg-transparent border-none">
            <FolderOpen className="h-5 w-5" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex flex-row items-center gap-2 px-4 py-2 bg-transparent border-none">
            <DollarSign className="h-5 w-5" />
            <span>Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex flex-row items-center gap-2 px-4 py-2 bg-transparent border-none">
            <Zap className="h-5 w-5" />
            <span>Skills</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex flex-row items-center gap-2 px-4 py-2 bg-transparent border-none relative">
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
            {messages && messages.filter(m => !m.read).length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {messages.filter(m => !m.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex flex-row items-center gap-2 px-4 py-2 bg-transparent border-none">
            <span className="inline-block"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg></span>
            <span>Articles</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex flex-row items-center gap-2 px-4 py-2 bg-transparent border-none">
            <Calendar className="h-5 w-5" />
            <span>Activities</span>
          </TabsTrigger>
          <TabsTrigger value="social-links" className="flex flex-row items-center gap-2 px-4 py-2 bg-transparent border-none">
            <span className="inline-block"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10zm-2 7h-4m0 4h4"/></svg></span>
            <span>Social Links</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-row items-center gap-2 px-4 py-2 bg-transparent border-none">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex flex-row items-center gap-2 px-4 py-2 bg-transparent border-none">
            <Calendar className="h-5 w-5" />
            <span>Education</span>
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="orbitron text-xl font-bold">Projects Management</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="cosmic-btn">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <ProjectForm
                    onSubmit={(data) => createProjectMutation.mutate(data)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {projects?.map((project) => (
                <motion.div
                  key={project.id}
                  className="cosmic-card p-4 rounded-lg"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{project.title}</h4>
                        {project.featured && <Badge variant="secondary">Featured</Badge>}
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {(
                          Array.isArray(project.technologies)
                            ? project.technologies
                            : JSON.parse(project.technologies)
                        ).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Project</DialogTitle>
                          </DialogHeader>
                          <ProjectForm
                            project={project}
                            onSubmit={(data) =>
                              updateProjectMutation.mutate({
                                id: project.id,
                                data,
                              })
                            }
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteProjectMutation.mutate(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="orbitron text-xl font-bold">Skills Management</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="cosmic-btn">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Skill</DialogTitle>
                  </DialogHeader>
                  <SkillForm
                    onSubmit={(data) => createSkillMutation.mutate(data)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {skills?.map((skill) => (
                <motion.div
                  key={skill.id}
                  className="cosmic-card p-4 rounded-lg"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <i className={skill.icon}></i>
                        <h4 className="font-semibold">{skill.name}</h4>
                        <Badge>{skill.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-400"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <span className="text-sm text-pink-500">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Skill</DialogTitle>
                          </DialogHeader>
                          <SkillForm
                            skill={skill}
                            onSubmit={(data) =>
                              updateSkillMutation.mutate({
                                id: skill.id,
                                data,
                              })
                            }
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteSkillMutation.mutate(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="orbitron text-xl font-bold">Activities Management</h3>
              <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
                <DialogTrigger asChild>
                  <Button className="cosmic-btn" onClick={() => setShowActivityDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Activity</DialogTitle>
                  </DialogHeader>
                  <ActivityForm
                    onSubmit={(data) => createActivityMutation.mutate(data)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {activities?.map((activity) => (
                <motion.div
                  key={activity.id}
                  className="cosmic-card p-4 rounded-lg"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <i className={activity.icon}></i>
                        <h4 className="font-semibold">{activity.title}</h4>
                        <Badge variant="outline">{activity.frequency}</Badge>
                      </div>
                      <p className="text-slate-400 text-sm">{activity.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={showEditActivityDialog === activity.id} onOpenChange={(open) => setShowEditActivityDialog(open ? activity.id : null)}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => setShowEditActivityDialog(activity.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Activity</DialogTitle>
                          </DialogHeader>
                          <ActivityForm
                            activity={activity}
                            onSubmit={(data) =>
                              updateActivityMutation.mutate({
                                id: activity.id,
                                data,
                              })
                            }
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteActivityMutation.mutate(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="orbitron text-xl font-bold">Pricing Management</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="cosmic-btn">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Pricing Plan</DialogTitle>
                  </DialogHeader>
                  <PricingForm
                    onSubmit={(data) => createPricingMutation.mutate(data)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {pricingPlans?.map((plan) => (
                <motion.div
                  key={plan.id}
                  className="cosmic-card p-4 rounded-lg"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{plan.name}</h4>
                        <span className="text-pink-500 font-bold">${plan.price.toLocaleString()}</span>
                        <span className="text-slate-400">/ {plan.duration}</span>
                        {plan.popular === 1 && <Badge>Popular</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(
                          Array.isArray(plan.features)
                            ? plan.features
                            : JSON.parse(plan.features)
                        ).slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {(
                          Array.isArray(plan.features)
                            ? plan.features
                            : JSON.parse(plan.features)
                        ).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(
                              Array.isArray(plan.features)
                                ? plan.features
                                : JSON.parse(plan.features)
                            ).length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Pricing Plan</DialogTitle>
                          </DialogHeader>
                          <PricingForm
                            plan={plan}
                            onSubmit={(data) =>
                              updatePricingMutation.mutate({
                                id: plan.id,
                                data,
                              })
                            }
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deletePricingMutation.mutate(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="orbitron text-xl font-bold">Contact Messages</h3>
              <div className="text-sm text-slate-400">
                {unreadMessagesCount} unread message{unreadMessagesCount !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid gap-4">
              {messages?.map((message) => (
                <motion.div
                  key={message.id}
                  className={`cosmic-card p-4 rounded-lg ${
                    !message.read ? "border-pink-500/50" : ""
                  }`}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{message.name}</h4>
                        <span className="text-slate-400 text-sm">{message.email}</span>
                        {!message.read && <Badge variant="destructive">New</Badge>}
                      </div>
                      <h5 className="font-medium mb-2">{message.subject}</h5>
                      <p className="text-slate-400 text-sm mb-2">{message.message}</p>
                      <span className="text-xs text-slate-500">
                        {message.createdAt ? new Date(message.createdAt * 1000).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {!message.read && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => markAsReadMutation.mutate(message.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMessageMutation.mutate(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <h3 className="orbitron text-xl font-bold">Site Settings</h3>
            <div className="cosmic-card p-6 rounded-lg">
              <SettingsForm />
            </div>
          </div>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social-links">
          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="cosmic-card p-8 rounded-2xl">
              <h2 className="orbitron text-2xl font-bold text-pink-500 mb-6">Social Links</h2>
              <form onSubmit={handleSaveSocialLinks} className="space-y-6">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <div key={platform.name} className="flex items-center gap-4 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {platform.icon}
                    </div>
                    <label className="w-32 font-medium text-slate-300">{platform.name}</label>
                    <Input
                      type="url"
                      className="flex-1 bg-slate-800 border-slate-600"
                      placeholder={`Enter ${platform.name} URL`}
                      value={socialLinks.find(
                        (l) => l.name.toLowerCase() === platform.name.toLowerCase()
                      )?.url || ""}
                      onChange={(e) => handleSocialLinkChange(platform.name, e.target.value)}
                    />
                  </div>
                ))}
                <div className="flex justify-end mt-6">
                  <Button type="submit" className="cosmic-btn px-8 py-2 font-medium">Save All</Button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>

        {/* Articles Tab */}
        <TabsContent value="articles">
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="orbitron text-2xl font-bold text-pink-500">Articles</h2>
              <Button onClick={() => { setEditArticle(null); setShowArticleForm(true); }} className="cosmic-btn">+ Add Article</Button>
            </div>
            <div className="cosmic-card p-8 rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>{article.summary}</TableCell>
                      <TableCell>{article.createdAt ? new Date(article.createdAt * 1000).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => { setEditArticle(article); setShowArticleForm(true); }}><Edit className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteArticle(article.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Tambahkan Dialog untuk ArticleForm */}
            {showArticleForm && (
              <Dialog open={showArticleForm} onOpenChange={setShowArticleForm}>
                <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editArticle ? "Edit Article" : "Add Article"}</DialogTitle>
                  </DialogHeader>
                  <ArticleForm
                    article={editArticle}
                    onSave={handleSaveArticle}
                    onCancel={() => setShowArticleForm(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="orbitron text-xl font-bold">Education Management</h3>
              <Dialog open={showEducationForm} onOpenChange={setShowEducationForm}>
                <DialogTrigger asChild>
                  <Button className="cosmic-btn" onClick={() => { setEditEducation(null); setShowEducationForm(true); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Education
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editEducation ? "Edit Education" : "Add Education"}</DialogTitle>
                  </DialogHeader>
                  <EducationForm
                    education={editEducation}
                    onSave={handleSaveEducation}
                    onCancel={() => setShowEducationForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {educations?.map((edu) => (
                <motion.div key={edu.id} className="cosmic-card p-4 rounded-lg" whileHover={{ y: -2 }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-pink-500">{edu.degree}</h4>
                        <span className="text-slate-300">— {edu.school}</span>
                        <Badge>{edu.yearStart}–{edu.yearEnd}</Badge>
                      </div>
                      <div className="text-slate-400 text-sm mb-2">{edu.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={showEducationForm && editEducation?.id === edu.id} onOpenChange={(open) => { setShowEducationForm(open); setEditEducation(open ? edu : null); }}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => { setEditEducation(edu); setShowEducationForm(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism border-pink-500/30 max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Education</DialogTitle>
                          </DialogHeader>
                          <EducationForm
                            education={edu}
                            onSave={handleSaveEducation}
                            onCancel={() => setShowEducationForm(false)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteEducation(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function ArticleForm({ article, onSave, onCancel }: { article: Partial<Article> | null, onSave: (data: Partial<Article>) => void, onCancel: () => void }) {
  const [title, setTitle] = useState(article?.title || "");
  const [summary, setSummary] = useState(article?.summary || "");
  const [content, setContent] = useState(article?.content || "");
  const [image, setImage] = useState(article?.image || "");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(article?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImage(data.url);
        setPreview(data.url);
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ title, summary, content, image });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h3 className="text-xl font-bold text-pink-500 mb-2">{article ? "Edit Article" : "Add Article"}</h3>
      <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <Textarea placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required rows={2} />
      <Textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required rows={6} />
      <div>
        <Input placeholder="Image URL (optional)" value={image} onChange={e => setImage(e.target.value)} />
        <div className="flex items-center gap-2 mt-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600"
          />
          {uploading && <span className="text-xs text-pink-500">Uploading...</span>}
        </div>
        {preview && (
          <img src={preview} alt="Preview" className="mt-2 rounded-md max-h-32 border border-slate-700" />
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="cosmic-btn">Save</Button>
      </div>
    </form>
  );
}
