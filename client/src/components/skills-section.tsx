import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Skill } from "@shared/schema";

export default function SkillsSection() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
    queryFn: () => fetch("/api/skills").then(res => res.json()),
  });

  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) || {};

  const categoryIcons = {
    Frontend: "fab fa-react",
    Backend: "fab fa-node-js", 
    Database: "fas fa-database",
  };

  const categoryColors = {
    Frontend: "bg-blue-500",
    Backend: "bg-green-500",
    Database: "bg-purple-500",
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  if (isLoading) {
    return (
      <section id="skills" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="orbitron text-3xl sm:text-4xl font-bold mb-4">
              <span className="cosmic-text-gradient">Technical Arsenal</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="cosmic-card p-6 rounded-xl animate-pulse">
                <div className="h-32 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 relative">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-16" variants={cardVariants}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="cosmic-text-gradient">Technical Skills</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Professional expertise in modern web development technologies
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <motion.div
              key={category}
              className="cosmic-card p-6 rounded-xl group"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${categoryColors[category as keyof typeof categoryColors]} rounded-lg flex items-center justify-center mr-4`}>
                  <i className={`${categoryIcons[category as keyof typeof categoryIcons]} text-xl text-white`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <p className="text-sm text-slate-400">
                    {category === "Frontend" && "User Interface"}
                    {category === "Backend" && "Server Side"}
                    {category === "Database" && "Data Management"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center">
                      <span>{skill.name}</span>
                      <span className="text-pink-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
