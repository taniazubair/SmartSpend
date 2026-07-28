import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app/api/saving-goals";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getGoals = async () => {
  const res = await axios.get(API, getConfig());
  return res.data;
};

export const createGoal = async (goal) => {
  const res = await axios.post(API, goal, getConfig());
  return res.data;
};

export const deleteGoal = async (id) => {
  const res = await axios.delete(
    `${API}/${id}`,
    getConfig()
  );
  return res.data;
};

export const addSavings = async (id, amount) => {
  const res = await axios.put(
    `${API}/${id}/add`,
    { amount },
    getConfig()
  );
  return res.data;
};

export const updateGoal = async (id, goal) => {
  const res = await axios.put(
    `${API}/${id}`,
    goal,
    getConfig()
  );
  return res.data;
};