import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app/api/saving-goals";

const getToken = () => localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
};

export const getGoals = async () => {
  const res = await axios.get(API, config);
  return res.data;
};

export const createGoal = async (goal) => {
  const res = await axios.post(API, goal, config);
  return res.data;
};

export const deleteGoal = async (id) => {
  const res = await axios.delete(`${API}/${id}`, config);
  return res.data;
};

export const addSavings = async (id, amount) => {
  const res = await axios.put(
    `${API}/${id}/add`,
    { amount },
    config
  );
  return res.data;
};

export const updateGoal = async (id, goal) => {
  const res = await axios.put(
    `${API}/${id}`,
    goal,
    config
  );
  return res.data;
};import axios from "axios";

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
  const res = await axios.delete(`${API}/${id}`, getConfig());
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