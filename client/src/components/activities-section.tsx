import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Activity } from "@shared/schema";

export default function ActivitiesSection() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const iconGradients = [
    "from-pink-500 to-blue-400",
    "from-blue-400 to-purple-500",
    "from-green-400 to-blue-500",
    "from-yellow-400 to-orange-500",
  ];

  if (isLoading) {
    return (
      <section id="activities" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="orbitron text-3xl sm:text-4xl font-bold mb-4">
              <span className="cosmic-text-gradient">Mission Activities</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="cosmic-card p-6 rounded-xl animate-pulse">
                <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-slate-700 rounded mb-2"></div>
                <div className="h-12 bg-slate-700 rounded mb-3"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="activities" className="py-20 relative">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-16" variants={cardVariants}>
          <h2 className="orbitron text-3xl sm:text-4xl font-bold mb-4">
            <span className="cosmic-text-gradient">Mission Activities</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Exploring new frontiers and sharing knowledge across the cosmos
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {activities?.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="cosmic-card p-6 rounded-xl text-center group"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -1, 1, 0],
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                rotate: { duration: 0.5 }
              }}
            >
              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${iconGradients[index % iconGradients.length]} rounded-full mx-auto mb-4 flex items-center justify-center`}
                whileHover={{ 
                  rotate: 360,
                  scale: 1.1
                }}
                transition={{ duration: 0.6 }}
              >
                <i className={`${activity.icon} text-2xl text-white`}></i>
              </motion.div>
              
              <h3 className="orbitron text-lg font-bold mb-2">{activity.title}</h3>
              <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                {activity.description}
              </p>
              <motion.div 
                className="text-pink-500 font-semibold text-sm"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {activity.frequency}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
