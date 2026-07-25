import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app/api/budgets";

const getToken = () => localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
};

export const getBudgets = async () => {
  const res = await axios.get(API, config);
  return res;
};

export const createBudget = async (budget) => {
  const res = await axios.post(API, budget, config);
  return res;
};