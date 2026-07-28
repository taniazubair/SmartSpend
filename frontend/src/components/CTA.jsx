import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiUsers, FiStar, FiZap } from "react-icons/fi";

function CTA() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1], 
          opacity: [0.2, 0.4, 0.2],
          x: [0, -20, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1], 
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Glassmorphism Card */}
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 p-10 lg:p-16 text-center overflow-hidden">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
            
            {/* Floating Decorations */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-white/10 hidden lg:block"
            />
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 border border-white/10 hidden lg:block"
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-semibold uppercase tracking-wider mb-8"
              >
                <FiZap className="w-4 h-4" />
                Get Started Today
              </motion.div>

              {/* Heading */}
              <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                Start Managing Your{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Money Today
                </span>
              </h2>

              {/* Description */}
              <p className="text-blue-100/70 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
                Join SmartSpend and take control of your finances with expense
                tracking, budget planning, savings goals, analytics, and secure
                account management.
              </p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
              >
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl shadow-blue-900/50 hover:shadow-blue-900/70 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Create Free Account
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </Link>

                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-2xl font-bold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    Login
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center items-center gap-6 mt-10 text-blue-200/60 text-sm"
              >
                <div className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  <span>10,000+ Users</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-blue-400/50" />
                <div className="flex items-center gap-2">
                  <FiStar className="w-4 h-4" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-blue-400/50 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Free Forever</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;