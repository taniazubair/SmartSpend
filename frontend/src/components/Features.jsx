import { motion } from "framer-motion";
import {
  FiCreditCard,
  FiTarget,
  FiPieChart,
  FiDownload,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";

const features = [
  {
    icon: <FiCreditCard className="text-4xl text-blue-600" />,
    title: "Expense Tracking",
    description:
      "Quickly add, edit and organise your daily expenses in one place.",
  },
  {
    icon: <FiTarget className="text-4xl text-blue-600" />,
    title: "Budget Management",
    description:
      "Create monthly budgets and stay in control of your spending.",
  },
  {
    icon: <FiTrendingUp className="text-4xl text-blue-600" />,
    title: "Savings Goals",
    description:
      "Set financial goals and monitor your progress with ease.",
  },
  {
    icon: <FiPieChart className="text-4xl text-blue-600" />,
    title: "Analytics Dashboard",
    description:
      "Understand your spending through charts and visual insights.",
  },
  {
    icon: <FiDownload className="text-4xl text-blue-600" />,
    title: "PDF Export",
    description:
      "Export your expense reports anytime in PDF format.",
  },
  {
    icon: <FiShield className="text-4xl text-blue-600" />,
    title: "Secure Authentication",
    description:
      "Email verification, password reset and encrypted authentication.",
  },
];

function Features() {
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
            Features
          </span>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            Everything You Need To Manage Your Money
          </h2>

          <p className="text-slate-600 mt-5 max-w-2xl mx-auto">
            SmartSpend provides all the essential tools to track expenses,
            control budgets, analyse spending habits and achieve savings goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-slate-600 leading-7">
                {feature.description}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;