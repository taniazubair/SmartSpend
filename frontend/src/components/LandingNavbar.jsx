import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, Home, Sparkles, HelpCircle, Info } from "lucide-react";

function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const menuRef = useRef(null);
  const location = useLocation();

  // Track scroll for navbar styling and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect active section for highlighting
      const sections = ["home", "features", "how-it-works", "about"];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "#home", icon: Home },
    { name: "Features", href: "#features", icon: Sparkles },
    { name: "How It Works", href: "#how-it-works", icon: HelpCircle },
    { name: "About", href: "#about", icon: Info },
  ];

  const handleLinkClick = (href) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-100/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors duration-300 ${
                  scrolled ? "bg-blue-600" : "bg-blue-600"
                }`}
              >
                <Wallet size={20} className="sm:w-[22px] sm:h-[22px]" />
              </motion.div>
              <span
                className={`font-bold text-xl sm:text-2xl tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-slate-900" : "text-slate-900"
                }`}
              >
                SmartSpend
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 bg-blue-50/80"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 border border-transparent hover:border-blue-100 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${
                isOpen
                  ? "bg-blue-50 text-blue-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white z-50 shadow-2xl lg:hidden flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Wallet size={18} />
                  </div>
                  <span className="font-bold text-lg text-slate-900">Menu</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.href.replace("#", "");
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="mobileActive"
                          className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"
                        />
                      )}
                    </motion.a>
                  );
                })}
              </div>

              {/* Mobile CTA Buttons */}
              <div className="p-5 border-t border-slate-100 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default LandingNavbar;