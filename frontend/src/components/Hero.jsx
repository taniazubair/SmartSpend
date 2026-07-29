import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTrendingUp, FiShield, FiZap } from "react-icons/fi";
import dashboardImg from "../assets/dashboard.jpg";

function FloatingOrb({ delay, className }) {
  return (
    <motion.div
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
  );
}

function Hero() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden"
    >
      {/* Background Orbs */}
      <FloatingOrb delay={0} className="top-20 left-10 w-96 h-96 bg-blue-500/20" />
      <FloatingOrb delay={2} className="bottom-20 right-10 w-80 h-80 bg-cyan-400/15" />
      <FloatingOrb delay={4} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content - pt-28 se navbar ke neeche start hoga */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20 lg:pt-32 lg:pb-0 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-8rem)] lg:min-h-screen">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Badge - ab navbar se clear hoga */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex"
            >
              <span className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium overflow-hidden">
                <FiZap className="w-4 h-4 text-cyan-300" />
                Personal Finance Made Simple
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mt-6 leading-[1.1] tracking-tight"
            >
              Track Every
              <br />
              <span className="text-cyan-300">Rupee</span>.
              <br />
              Save Smarter.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-blue-100/80 text-lg mt-6 leading-relaxed max-w-lg"
            >
              SmartSpend helps you manage expenses, stay within budget,
              achieve savings goals, and understand your spending through
              beautiful analytics.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-2xl shadow-blue-900/50 hover:shadow-blue-900/70 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>

              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 rounded-2xl font-bold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Login
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-2 mt-8 text-blue-200/60 text-sm"
            >
              <FiShield className="w-4 h-4" />
              <span>Bank-level security & encryption</span>
            </motion.div>
          </motion.div>

          {/* RIGHT - Dashboard Preview (Mobile pe bhi dikhega) */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative mt-8 lg:mt-0"
            style={{ perspective: 1000 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-[2.5rem] blur-3xl scale-110" />

            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative cursor-pointer"
            >
              <div className="relative bg-slate-800 rounded-3xl shadow-2xl shadow-blue-900/40 p-2 sm:p-3 border border-white/10">
                {/* Browser Header */}
                <div className="flex items-center gap-2 mb-2 sm:mb-3 px-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
                  <div className="flex-1 mx-3">
                    <div className="bg-white/10 rounded-lg h-5 sm:h-6 w-full flex items-center px-3 text-[10px] sm:text-xs text-white/40">
                      smartspend.app/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard Image - Mobile pe bhi dikhega */}
                <img
                  src={dashboardImg}
                  alt="SmartSpend Dashboard"
                  className="rounded-xl sm:rounded-2xl w-full shadow-inner"
                />

                {/* Floating Stats Badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -bottom-4 sm:-bottom-5 -left-2 sm:-left-5 bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-slate-100"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <FiTrendingUp className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-500">Monthly Savings</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900">+24.5%</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  );
}

export default Hero;