import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/dashboardService";

// Components
import DashboardLayout from "../components/DashboardLayout";
import AddExpenseModal from "../components/AddExpenseModal";

// Icons — sirf wohi jo original mein the + category icons
import {
  FiPlus,
  FiDollarSign,
  FiList,
  FiTrendingUp,
  FiPieChart,
  FiCalendar,
  FiArrowUpRight,
  FiArrowDownRight,
  FiActivity,
  FiChevronRight,
  FiRefreshCw,
  FiAlertCircle,
  FiMoreHorizontal,
  FiShoppingBag,
  FiCoffee,
  FiHome,
  FiTruck,
  FiMonitor,
  FiHeart,
  FiBookOpen,
  FiZap,
  FiSmartphone,
  FiShield
} from "react-icons/fi";

// Charts
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

// ─── Constants ─────────────────────────────────────────────

const COLORS = [
  "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B",
  "#10B981", "#6366F1", "#EF4444", "#14B8A6"
];

const CATEGORY_CONFIG = {
  Food: { icon: FiCoffee, color: "#F59E0B", light: "bg-amber-50", text: "text-amber-600" },
  Transport: { icon: FiTruck, color: "#3B82F6", light: "bg-blue-50", text: "text-blue-600" },
  Shopping: { icon: FiShoppingBag, color: "#EC4899", light: "bg-pink-50", text: "text-pink-600" },
  Entertainment: { icon: FiMonitor, color: "#8B5CF6", light: "bg-purple-50", text: "text-purple-600" },
  Health: { icon: FiHeart, color: "#EF4444", light: "bg-red-50", text: "text-red-600" },
  Education: { icon: FiBookOpen, color: "#14B8A6", light: "bg-teal-50", text: "text-teal-600" },
  Utilities: { icon: FiZap, color: "#F59E0B", light: "bg-yellow-50", text: "text-yellow-600" },
  Housing: { icon: FiHome, color: "#6366F1", light: "bg-indigo-50", text: "text-indigo-600" },
  Phone: { icon: FiSmartphone, color: "#06B6D4", light: "bg-cyan-50", text: "text-cyan-600" },
  Insurance: { icon: FiShield, color: "#10B981", light: "bg-green-50", text: "text-green-600" },
  default: { icon: FiMoreHorizontal, color: "#6B7280", light: "bg-gray-50", text: "text-gray-600" }
};

// ─── Animation Variants ────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

// ─── Animated Counter Hook ─────────────────────────────────

function useAnimatedValue(target, duration = 1.5) {
  const spring = useSpring(0, { stiffness: 50, damping: 20, duration: duration * 1000 });
  const display = useTransform(spring, (val) => Math.floor(val));
  const [value, setValue] = useState(0);

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setValue(v));
    return unsubscribe;
  }, [display]);

  return value;
}

// ─── Skeleton Components ───────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-14 h-5 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="w-20 h-3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
      <div className="w-28 h-7 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 h-72">
      <div className="w-28 h-5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-1" />
      <div className="w-40 h-3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-6" />
      <div className="h-48 w-full bg-gray-100 dark:bg-slate-700/50 rounded-xl animate-pulse" />
    </div>
  );
}

function SkeletonTransaction() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div>
          <div className="w-28 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-1" />
          <div className="w-16 h-3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
      <div className="w-14 h-5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
    </div>
  );
}

// ─── StatCard Component ────────────────────────────────────

