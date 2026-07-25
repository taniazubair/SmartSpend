import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app";

const getToken = () => localStorage.getItem("token");

export const getGoals = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const createGoal = async (goal) => {
  const res = await axios.post(API, goal, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const deleteGoal = async (id) => {
  const res = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};
export const addSavings = async (id, amount) => {
  const res = await axios.put(
    `${API}/${id}/add`,
    { amount },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};
export const updateGoal = async (id, goal) => {
  const res = await axios.put(`${API}/${id}`, goal, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};