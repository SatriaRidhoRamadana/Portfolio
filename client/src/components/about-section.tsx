import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings, Project } from "@shared/schema";

export default function AboutSection() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

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

  return (
    <section id="about" className="py-20 relative">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="cosmic-text-gradient">About Me</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Professional web developer with expertise in modern technologies
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div className="cosmic-card p-8 rounded-2xl" variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-6 text-pink-500">Professional Background</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              {settings?.aboutDescription || 
                "As a dedicated fullstack developer, I specialize in creating robust, scalable web applications using modern technologies. With expertise in both frontend and backend development, I deliver high-quality solutions that meet business requirements and provide excellent user experiences."
              }
            </p>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-pink-500">
                  {projects?.length || 0}+
                </div>
                <div className="text-sm text-slate-400">Projects Launched</div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-pink-500">3+</div>
                <div className="text-sm text-slate-400">Years Experience</div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div className="relative" variants={itemVariants}>
            <div className="cosmic-card p-8 rounded-2xl text-center">
              <motion.div 
                className="w-32 h-32 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                }}
                transition={{ 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <UserCheck className="text-4xl text-white" size={48} />
              </motion.div>
              <h4 className="text-xl font-bold mb-2">Senior Developer</h4>
              <p className="text-slate-400">Building exceptional web applications</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
