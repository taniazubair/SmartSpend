import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import DashboardLayout from "../components/DashboardLayout";
import AddIncomeModal from "../components/AddIncomeModal";

import {
  FiPlus,
  FiSearch,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiTrash2,
  FiEdit2,
  FiDollarSign,
  FiHash,
  FiActivity,
  FiTrendingUp,
  FiRefreshCw,
  FiAlertCircle,
  FiFileText,
  FiInbox,
  FiBriefcase,
  FiGift,
  FiBox,
  FiCheckCircle,
  FiX,
  FiInfo,
} from "react-icons/fi";

// ─── Toast Hook ────────────────────────────────────────────

function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// ─── Toast Component ───────────────────────────────────────

function ToastContainer({ toasts, removeToast }) {
  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-blue-500" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-500" />,
    info: <FiInfo className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
    error: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20",
    info: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[300px] backdrop-blur-sm ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Delete Confirmation Modal ─────────────────────────────

function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-slate-700"
      >
        <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          Delete Income?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {itemName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-medium text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Constants ─────────────────────────────────────────────

const INCOME_CATEGORIES = ["All", "Salary", "Freelance", "Business", "Gift", "Investment", "Other"];

const CATEGORY_ICONS = {
  Salary: FiBriefcase,
  Freelance: FiTrendingUp,
  Business: FiDollarSign,
  Gift: FiGift,
  Investment: FiActivity,
  Other: FiBox,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

// ─── StatCard ──────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden"
    >
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 ${color.replace(
          "text-",
          "bg-"
        )} blur-2xl`}
      />
      <div className="relative">
        <div
          className={`p-2 rounded-xl w-fit mb-3 ${color.replace(
            "text-",
            "bg-"
          )}/10`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}

function CategoryIcon({ category }) {
  const Icon = CATEGORY_ICONS[category] || FiBox;
  return (
    <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-600">
      <Icon className="w-5 h-5" />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────

function Income() {
  const { toasts, addToast, removeToast } = useToast();
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  const API_URL = "https://smartspend-production-2753.up.railway.app/api/income";

  const fetchIncome = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIncome(res.data.income || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load income.");
      addToast("Failed to load income data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SmartSpend Income Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = income.map((item) => [
      item.date ? new Date(item.date).toLocaleDateString() : "-",
      item.source || "Unknown",
      item.category || "Other",
      `Rs. ${Number(item.amount || 0).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Date", "Source", "Category", "Amount"]],
      body: tableData,
      theme: "grid",
    });

    const total = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    doc.text(`Total Income: Rs. ${total.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 15);
    doc.save("SmartSpend-Income-Report.pdf");
    addToast("PDF exported successfully", "success");
  };

  const openDeleteModal = (item) => {
    setDeleteModal({ open: true, item });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, item: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;
    const id = deleteModal.item._id;
    setDeletingId(id);
    closeDeleteModal();

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIncome((prev) => prev.filter((item) => item._id !== id));
      addToast("Income deleted successfully", "success");
    } catch (err) {
      console.log(err);
      addToast("Failed to delete income", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (item) => {
    setEditingIncome(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  const handleIncomeSuccess = (message, type = "success") => {
    fetchIncome();
    addToast(message, type);
  };

  const filteredIncome = useMemo(() => {
    let result = [...income];
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }
    result.sort((a, b) => {
      if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc"
          ? Number(a.amount) - Number(b.amount)
          : Number(b.amount) - Number(a.amount);
      }
      return sortConfig.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
    return result;
  }, [income, searchTerm, selectedCategory, sortConfig]);

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const stats = useMemo(() => {
    const total = filteredIncome.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const count = filteredIncome.length;
    const avg = count > 0 ? total / count : 0;
    const highest = count > 0 ? Math.max(...filteredIncome.map((item) => Number(item.amount || 0))) : 0;
    return { total, count, avg, highest };
  }, [filteredIncome]);

  if (error && !income.length) {
    return (
      <DashboardLayout title="Income">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{error}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={fetchIncome}
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
    <DashboardLayout title="Income">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.source || "this income"}
      />

      <motion.div variants={container} initial="hidden" animate="show" className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">All Income</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage and track your earnings</p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchIncome}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-blue-600 transition-colors shadow-sm"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={exportPDF}
               className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <FiFileText className="w-4 h-4" />
              Export PDF
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEditingIncome(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Income
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Income" value={`Rs. ${Math.round(stats.total).toLocaleString()}`} icon={FiDollarSign} color="text-blue-500" />
          <StatCard title="Sources" value={stats.count} icon={FiHash} color="text-blue-500" />
          <StatCard title="Average" value={`Rs. ${Math.round(stats.avg).toLocaleString()}`} icon={FiActivity} color="text-purple-500" />
          <StatCard title="Highest" value={`Rs. ${Math.round(stats.highest).toLocaleString()}`} icon={FiTrendingUp} color="text-blue-600" />
        </div>

        {/* Search + Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-xl px-4 py-3 flex-1">
              <FiSearch className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search income..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {INCOME_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th
                    onClick={() => toggleSort("date")}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
                  >
                    <span className="flex items-center gap-1">
                      Date
                      {sortConfig.key === "date" &&
                        (sortConfig.direction === "desc" ? (
                          <FiArrowDown className="w-3 h-3" />
                        ) : (
                          <FiArrowUp className="w-3 h-3" />
                        ))}
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("amount")}
                    className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
                  >
                    <span className="flex items-center justify-end gap-1">
                      Amount
                      {sortConfig.key === "amount" &&
                        (sortConfig.direction === "desc" ? (
                          <FiArrowDown className="w-3 h-3" />
                        ) : (
                          <FiArrowUp className="w-3 h-3" />
                        ))}
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                <AnimatePresence>
                  {filteredIncome.length > 0 ? (
                    filteredIncome.map((item, index) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <CategoryIcon category={item.category} />
                            <span className="font-semibold text-gray-900 dark:text-white">{item.source}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-3.5 h-3.5" />
                            {item.date ? new Date(item.date).toLocaleDateString() : "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-blue-600 dark:text-blue-400 text-sm">
                          +Rs. {Number(item.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openDeleteModal(item)}
                              disabled={deletingId === item._id}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === item._id ? (
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
                    <tr>
                      <td colSpan="5" className="py-16 text-center">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                          <FiInbox className="mx-auto w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 font-medium">No income found</p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your filters or add new income</p>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <AddIncomeModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onIncomeAdded={handleIncomeSuccess}
          editingIncome={editingIncome}
        />
      </motion.div>
    </DashboardLayout>
  );
}

export default Income;