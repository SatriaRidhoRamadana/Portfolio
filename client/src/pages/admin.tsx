import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import GalaxyBackground from "@/components/galaxy-background";
import LoginForm from "@/components/admin/login-form";
import Dashboard from "@/components/admin/dashboard";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen text-slate-100 cosmic-bg">
      <GalaxyBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="orbitron text-3xl sm:text-4xl font-bold mb-4">
                <span className="cosmic-text-gradient">
                  Mission Control Center
                </span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Administrative dashboard for managing cosmic content
              </p>
            </motion.div>

            {!isAuthenticated ? <LoginForm /> : <Dashboard />}
          </div>
        </section>
      </main>
    </div>
  );
}
