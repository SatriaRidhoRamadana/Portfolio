import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema } from "@shared/schema";
import type { SiteSettings } from "@shared/schema";
import { z } from "zod";

const contactFormSchema = insertContactMessageSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully! 🚀",
        description: "Your cosmic transmission has been received. I'll respond soon!",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
    onError: (error) => {
      toast({
        title: "Transmission Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", color: "bg-blue-600" },
    { icon: Github, href: "#", color: "bg-gray-800" },
    { icon: Twitter, href: "#", color: "bg-blue-400" },
    { icon: Youtube, href: "#", color: "bg-red-600" },
  ];

  return (
    <section id="contact" className="py-20 relative">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="cosmic-text-gradient">Contact Information</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Ready to start your project? Let's get in touch to discuss your requirements.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="cosmic-card p-6 rounded-xl">
              <h3 className="orbitron text-xl font-bold mb-6">Mission Control</h3>
              <div className="space-y-4">
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-slate-400">{settings?.email || "cosmic@developer.space"}</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-slate-400">{settings?.phone || "+1 (555) 123-SPACE"}</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-slate-400">{settings?.location || "Digital Universe"}</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Social Links */}
            <motion.div className="cosmic-card p-6 rounded-xl" variants={itemVariants}>
              <h3 className="orbitron text-xl font-bold mb-6">Social Channels</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 ${social.color} rounded-lg flex items-center justify-center`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 360 
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400,
                      rotate: { duration: 0.6 }
                    }}
                  >
                    <social.icon className="text-white" size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div className="cosmic-card p-8 rounded-xl" variants={itemVariants}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your cosmic name"
                          className="bg-slate-800 border-slate-600 focus:ring-pink-500 focus:border-pink-500"
                          {...field}
                        />
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
                        <Input
                          type="email"
                          placeholder="your@email.space"
                          className="bg-slate-800 border-slate-600 focus:ring-pink-500 focus:border-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mission subject"
                          className="bg-slate-800 border-slate-600 focus:ring-pink-500 focus:border-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Describe your cosmic project..."
                          className="bg-slate-800 border-slate-600 focus:ring-pink-500 focus:border-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full cosmic-btn py-3 font-medium group"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Send className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Send className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  )}
                  {contactMutation.isPending ? "Launching..." : "Launch Message"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
