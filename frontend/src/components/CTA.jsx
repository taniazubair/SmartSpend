import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl p-10 lg:p-16 text-center"
        >

          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Get Started
          </span>

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-4">
            Start Managing Your Money Today
          </h2>

          <p className="text-slate-600 mt-6 max-w-2xl mx-auto leading-8">
            Join SmartSpend and take control of your finances with expense
            tracking, budget planning, savings goals, analytics, and secure
            account management.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">

            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              Create Free Account
              <FiArrowRight />
            </Link>

            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition"
            >
              Login
            </Link>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

export default CTA;