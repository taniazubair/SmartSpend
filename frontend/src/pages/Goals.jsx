import { useEffect, useState, useMemo, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AddGoalModal from "../components/AddGoalModal";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  getGoals,
  createGoal,
  deleteGoal,
  addSavings,
  updateGoal,
} from "../services/goalService";

import {
  FiPlus,
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiDollarSign,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiTrendingDown,
  FiAward,
  FiCalendar,
  FiMoreHorizontal,
} from "react-icons/fi";

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

function SkeletonStat() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse mb-3" />
      <div className="w-20 h-3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
      <div className="w-28 h-7 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
    </div>
  );
}

function SkeletonGoal() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="w-32 h-6 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
          <div className="w-24 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>
        <div className="w-20 h-6 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i}>
            <div className="w-16 h-3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
            <div className="w-20 h-6 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse mb-6" />
      <div className="flex gap-3">
        <div className="w-28 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-20 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-20 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </div>
  );
}

// ─── Circular Progress ─────────────────────────────────────

function CircularProgress({ percentage, size = 56, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  let color = "#3B82F6";
  if (percentage >= 100) color = "#10B981";
  if (percentage >= 80 && percentage < 100) color = "#F59E0B";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
          className="text-gray-100 dark:text-slate-700"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="transparent"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-gray-700 dark:text-gray-200">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────

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

// ─── Goal Card ─────────────────────────────────────────────

function GoalCard({ goal, index, onEdit, onDelete, onAddSavings }) {
  const target = Number(goal?.targetAmount) || 1;
  const saved = Number(goal?.savedAmount) || 0;
  const percentage = Math.min((saved / target) * 100, 100);
  const isCompleted = percentage >= 100;
  const remaining = Math.max(target - saved, 0);
  
  // Deadline logic
  const today = new Date();
  const deadline = goal?.deadline ? new Date(goal.deadline) : null;
  const daysLeft = deadline ? Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)) : null;
  const isOverdue = daysLeft !== null && daysLeft < 0 && !isCompleted;

  let statusConfig = {
    label: "On Track",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    icon: FiTrendingUp,
  };
  
  if (isCompleted) {
    statusConfig = {
      label: "Completed",
      color: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
      icon: FiCheckCircle,
    };
  } else if (isOverdue) {
    statusConfig = {
      label: "Overdue",
      color: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
      icon: FiAlertCircle,
    };
  } else if (daysLeft !== null && daysLeft <= 7) {
    statusConfig = {
      label: "Due Soon",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
      icon: FiClock,
    };
  }

  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      variants={item}
      custom={index}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 overflow-hidden group relative"
    >
      {/* Gradient blob */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 ${isCompleted ? "bg-green-500" : "bg-blue-500"} blur-3xl group-hover:opacity-10 transition-opacity`} />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl ${isCompleted ? "bg-green-50 dark:bg-green-500/10" : "bg-blue-50 dark:bg-blue-500/10"} flex items-center justify-center`}>
              {isCompleted ? (
                <FiAward className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <FiTarget className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{goal?.title || "Untitled Goal"}</h2>
              {deadline && (
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                  <FiCalendar className="w-3 h-3" />
                  {isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : daysLeft === 0 ? "Due today" : `${daysLeft} days left`}
                  {" • "}
                  {deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig.label}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Target</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Rs. {target.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Saved</p>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">Rs. {saved.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Remaining</p>
            <p className="text-sm font-bold text-red-500 dark:text-red-400">Rs. {remaining.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="flex items-center gap-4 mb-6">
          <CircularProgress percentage={percentage} size={60} strokeWidth={5} />
          <div className="flex-1">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Progress</span>
              <span className="font-bold text-gray-900 dark:text-white">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                className={`h-full rounded-full ${isCompleted ? "bg-green-500" : percentage >= 80 ? "bg-amber-500" : "bg-blue-500"}`}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-slate-700">
          {!isCompleted && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAddSavings(goal?._id)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <FiTrendingUp className="w-3.5 h-3.5" />
              Add Savings
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onEdit(goal)}
            className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onDelete(goal?._id)}
            className="flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

 const fetchGoals = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await getGoals();

    setGoals(data.data || data || []);

  } catch (err) {
    console.log(err);
    setError("Failed to load goals. Please try again.");
    setGoals([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAddOrUpdateGoal = async (goalData) => {
    try {
      if (editingGoal) {
        await updateGoal(editingGoal._id, goalData);
        toast.success("Goal updated successfully");
      } else {
        await createGoal(goalData);
        toast.success("Goal created successfully");
      }
      setIsModalOpen(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (err) {
      console.log(err);
      toast.error(editingGoal ? "Failed to update goal" : "Failed to create goal");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this goal?");
    if (!confirmDelete) return;
    try {
      await deleteGoal(id);
      toast.success("Goal deleted successfully");
      fetchGoals();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete goal");
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleAddSavingsClick = async (id) => {
    const amount = prompt("Enter saving amount");
    if (!amount) return;
    if (Number(amount) <= 0) {
      toast.error("Invalid amount");
      return;
    }
    try {
      await addSavings(id, Number(amount));
      toast.success("Savings Added");
      fetchGoals();
    } catch (error) {
      console.log(error);
      toast.error("Unable to add savings");
    }
  };

  // Stats
  const stats = useMemo(() => {
    const totalTarget = goals.reduce((sum, g) => sum + (Number(g?.targetAmount) || 0), 0);
    const totalSaved = goals.reduce((sum, g) => sum + (Number(g?.savedAmount) || 0), 0);
    const completed = goals.filter(g => (Number(g?.savedAmount) || 0) >= (Number(g?.targetAmount) || 0)).length;
    const inProgress = goals.length - completed;
    return { totalTarget, totalSaved, completed, inProgress };
  }, [goals]);

  // Loading State
  if (loading && goals.length === 0) {
    return (
      <DashboardLayout title="Saving Goals">
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
          <div className="space-y-6">
            {[1, 2].map(i => <SkeletonGoal key={i} />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <DashboardLayout title="Saving Goals">
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
              onClick={fetchGoals}
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
    <DashboardLayout title="Saving Goals">
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
              Saving Goals
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Track your financial goals and watch your progress grow.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchGoals}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-blue-600 transition-colors shadow-sm"
              title="Refresh"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEditingGoal(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-200 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Create Goal
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        {goals.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Goals" value={goals.length} icon={FiTarget} color="text-blue-500" />
            <StatCard title="Total Target" value={`Rs. ${stats.totalTarget.toLocaleString()}`} icon={FiDollarSign} color="text-purple-500" />
            <StatCard title="Total Saved" value={`Rs. ${stats.totalSaved.toLocaleString()}`} icon={FiTrendingUp} color="text-green-500" />
            <StatCard title="Completed" value={stats.completed} icon={FiCheckCircle} color="text-amber-500" />
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {goals.length === 0 ? (
              <motion.div
                variants={item}
                className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-slate-700"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FiTarget className="w-12 h-12 text-blue-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Goals Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm">
                  Start saving by creating your first financial goal. Track your progress and celebrate milestones!
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setEditingGoal(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
                >
                  <FiPlus className="w-5 h-5" />
                  Create First Goal
                </motion.button>
              </motion.div>
            ) : (
              goals.map((goal, index) => (
                <GoalCard
                  key={goal?._id || index}
                  goal={goal}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddSavings={handleAddSavingsClick}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onAddGoal={handleAddOrUpdateGoal}
        editingGoal={editingGoal}
      />
    </DashboardLayout>
  );
}

export default Goals;