import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import DashboardLayout from "../components/DashboardLayout";
import AddExpenseModal from "../components/AddExpenseModal";
import { useTheme } from "../context/ThemeContext";

import {
  FiPlus,
  FiSearch,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiEdit2,
  FiTrash2,
  FiCoffee,
  FiShoppingBag,
  FiTruck,
  FiZap,
  FiFilm,
  FiHeart,
  FiBook,
  FiBox,
  FiInbox,
  FiDollarSign,
  FiHash,
  FiTrendingUp,
  FiActivity,
  FiRefreshCw,
  FiAlertCircle,
  FiFileText,
} from "react-icons/fi";

const CATEGORIES = [
  "All",
  "Food",
  "Shopping",
  "Transport",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const CATEGORY_ICONS = {
  Food: FiCoffee,
  Shopping: FiShoppingBag,
  Transport: FiTruck,
  Bills: FiZap,
  Entertainment: FiFilm,
  Health: FiHeart,
  Education: FiBook,
  Other: FiBox,
};

const CATEGORY_COLORS = {
  Food: "text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20",
  Shopping: "text-pink-600 bg-pink-50 border-pink-100 dark:bg-pink-500/10 dark:border-pink-500/20",
  Transport: "text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20",
  Bills: "text-yellow-600 bg-yellow-50 border-yellow-100 dark:bg-yellow-500/10 dark:border-yellow-500/20",
  Entertainment: "text-purple-600 bg-purple-50 border-purple-100 dark:bg-purple-500/10 dark:border-purple-500/20",
  Health: "text-red-600 bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-red-500/20",
  Education: "text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20",
  Other: "text-gray-600 bg-gray-100 border-gray-200 dark:bg-slate-700 dark:border-slate-600",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-slate-700/50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div>
            <div className="w-28 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-1.5" />
            <div className="w-16 h-3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4"><div className="w-20 h-6 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="w-24 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" /></td>
      <td className="px-6 py-4 text-right"><div className="w-20 h-5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse ml-auto" /></td>
      <td className="px-6 py-4"><div className="w-16 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse ml-auto" /></td>
    </tr>
  );
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse mb-3" />
          <div className="w-20 h-3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
          <div className="w-28 h-7 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function CategoryIcon({ category }) {
  const Icon = CATEGORY_ICONS[category] || FiBox;
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

  return (
    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      variants={item}
      custom={delay}
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

function Expenses() {
  const { theme, toggleTheme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        "https://smartspend-production-2753.up.railway.app/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setExpenses(res.data.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SmartSpend Expense Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = filteredExpenses.map((expense) => [
      expense.date ? new Date(expense.date).toLocaleDateString() : "-",
      expense.title || "Untitled",
      expense.category || "Other",
      `Rs. ${Number(expense.amount || 0).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Date", "Title", "Category", "Amount"]],
      body: tableData,
      theme: "grid",
    });

    const total = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const categoryCount = {};
    filteredExpenses.forEach((expense) => {
      const category = expense.category || "Other";
      categoryCount[category] = (categoryCount[category] || 0) + Number(expense.amount || 0);
    });

    let y = doc.lastAutoTable.finalY + 15;
    doc.text(`Total Spending: Rs. ${total.toLocaleString()}`, 14, y);
    doc.text(`Total Transactions: ${filteredExpenses.length}`, 14, y + 10);
    doc.text("Category Summary:", 14, y + 25);

    let categoryY = y + 35;
    Object.entries(categoryCount).forEach(([category, amount]) => {
      doc.text(`${category}: Rs. ${amount.toLocaleString()}`, 14, categoryY);
      categoryY += 8;
    });

    doc.save("SmartSpend-Expense-Report.pdf");
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`https://smartspend-production-2753.up.railway.app/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (searchTerm) {
      result = result.filter(
        (expense) =>
          expense?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense?.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((expense) => expense?.category === selectedCategory);
    }

    result.sort((a, b) => {
      if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc"
          ? (Number(a?.amount) || 0) - (Number(b?.amount) || 0)
          : (Number(b?.amount) || 0) - (Number(a?.amount) || 0);
      }
      return sortConfig.direction === "asc"
        ? new Date(a?.date || 0) - new Date(b?.date || 0)
        : new Date(b?.date || 0) - new Date(a?.date || 0);
    });

    return result;
  }, [expenses, searchTerm, selectedCategory, sortConfig]);

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + (Number(e?.amount) || 0), 0);
    const count = filteredExpenses.length;
    const avg = count > 0 ? total / count : 0;
    const highest = count > 0 ? Math.max(...filteredExpenses.map(e => Number(e?.amount) || 0)) : 0;
    return { total, count, avg, highest };
  }, [filteredExpenses]);

  const hasData = expenses.length > 0;
  const hasFilteredData = filteredExpenses.length > 0;

  if (loading && expenses.length === 0) {
    return (
      <DashboardLayout title="Expenses">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="w-40 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
              <div className="w-56 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
            </div>
            <div className="w-32 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
          </div>
          <SkeletonStats />
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700">
              <div className="w-full h-12 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
            </div>
            <table className="min-w-full">
              <tbody>
                {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Expenses">
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
              onClick={fetchExpenses}
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
    <DashboardLayout title="Expenses">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={item}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              All Expenses
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Manage and track every transaction
            </p>
          </div>

          <div className="flex items-center gap-2">
        

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchExpenses}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-blue-600 transition-colors shadow-sm"
              title="Refresh"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={exportPDF}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-colors"
            >
              <FiFileText className="w-4 h-4" />
              Export PDF
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-200 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Expense
            </motion.button>
          </div>
        </motion.div>

        {hasData ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Total" value={`Rs. ${Math.round(stats.total).toLocaleString()}`} icon={FiDollarSign} color="text-red-500" />
              <StatCard title="Count" value={stats.count} icon={FiHash} color="text-blue-500" />
              <StatCard title="Average" value={`Rs. ${Math.round(stats.avg).toLocaleString()}`} icon={FiActivity} color="text-purple-500" />
              <StatCard title="Highest" value={`Rs. ${Math.round(stats.highest).toLocaleString()}`} icon={FiTrendingUp} color="text-green-500" />
            </div>

            <motion.div
              variants={item}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 mb-6"
            >
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex items-center bg-gray-100 dark:bg-slate-700/50 rounded-xl px-4 py-3 flex-1 border border-transparent focus-within:border-blue-300 dark:focus-within:border-blue-500 transition-colors">
                  <FiSearch className="mr-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none w-full text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 w-full overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50/80 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th
                        onClick={() => toggleSort("date")}
                        className="px-6 py-4 text-left cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                          {sortConfig.key === "date" &&
                            (sortConfig.direction === "asc" ? (
                              <FiArrowUp className="w-3.5 h-3.5 text-blue-500" />
                            ) : (
                              <FiArrowDown className="w-3.5 h-3.5 text-blue-500" />
                            ))}
                        </div>
                      </th>
                      <th
                        onClick={() => toggleSort("amount")}
                        className="px-6 py-4 text-right cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      >
                        <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                          {sortConfig.key === "amount" &&
                            (sortConfig.direction === "asc" ? (
                              <FiArrowUp className="w-3.5 h-3.5 text-blue-500" />
                            ) : (
                              <FiArrowDown className="w-3.5 h-3.5 text-blue-500" />
                            ))}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                    <AnimatePresence mode="popLayout">
                      {hasFilteredData ? (
                        filteredExpenses.map((expense) => (
                          <motion.tr
                            key={expense?._id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <CategoryIcon category={expense?.category} />
                                <div>
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {expense?.title || "Untitled"}
                                  </p>
                                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                                    #{expense?._id?.slice(-6) || "000000"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${CATEGORY_COLORS[expense?.category] || CATEGORY_COLORS.Other}`}>
                                {expense?.category || "Other"}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                                {expense?.date ? new Date(expense.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }) : "—"}
                              </div>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                Rs. {Number(expense?.amount || 0).toLocaleString()}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => openEditModal(expense)}
                                  className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(expense?._id)}
                                  disabled={deletingId === expense?._id}
                                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                >
                                  {deletingId === expense?._id ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                      className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"
                                    />
                                  ) : (
                                    <FiTrash2 className="w-4 h-4" />
                                  )}
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <td colSpan={5} className="py-16 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                                <FiSearch className="w-8 h-8 text-gray-400" />
                              </div>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                No expenses found
                              </h3>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Try changing the search or filters.
                              </p>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {hasFilteredData && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  <span>
                    Showing <strong className="text-gray-900 dark:text-white">{filteredExpenses.length}</strong> of <strong className="text-gray-900 dark:text-white">{expenses.length}</strong> expenses
                  </span>
                  {selectedCategory !== "All" && (
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <motion.div
            variants={item}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiInbox className="w-12 h-12 text-blue-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Expenses Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm">
              Start tracking your spending by creating your first expense. It only takes a few seconds!
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
            >
              <FiPlus className="w-5 h-5" />
              Add First Expense
            </motion.button>
          </motion.div>
        )}
      </motion.div>
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onExpenseAdded={fetchExpenses}
        expenseToEdit={editingExpense}
      />
    </DashboardLayout>
  );
}

export default Expenses;