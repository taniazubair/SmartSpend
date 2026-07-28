import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const benefits = [
  "Track every expense in seconds",
  "Stay within your monthly budget",
  "Visual dashboard with spending analytics",
  "Set and achieve savings goals",
  "Export expense reports as PDF",
  "Secure authentication with email verification",
];

function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

            <div className="relative bg-slate-50 rounded-3xl shadow-xl p-6">
              <img
                src="/dashboard-preview.png"
                alt="Dashboard Preview"
                className="rounded-2xl w-full"
              />
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-blue-600 uppercase tracking-widest font-semibold">
              Why Choose SmartSpend
            </span>

            <h2 className="text-4xl font-bold text-slate-900 mt-4">
              Take Control of Your Financial Future
            </h2>

            <p className="text-slate-600 mt-6 leading-8">
              SmartSpend combines expense tracking, budgeting, savings goals,
              analytics and secure authentication into one simple platform so
              you can focus on smarter financial decisions.
            </p>

            <div className="mt-10 space-y-5">
              {benefits.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <FiCheckCircle className="text-emerald-500 text-2xl" />
                  <p className="text-slate-700 font-medium">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;