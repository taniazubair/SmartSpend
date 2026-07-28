import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app/api/budgets";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getBudgets = async () => {
  const res = await axios.get(API, getConfig());
  return res;
};

export const createBudget = async (budget) => {
  const res = await axios.post(API, budget, getConfig());
  return res;
};

// Update Budget
export const updateBudget = async (id, budget) => {
  const res = await axios.put(
    `${API}/${id}`,
    budget,
    getConfig()
  );
  return res;
};

// Delete Budget
export const deleteBudget = async (id) => {
  const res = await axios.delete(
    `${API}/${id}`,
    getConfig()
  );
  return res;
};