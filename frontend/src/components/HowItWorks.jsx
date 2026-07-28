import { motion } from "framer-motion";
import {
  FiUserPlus,
  FiCreditCard,
  FiTrendingUp,
  FiArrowRight,
} from "react-icons/fi";

const steps = [
  {
    icon: FiUserPlus,
    title: "Create an Account",
    description:
      "Sign up securely, verify your email and access your personal finance dashboard.",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    shadow: "shadow-blue-500/25",
  },
  {
    icon: FiCreditCard,
    title: "Track Your Finances",
    description:
      "Add expenses, create budgets and set savings goals to organize your money.",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    shadow: "shadow-emerald-500/25",
  },
  {
    icon: FiTrendingUp,
    title: "Analyze & Grow",
    description:
      "View spending insights, export reports and make smarter financial decisions.",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
    shadow: "shadow-violet-500/25",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/80 to-white" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            How It Works
          </motion.span>

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-6 tracking-tight">
            Get Started in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Three Steps
            </span>
          </h2>

          <p className="text-slate-500 mt-5 max-w-2xl mx-auto text-lg leading-relaxed">
            SmartSpend makes managing your finances simple, fast and secure with
            an intuitive workflow designed for everyone.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12 relative"
        >
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-violet-200" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="relative group"
              >
                <div
                  className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-xl ${step.shadow} hover:shadow-2xl transition-all duration-500 h-full`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center text-lg font-bold shadow-lg ring-4 ring-white`}
                    >
                      {index + 1}
                    </motion.div>
                  </div>

                  {/* Icon Container */}
                  <div className="mt-6 mb-6 flex justify-center">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.bgGradient} flex items-center justify-center ring-1 ring-slate-900/5`}
                    >
                      <Icon
                        size={32}
                        className={`bg-gradient-to-br ${step.gradient} bg-clip-text`}
                        style={{
                          color:
                            index === 0
                              ? "#3b82f6"
                              : index === 1
                              ? "#10b981"
                              : "#8b5cf6",
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {step.title}
                    </h3>

                    <p className="text-slate-500 leading-relaxed text-[15px]">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow indicator (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2 z-20">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-slate-400"
                      >
                        <FiArrowRight size={18} />
                      </motion.div>
                    </div>
                  )}

                  {/* Hover Gradient Glow */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;