function StatCard({ title, value, icon: Icon, color, trend, delay = 0 }) {
  const isPositive = trend > 0;
  const trendColor = isPositive ? "text-red-500" : "text-green-500";
  const trendBg = isPositive ? "bg-red-50 dark:bg-red-500/10" : "bg-green-50 dark:bg-green-500/10";

  return (
    <motion.div
      variants={itemVariants}
      custom={delay}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 ${color.replace("text-", "bg-")} blur-2xl group-hover:opacity-20 transition-opacity`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${color.replace("text-", "bg-")}/10`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full ${trendBg} ${trendColor}`}>
              {isPositive ? <FiArrowUpRight className="w-3 h-3" /> : <FiArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {title}
        </p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard Component ──────────────────────────────

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState({
    totalSpent: 0,
    totalBudget: 0,
    totalSavings: 0,
    recentExpenses: [],
    weeklyData: [],
  });

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboard();
      setDashboard(res.dashboard);
      setExpenses(res.dashboard.recentExpenses || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const animTotalSpent = useAnimatedValue(Number(dashboard.totalSpent) || 0);
  const animTotalBudget = useAnimatedValue(Number(dashboard.totalBudget) || 0);
  const animTotalSavings = useAnimatedValue(Number(dashboard.totalSavings) || 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e?.amount || 0), 0);
  const transactionCount = expenses.length;
  const highestExpense = expenses.length > 0
    ? Math.max(...expenses.map(e => Number(e?.amount || 0)))
    : 0;
  const categoryCount = new Set(expenses.map(e => e?.category).filter(Boolean)).size;

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0))
      .slice(0, 5);
  }, [expenses]);

  const chartData = useMemo(() => {
    if (!expenses.length) return [];
    const data = {};
    expenses.forEach(e => {
      if (e?.category && e?.amount) {
        data[e.category] = (data[e.category] || 0) + Number(e.amount);
      }
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const hasData = expenses.length > 0;
  const hasChartData = chartData.length > 0;

  if (loading && !(Number(dashboard.totalSpent) || 0)) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="w-40 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
              <div className="w-28 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
            </div>
            <div className="w-28 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2"><SkeletonChart /></div>
            <div className="lg:col-span-1"><SkeletonChart /></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-slate-700">
              <div className="w-36 h-5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
            </div>
            {[1, 2, 3, 4, 5].map(i => <SkeletonTransaction key={i} />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
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
              onClick={fetchDashboard}
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
    <DashboardLayout title="Dashboard">
      <div className="flex-1 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto"
        >
          {/* ─── Header ───────────────────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Financial Overview
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Welcome to SmartSpend
              </p>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchDashboard}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-blue-600 transition-colors shadow-sm"
                title="Refresh"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-200 transition-colors shrink-0"
              >
                <FiPlus className="w-4 h-4" />
                Add Expense
              </motion.button>
            </div>
          </motion.div>

          {/* ─── Stats Grid ───────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Expenses"
              value={`Rs. ${animTotalSpent.toLocaleString()}`}
              icon={FiDollarSign}
              color="text-red-500"
              trend={12}
            />
            <StatCard
              title="Total Budget"
              value={`Rs. ${animTotalBudget.toLocaleString()}`}
              icon={FiPieChart}
              color="text-green-500"
            />
            <StatCard
              title="Total Savings"
              value={`Rs. ${animTotalSavings.toLocaleString()}`}
              icon={FiTrendingUp}
              color="text-purple-500"
            />
            <StatCard
              title="Categories"
              value={categoryCount || "—"}
              icon={FiList}
              color="text-blue-500"
            />
          </div>

          {/* ─── Content: Data or Empty State ─────────────────── */}
          {hasData ? (
            <>
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Weekly Bar Chart */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 lg:col-span-2"
                >
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">
                    Weekly Overview
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Your spending this week
                  </p>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboard.weeklyData || []} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9ca3af", fontSize: 12 }}
                          dy={5}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9ca3af", fontSize: 11 }}
                          tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val}
                        />
                        <Tooltip
                          cursor={{ fill: "#eff6ff", radius: 4 }}
                          formatter={(value) => [`Rs. ${Number(value || 0).toLocaleString()}`, "Amount"]}
                          contentStyle={{
                            borderRadius: "10px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                            fontSize: "12px"
                          }}
                        />
                        <Bar
                          dataKey="amount"
                          fill="#3B82F6"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={50}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Category Pie Chart */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700"
                >
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">
                    By Category
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Where your money goes
                  </p>
                  <div className="h-48 w-full relative">
                    {hasChartData ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            animationBegin={200}
                            animationDuration={1200}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => `Rs. ${Number(value || 0).toLocaleString()}`}
                            contentStyle={{
                              borderRadius: "10px",
                              border: "none",
                              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                              fontSize: "12px"
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        No category data
                      </div>
                    )}
                  </div>

                  {/* Category Legend */}
                  {hasChartData && (
                    <div className="flex flex-wrap gap-2 mt-3 justify-center">
                      {chartData.map((entry, index) => {
                        const config = CATEGORY_CONFIG[entry.name] || CATEGORY_CONFIG.default;
                        return (
                          <div key={entry.name} className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-lg">
                            <config.icon className="w-3 h-3" style={{ color: COLORS[index % COLORS.length] }} />
                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">{entry.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Recent Transactions */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Recent Transactions
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Your latest expenses
                    </p>
                  </div>
                 <Link
  to="/expenses"
  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
>
  View All
  <FiChevronRight className="w-4 h-4" />
</Link>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                  <AnimatePresence>
                    {recentExpenses.map((expense, index) => {
                      const config = CATEGORY_CONFIG[expense?.category] || CATEGORY_CONFIG.default;
                      return (
                        <motion.div
                          key={expense?._id || index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.03)" }}
                          className="flex items-center justify-between p-4 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl ${config.light} flex items-center justify-center ${config.text} font-bold text-sm border border-gray-100 dark:border-slate-700 group-hover:scale-110 transition-transform`}>
                              <config.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                {expense?.title || "Untitled"}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${config.light} ${config.text}`}>
                                  {expense?.category || "Uncategorized"}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <FiCalendar className="w-3 h-3" />
                                  {expense?.date ? new Date(expense.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                  }) : "—"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-red-500">
                            -Rs. {Number(expense?.amount || 0).toLocaleString()}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          ) : (
            /* ─── Empty State ────────────────────────────────── */
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FiActivity className="w-10 h-10 text-blue-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No expenses yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm">
                Start tracking your spending by adding your first expense.
                It only takes a few seconds!
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-200"
              >
                <FiPlus className="w-4 h-4" />
                Add Your First Expense
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Add Expense Modal */}
       <AddExpenseModal
             isOpen={isModalOpen}
             onClose={() => {
               setIsModalOpen(false);
               setEditingExpense(null);
             }}
             onExpenseAdded={fetchExpenses}
             editingExpense={editingExpense}
           />
    </DashboardLayout>
  );
}

export default Dashboard;