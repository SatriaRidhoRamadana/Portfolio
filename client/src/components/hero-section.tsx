import { motion } from "framer-motion";
import { Rocket, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@shared/schema";

export default function HeroSection() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
    queryFn: () => fetch("/api/settings").then(res => res.json()),
  });

  const handleExploreProjects = () => {
    const element = document.querySelector("#projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden cosmic-bg">
      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="animate-float"
        >
          {/* Profile Photo */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            <div className="relative">
              {settings?.profilePhoto ? (
                <img
                  src={settings.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-pink-500/30 shadow-2xl shadow-pink-500/20 object-cover"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-pink-500/30 shadow-2xl shadow-pink-500/20 bg-slate-700 flex items-center justify-center">
                  <User className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 animate-pulse"></div>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="cosmic-text-gradient">
              {settings?.heroTitle || "Professional Developer"}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-slate-300 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {settings?.heroSubtitle || "Building modern web applications with cutting-edge technologies"}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={handleExploreProjects}
              className="cosmic-btn px-8 py-4 text-lg font-medium group"
            >
              <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Explore Projects
            </Button>
            
            <Button
              onClick={handleContact}
              variant="outline"
              className="glassmorphism px-8 py-4 text-lg font-medium border-pink-500/30 hover:border-pink-500/50 group"
            >
              <Mail className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Get In Touch
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      >
        <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse-glow"></div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 right-16"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      >
        <div className="w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
      </motion.div>
    </section>
  );
}
