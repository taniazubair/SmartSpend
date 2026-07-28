import { motion } from "framer-motion";
import {
  FiUserPlus,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi";

const steps = [
  {
    icon: <FiUserPlus size={34} />,
    title: "Create an Account",
    description:
      "Sign up securely, verify your email and access your personal finance dashboard.",
  },
  {
    icon: <FiCreditCard size={34} />,
    title: "Track Your Finances",
    description:
      "Add expenses, create budgets and set savings goals to organize your money.",
  },
  {
    icon: <FiTrendingUp size={34} />,
    title: "Analyze & Grow",
    description:
      "View spending insights, export reports and make smarter financial decisions.",
  },
];

function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            How It Works
          </span>

          <h2 className="text-4xl font-bold text-slate-900 mt-4">
            Get Started in Just Three Steps
          </h2>

          <p className="text-slate-600 mt-5 max-w-2xl mx-auto">
            SmartSpend makes managing your finances simple, fast and secure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center relative"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mt-4 mb-6">
                {step.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {step.title}
              </h3>

              <p className="text-slate-600 leading-7">
                {step.description}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;