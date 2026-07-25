import { motion } from "framer-motion";

function StatCard({ title, amount, icon: Icon, color, change }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-slate-700"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            {amount}
          </h2>

          <p className="text-green-600 dark:text-green-400 mt-3 text-sm font-medium">
            {change}
          </p>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
        >
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;