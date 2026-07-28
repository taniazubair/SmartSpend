import { motion } from "framer-motion";
import {
  FiCreditCard,
  FiTarget,
  FiPieChart,
  FiDownload,
  FiShield,
  FiTrendingUp,
  FiArrowUpRight,
} from "react-icons/fi";

const features = [
  {
    icon: FiCreditCard,
    title: "Expense Tracking",
    description:
      "Quickly add, edit and organise your daily expenses in one place with smart categorisation.",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    glow: "group-hover:shadow-blue-500/20",
    border: "group-hover:border-blue-200",
  },
  {
    icon: FiTarget,
    title: "Budget Management",
    description:
      "Create monthly budgets and stay in control of your spending with real-time alerts.",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    glow: "group-hover:shadow-emerald-500/20",
    border: "group-hover:border-emerald-200",
  },
  {
    icon: FiTrendingUp,
    title: "Savings Goals",
    description:
      "Set financial goals and monitor your progress with visual milestones and projections.",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
    glow: "group-hover:shadow-violet-500/20",
    border: "group-hover:border-violet-200",
  },
  {
    icon: FiPieChart,
    title: "Analytics Dashboard",
    description:
      "Understand your spending through interactive charts, trends and actionable insights.",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
    glow: "group-hover:shadow-amber-500/20",
    border: "group-hover:border-amber-200",
  },
  {
    icon: FiDownload,
    title: "PDF Export",
    description:
      "Export your expense reports anytime in beautifully formatted PDF documents.",
    gradient: "from-rose-500 to-pink-600",
    bgGradient: "from-rose-50 to-pink-50",
    glow: "group-hover:shadow-rose-500/20",
    border: "group-hover:border-rose-200",
  },
  {
    icon: FiShield,
    title: "Secure Authentication",
    description:
      "Email verification, password reset and encrypted authentication for your safety.",
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-50 to-blue-50",
    glow: "group-hover:shadow-cyan-500/20",
    border: "group-hover:border-cyan-200",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold uppercase tracking-wider mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Features
          </motion.span>

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Everything You Need To{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Manage Your Money
            </span>
          </h2>

          <p className="text-slate-500 mt-5 max-w-2xl mx-auto text-lg leading-relaxed">
            SmartSpend provides all the essential tools to track expenses,
            control budgets, analyse spending habits and achieve savings goals.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative"
              >
                <div
                  className={`relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl ${feature.glow} ${feature.border} transition-all duration-500 overflow-hidden`}
                >
                  {/* Hover Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Top Right Arrow */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <FiArrowUpRight className="text-slate-600 w-4 h-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-6 ring-1 ring-slate-900/5 group-hover:ring-0 transition-all duration-300`}
                    >
                      <Icon
                        size={28}
                        className={`bg-gradient-to-br ${feature.gradient} bg-clip-text`}
                        style={{
                          color:
                            index === 0
                              ? "#3b82f6"
                              : index === 1
                              ? "#10b981"
                              : index === 2
                              ? "#8b5cf6"
                              : index === 3
                              ? "#f59e0b"
                              : index === 4
                              ? "#f43f5e"
                              : "#06b6d4",
                        }}
                      />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-500 leading-relaxed text-[15px] group-hover:text-slate-600 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Bottom Accent Line */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;