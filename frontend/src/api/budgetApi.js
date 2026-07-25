import axios from "axios";

const API = axios.create({
  baseURL: "http://https://smartspend-production-2753.up.railway.app/api",
});

// Automatically attach JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Get Budgets
export const getBudgets = () => API.get("/budgets");

// Create Budget
export const createBudget = (data) => API.post("/budgets", data);

// Update Budget
export const updateBudget = (id, data) =>
  API.put(`/budgets/${id}`, data);

// Delete Budget
export const deleteBudget = (id) =>
  API.delete(`/budgets/${id}`);