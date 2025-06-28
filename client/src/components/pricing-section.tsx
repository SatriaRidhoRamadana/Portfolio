import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { PricingPlan } from "@shared/schema";

export default function PricingSection() {
  const { data: pricingPlans, isLoading } = useQuery<PricingPlan[]>({
    queryKey: ["/api/pricing"],
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

  const handleChoosePlan = (planName: string) => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="orbitron text-3xl sm:text-4xl font-bold mb-4">
              <span className="cosmic-text-gradient">Mission Pricing</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="cosmic-card p-8 rounded-2xl animate-pulse">
                <div className="h-32 bg-slate-700 rounded mb-6"></div>
                <div className="space-y-3 mb-8">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-slate-700 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 relative">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-16" variants={cardVariants}>
          <h2 className="orbitron text-3xl sm:text-4xl font-bold mb-4">
            <span className="cosmic-text-gradient">Mission Pricing</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose your cosmic development package for interstellar success
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {pricingPlans?.map((plan) => (
            <motion.div
              key={plan.id}
              className={`cosmic-card p-8 rounded-2xl relative ${
                plan.popular ? "border-2 border-pink-500" : ""
              }`}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="bg-pink-500 px-4 py-1 rounded-full text-sm font-medium text-white">
                    Most Popular
                  </span>
                </motion.div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="orbitron text-xl font-bold mb-2">{plan.name}</h3>
                <motion.div
                  className="text-3xl font-bold text-pink-500 mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  ${plan.price.toLocaleString()}
                </motion.div>
                <p className="text-slate-400 text-sm">{plan.duration}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Check className="text-green-400 mr-3 h-4 w-4 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              <Button
                className={`w-full py-3 font-medium transition-all ${
                  plan.popular
                    ? "cosmic-btn"
                    : "glassmorphism border border-pink-500/30 hover:border-pink-500/50"
                }`}
                onClick={() => handleChoosePlan(plan.name)}
              >
                Choose Plan
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
