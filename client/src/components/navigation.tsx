import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we're on the admin page
  const isAdminPage = window.location.pathname === '/admin';

  const navItems = [
    { href: isAdminPage ? "/" : "#home", label: "Home" },
    { href: isAdminPage ? "/#about" : "#about", label: "About" },
    { href: isAdminPage ? "/#skills" : "#skills", label: "Skills" },
    { href: isAdminPage ? "/#projects" : "#projects", label: "Projects" },
    { href: isAdminPage ? "/#activities" : "#activities", label: "Activities" },
    { href: isAdminPage ? "/#pricing" : "#pricing", label: "Pricing" },
    { href: isAdminPage ? "/#articles" : "#articles", label: "Articles" },
    { href: isAdminPage ? "/#contact" : "#contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href={isAdminPage ? "/" : "#home"} className="orbitron text-xl font-bold text-white">
              Portfolio
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={e => {
                    if (item.href.startsWith('#')) {
                      e.preventDefault();
                      const el = document.querySelector(item.href);
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 70; // 70px offset for navbar
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }
                  }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button
                  asChild
                  className="cosmic-btn"
                >
                  <a href="/admin">Dashboard</a>
                </Button>
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="text-slate-300 hover:text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                asChild
                className="cosmic-btn"
              >
                <a href="/admin">Admin</a>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              className="text-slate-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-700">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Button
                    asChild
                    className="cosmic-btn w-full"
                  >
                    <a href="/admin">Dashboard</a>
                  </Button>
                  <Button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="text-slate-300 hover:text-white w-full"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  className="cosmic-btn w-full"
                >
                  <a href="/admin">Admin</a>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
