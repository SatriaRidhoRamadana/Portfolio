import { useState } from "react";
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
} from "@shared/schema";
import { z } from "zod";

export default function Dashboard() {
  const { logout, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("projects");
  const [editingItem, setEditingItem] = useState<number | null>(null);

  // Fetch data
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: skills } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: pricingPlans } = useQuery<PricingPlan[]>({
    queryKey: ["/api/pricing"],
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
  });

  // Generic mutation function
  const createMutation = (endpoint: string, queryKey: string[]) =>
    useMutation({
      mutationFn: async (data: any) => {
        return apiRequest("POST", endpoint, data, token);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast({ title: "Item created successfully! 🚀" });
        setEditingItem(null);
      },
      onError: () => {
        toast({
          title: "Creation failed",
          description: "Please try again.",
          variant: "destructive",
        });
      },
    });

  const updateMutation = (endpoint: string, queryKey: string[]) =>
    useMutation({
      mutationFn: async ({ id, data }: { id: number; data: any }) => {
        return apiRequest("PATCH", `${endpoint}/${id}`, data, token);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast({ title: "Item updated successfully! ✨" });
        setEditingItem(null);
      },
      onError: () => {
        toast({
          title: "Update failed",
          description: "Please try again.",
          variant: "destructive",
        });
      },
    });

  const deleteMutation = (endpoint: string, queryKey: string[]) =>
    useMutation({
      mutationFn: async (id: number) => {
        return apiRequest("DELETE", `${endpoint}/${id}`, undefined, token);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast({ title: "Item deleted successfully! 🗑️" });
      },
      onError: () => {
        toast({
          title: "Deletion failed",
          description: "Please try again.",
          variant: "destructive",
        });
      },
    });

  // Message actions
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/admin/messages/${id}/read`, undefined, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });

  const deleteMessageMutation = deleteMutation("/api/admin/messages", ["/api/admin/messages"]);

  // Forms
  const ProjectForm = ({ project, onSubmit }: { project?: Project; onSubmit: (data: any) => void }) => {
    const form = useForm({
      resolver: zodResolver(insertProjectSchema),
      defaultValues: {
        title: project?.title || "",
        description: project?.description || "",
        image: project?.image || "",
        technologies: project?.technologies || [],
        liveUrl: project?.liveUrl || "",
        githubUrl: project?.githubUrl || "",
        featured: project?.featured || false,
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => field.onChange(e.target.value.split(", ").filter(Boolean))}
                    className="bg-slate-800 border-slate-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
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
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
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
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                  </SelectContent>
                </Select>
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
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon (Font Awesome class)</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
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
    const form = useForm({
      resolver: zodResolver(insertActivitySchema),
      defaultValues: {
        title: activity?.title || "",
        description: activity?.description || "",
        frequency: activity?.frequency || "",
        icon: activity?.icon || "",
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon (Font Awesome class)</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="cosmic-btn">
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
        features: plan?.features || [],
        popular: plan?.popular || false,
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features (comma-separated)</FormLabel>
                <FormControl>
                  <Textarea
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => field.onChange(e.target.value.split(", ").filter(Boolean))}
                    className="bg-slate-800 border-slate-600"
                  />
                </FormControl>
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
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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
      },
    });

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
          <FormField
            control={form.control}
            name="heroTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Title</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
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
                  <Textarea {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
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
                  <Textarea {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
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
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
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
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
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
                  <Input {...field} className="bg-slate-800 border-slate-600" />
                </FormControl>
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

  const unreadMessagesCount = messages?.filter((msg) => !msg.read).length || 0;

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
        <TabsList className="grid w-full grid-cols-6 glassmorphism">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
            {unreadMessagesCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                {unreadMessagesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
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
                <DialogContent className="glassmorphism border-pink-500/30 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <ProjectForm
                    onSubmit={(data) => createMutation("/api/admin/projects", ["/api/projects"]).mutate(data)}
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
                        {project.technologies.map((tech) => (
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
                        <DialogContent className="glassmorphism border-pink-500/30 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Project</DialogTitle>
                          </DialogHeader>
                          <ProjectForm
                            project={project}
                            onSubmit={(data) =>
                              updateMutation("/api/admin/projects", ["/api/projects"]).mutate({
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
                        onClick={() => deleteMutation("/api/admin/projects", ["/api/projects"]).mutate(project.id)}
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
                <DialogContent className="glassmorphism border-pink-500/30">
                  <DialogHeader>
                    <DialogTitle>Create New Skill</DialogTitle>
                  </DialogHeader>
                  <SkillForm
                    onSubmit={(data) => createMutation("/api/admin/skills", ["/api/skills"]).mutate(data)}
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
                        <DialogContent className="glassmorphism border-pink-500/30">
                          <DialogHeader>
                            <DialogTitle>Edit Skill</DialogTitle>
                          </DialogHeader>
                          <SkillForm
                            skill={skill}
                            onSubmit={(data) =>
                              updateMutation("/api/admin/skills", ["/api/skills"]).mutate({
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
                        onClick={() => deleteMutation("/api/admin/skills", ["/api/skills"]).mutate(skill.id)}
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="cosmic-btn">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism border-pink-500/30">
                  <DialogHeader>
                    <DialogTitle>Create New Activity</DialogTitle>
                  </DialogHeader>
                  <ActivityForm
                    onSubmit={(data) => createMutation("/api/admin/activities", ["/api/activities"]).mutate(data)}
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism border-pink-500/30">
                          <DialogHeader>
                            <DialogTitle>Edit Activity</DialogTitle>
                          </DialogHeader>
                          <ActivityForm
                            activity={activity}
                            onSubmit={(data) =>
                              updateMutation("/api/admin/activities", ["/api/activities"]).mutate({
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
                        onClick={() => deleteMutation("/api/admin/activities", ["/api/activities"]).mutate(activity.id)}
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
                <DialogContent className="glassmorphism border-pink-500/30">
                  <DialogHeader>
                    <DialogTitle>Create New Pricing Plan</DialogTitle>
                  </DialogHeader>
                  <PricingForm
                    onSubmit={(data) => createMutation("/api/admin/pricing", ["/api/pricing"]).mutate(data)}
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
                        {plan.popular && <Badge>Popular</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {plan.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{plan.features.length - 3} more
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
                        <DialogContent className="glassmorphism border-pink-500/30">
                          <DialogHeader>
                            <DialogTitle>Edit Pricing Plan</DialogTitle>
                          </DialogHeader>
                          <PricingForm
                            plan={plan}
                            onSubmit={(data) =>
                              updateMutation("/api/admin/pricing", ["/api/pricing"]).mutate({
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
                        onClick={() => deleteMutation("/api/admin/pricing", ["/api/pricing"]).mutate(plan.id)}
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
                        {new Date(message.createdAt!).toLocaleDateString()}
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
      </Tabs>
    </motion.div>
  );
}
