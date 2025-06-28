import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings, Project, Education } from "@shared/schema";

export default function AboutSection() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
    queryFn: () => fetch("/api/settings").then(res => res.json()),
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: () => fetch("/api/projects").then(res => res.json()),
  });

  const { data: educations } = useQuery<Education[]>({
    queryKey: ["/api/education"],
    queryFn: () => fetch("/api/education").then(res => res.json()),
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
            <div className="grid grid-cols-2 gap-4 mb-8">
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
            {/* Education Section */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-blue-400 mb-2">Education</h4>
              <ul className="space-y-2">
                {educations && educations.length > 0 ? (
                  educations.map((edu) => (
                    <li key={edu.id} className="bg-slate-800/70 rounded-lg px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="font-medium text-slate-200">{edu.degree}</span>
                      <span className="text-slate-400">{edu.school}</span>
                      <span className="text-slate-500 text-sm">{edu.yearStart} - {edu.yearEnd}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="bg-slate-800/70 rounded-lg px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="font-medium text-slate-200">S1 Teknik Informatika</span>
                      <span className="text-slate-400">Universitas X</span>
                      <span className="text-slate-500 text-sm">2017 - 2021</span>
                    </li>
                    <li className="bg-slate-800/70 rounded-lg px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="font-medium text-slate-200">SMA IPA</span>
                      <span className="text-slate-400">SMA Negeri Y</span>
                      <span className="text-slate-500 text-sm">2014 - 2017</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
          
          <motion.div className="relative" variants={itemVariants}>
            <div className="cosmic-card p-0 rounded-2xl text-center overflow-hidden h-full min-h-[320px] flex items-center justify-center">
              {settings?.aboutPhoto ? (
                <img
                  src={settings.aboutPhoto}
                  alt="About Me Photo"
                  className="w-full h-full object-cover"
                />
              ) : settings?.profilePhoto ? (
                <img
                  src={settings.profilePhoto}
                  alt="Profile Photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[320px] flex items-center justify-center bg-gradient-to-br from-pink-500 to-blue-500">
                  <span className="text-white text-6xl font-bold opacity-60">No Photo</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
