import { useEffect, useState, useMemo, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { AnimatePresence, motion } from "framer-motion";
import { 
  getBudgets, 
  createBudget, 
  updateBudget, 
  deleteBudget 
} from "../api/budgetApi";

import {
  FiPlus,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiX,
  FiRefreshCw,
  FiCoffee,
  FiShoppingBag,
  FiTruck,
  FiZap,
  FiFilm,
  FiHeart,
  FiBook,
  FiBox,
  FiTarget,
  FiCheckCircle,
  FiPieChart,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

// ─── Constants ─────────────────────────────────────────────

const CATEGORIES = [
  "Food",
  "Shopping",
  "Transport",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const CATEGORY_CONFIG = {
  Food: { icon: FiCoffee, color: "text-orange-600", bg: "bg-orange-500", light: "bg-orange-50", border: "border-orange-100", darkBg: "dark:bg-orange-500/10", darkBorder: "dark:border-orange-500/20" },
  Shopping: { icon: FiShoppingBag, color: "text-pink-600", bg: "bg-pink-500", light: "bg-pink-50", border: "border-pink-100", darkBg: "dark:bg-pink-500/10", darkBorder: "dark:border-pink-500/20" },
  Transport: { icon: FiTruck, color: "text-blue-600", bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-100", darkBg: "dark:bg-blue-500/10", darkBorder: "dark:border-blue-500/20" },
  Bills: { icon: FiZap, color: "text-yellow-600", bg: "bg-yellow-500", light: "bg-yellow-50", border: "border-yellow-100", darkBg: "dark:bg-yellow-500/10", darkBorder: "dark:border-yellow-500/20" },
  Entertainment: { icon: FiFilm, color: "text-purple-600", bg: "bg-purple-500", light: "bg-purple-50", border: "border-purple-100", darkBg: "dark:bg-purple-500/10", darkBorder: "dark:border-purple-500/20" },
  Health: { icon: FiHeart, color: "text-red-600", bg: "bg-red-500", light: "bg-red-50", border: "border-red-100", darkBg: "dark:bg-red-500/10", darkBorder: "dark:border-red-500/20" },
  Education: { icon: FiBook, color: "text-indigo-600", bg: "bg-indigo-500", light: "bg-indigo-50", border: "border-indigo-100", darkBg: "dark:bg-indigo-500/10", darkBorder: "dark:border-indigo-500/20" },
  Other: { icon: FiBox, color: "text-gray-600", bg: "bg-gray-500", light: "bg-gray-100", border: "border-gray-200", darkBg: "dark:bg-slate-700", darkBorder: "dark:border-slate-600" },
};

// ─── Animation Variants ────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

// ─── Skeleton Components ───────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="w-24 h-6 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
          <div className="w-16 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse mb-3" />
      <div className="flex justify-between mb-1">
        <div className="w-12 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-16 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="w-20 h-5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mt-4" />
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse mb-3" />
      <div className="w-20 h-3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
      <div className="w-28 h-7 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 overflow-hidden group relative"
    >
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 ${color.replace("text-", "bg-")} blur-2xl group-hover:opacity-20 transition-opacity`} />
      <div className="relative">
        <div className={`p-2 rounded-xl w-fit mb-3 ${color.replace("text-", "bg-")}/10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{title}</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{value}</h3>
      </div>
    </motion.div>
  );
}

// ─── Budget Card ───────────────────────────────────────────

function BudgetCard({ budget, index, onDelete, onEdit }) {
  const config = CATEGORY_CONFIG[budget?.category] || CATEGORY_CONFIG.Other;
  const Icon = config.icon;
  const spent = Number(budget?.spent) || 0;
  const limit = Number(budget?.limit) || 1;
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOver = spent > limit;
  const isWarning = percentage >= 80 && !isOver;

  return (
    <motion.div
      variants={item}
      custom={index}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 overflow-hidden group relative"
    >
      {/* Gradient blob */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 ${config.bg} blur-3xl group-hover:opacity-10 transition-opacity`} />

      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl ${config.light} ${config.darkBg} ${config.border} ${config.darkBorder} border flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{budget?.category || "Other"}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">{budget?.month || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              isOver
                ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                : isWarning
                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400"
                : "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
            }`}>
              {isOver ? "Exceeded" : isWarning ? "Warning" : "On Track"}
            </span>
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Budget"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(budget._id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete Budget"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Spent</span>
            <span className="font-semibold text-gray-900 dark:text-white">Rs. {spent.toLocaleString()}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
              className={`h-full rounded-full ${isOver ? "bg-red-500" : isWarning ? "bg-yellow-500" : config.bg}`}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-gray-400 dark:text-gray-500">0%</span>
            <span className="font-medium text-gray-600 dark:text-gray-300">{Math.round(percentage)}%</span>
            <span className="text-gray-400 dark:text-gray-500">100%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <FiTarget className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Limit: <span className="font-semibold text-gray-900 dark:text-white">Rs. {limit.toLocaleString()}</span></span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${
            isOver ? "text-red-500" : isWarning ? "text-yellow-500" : "text-green-500"
          }`}>
            {isOver ? <FiAlertCircle className="w-4 h-4" /> : <FiTrendingUp className="w-4 h-4" />}
            {isOver ? "Over Budget" : `${Math.round(percentage)}% Used`}
          </div>
        </div>

        {/* Remaining */}
        {!isOver && (
          <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-right">
            Rs. {(limit - spent).toLocaleString()} remaining
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: "Food",
    limit: "",
    month: new Date().toISOString().slice(0, 7),
  });

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBudgets();
      setBudgets(res.data.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load budgets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleDeleteBudget = async (id) => {
    try {
      await deleteBudget(id);
      fetchBudgets();
    } catch (error) {
      console.log(error);
      alert("Failed to delete budget");
    }
  };

  const handleOpenCreateModal = () => {
    setEditingBudget(null);
    setFormData({
      category: "Food",
      limit: "",
      month: new Date().toISOString().slice(0, 7),
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category || "Food",
      limit: budget.limit || "",
      month: budget.month || new Date().toISOString().slice(0, 7),
    });
    setShowModal(true);
  };

  const handleSaveBudget = async () => {
    try {
      const payload = {
        category: formData.category,
        limit: Number(formData.limit),
        month: formData.month,
      };

      if (editingBudget) {
        await updateBudget(editingBudget._id, payload);
      } else {
        await createBudget(payload);
      }

      fetchBudgets();
      setShowModal(false);
      setEditingBudget(null);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save budget");
    }
  };

  // Stats
  const stats = useMemo(() => {
    const totalLimit = budgets.reduce((sum, b) => sum + (Number(b?.limit) || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (Number(b?.spent) || 0), 0);
    const remaining = Math.max(totalLimit - totalSpent, 0);
    const overBudget = budgets.filter(b => (Number(b?.spent) || 0) > (Number(b?.limit) || 0)).length;
    return { totalLimit, totalSpent, remaining, overBudget };
  }, [budgets]);

  // Loading State
  if (loading && budgets.length === 0) {
    return (
      <DashboardLayout title="Budget Planner">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <div className="w-48 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
              <div className="w-64 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
            </div>
            <div className="w-32 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <SkeletonStat key={i} />)}
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <DashboardLayout title="Budget Planner">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{error}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={fetchBudgets}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              Budget Planner
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Plan your monthly spending wisely.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchBudgets}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-blue-600 transition-colors shadow-sm"
              title="Refresh"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-200 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Budget
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        {budgets.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Budget" value={`Rs. ${stats.totalLimit.toLocaleString()}`} icon={FiDollarSign} color="text-blue-500" />
            <StatCard title="Total Spent" value={`Rs. ${stats.totalSpent.toLocaleString()}`} icon={FiTrendingUp} color="text-red-500" />
            <StatCard title="Remaining" value={`Rs. ${stats.remaining.toLocaleString()}`} icon={FiCheckCircle} color="text-green-500" />
            <StatCard title="Over Budget" value={stats.overBudget} icon={FiAlertCircle} color="text-orange-500" />
          </div>
        )}

        {/* Budget Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {budgets.length === 0 ? (
              <motion.div
                variants={item}
                className="col-span-full bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-slate-700"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FiPieChart className="w-12 h-12 text-blue-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Budgets Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm">
                  Start planning your spending by creating your first budget. Stay on track with your financial goals!
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
                >
                  <FiPlus className="w-5 h-5" />
                  Add First Budget
                </motion.button>
              </motion.div>
            ) : (
              budgets.map((budget, index) => (
                <BudgetCard
                  key={budget?._id || index}
                  budget={budget}
                  index={index}
                  onDelete={handleDeleteBudget}
                  onEdit={handleOpenEditModal}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100 dark:border-slate-700"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingBudget ? "Edit Budget" : "Create Budget"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Category</label>
                <select
                  className="w-full border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Budget Limit (Rs.)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  className="w-full border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                />

                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Month</label>
                <input
                  type="month"
                  className="w-full border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveBudget}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-colors"
                >
                  {editingBudget ? "Update Budget" : "Create Budget"}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}

export default Budgets;