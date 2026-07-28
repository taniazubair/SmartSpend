import { motion } from "framer-motion";
import { FiCheckCircle, FiTrendingUp, FiShield } from "react-icons/fi";

const benefits = [
  "Track every expense in seconds",
  "Stay within your monthly budget",
  "Visual dashboard with spending analytics",
  "Set and achieve savings goals",
  "Export expense reports as PDF",
  "Secure authentication with email verification",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-slate-50" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT - Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group"
          >
            {/* Floating Orbs */}
            <motion.div
              animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -left-8 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -right-8 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"
            />

            {/* Main Image Card */}
            <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/5 border border-white/50 p-4 lg:p-6">
              {/* Browser Header */}
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="flex-1 mx-3">
                  <div className="bg-slate-100 rounded-lg h-5 w-full flex items-center px-3 text-[10px] text-slate-400">
                    smartspend.app/dashboard
                  </div>
                </div>
              </div>

              <img
                src="/dashboard-preview.png"
                alt="SmartSpend Dashboard"
                className="rounded-2xl w-full shadow-inner ring-1 ring-slate-900/5"
              />

              {/* Floating Stats Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-4 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <FiTrendingUp className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Savings Rate</p>
                    <p className="text-lg font-bold text-slate-900">+32%</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Security Badge */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-3 border border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiShield className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Protection</p>
                    <p className="text-xs font-bold text-slate-900">256-bit</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT - Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Section Label */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Why Choose SmartSpend
            </motion.span>

            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Take Control of Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h2>

            <p className="text-slate-500 mt-6 leading-relaxed text-lg">
              SmartSpend combines expense tracking, budgeting, savings goals,
              analytics and secure authentication into one simple platform so
              you can focus on smarter financial decisions.
            </p>

            {/* Benefits List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mt-10 space-y-4"
            >
              {benefits.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/80 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-100 border border-transparent transition-all duration-300 cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiCheckCircle
                      size={24}
                      className="text-emerald-500 group-hover:text-emerald-600 transition-colors duration-300 flex-shrink-0"
                    />
                  </motion.div>
                  <p className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors duration-300">
                    {item}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-10"
            >
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
              >
                See how it works
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;