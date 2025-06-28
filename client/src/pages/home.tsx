import Navigation from "@/components/navigation";
import GalaxyBackground from "@/components/galaxy-background";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SkillsSection from "@/components/skills-section";
import ProjectsSection from "@/components/projects-section";
import ActivitiesSection from "@/components/activities-section";
import PricingSection from "@/components/pricing-section";
import ArticlesSection from "@/components/articles-section";
import ContactSection from "@/components/contact-section";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen text-slate-100 cosmic-bg">
      <GalaxyBackground />
      <Navigation />
      
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ActivitiesSection />
        <PricingSection />
        <ArticlesSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              className="orbitron text-xl font-bold text-pink-500 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              &lt;CosmicDev/&gt;
            </motion.div>
            <p className="text-slate-400 mb-6">
              Exploring the infinite possibilities of web development
            </p>
            <p className="text-slate-500 text-sm">
              © 2024 Cosmic Developer. All rights reserved across all galaxies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
