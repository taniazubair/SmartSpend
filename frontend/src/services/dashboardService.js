import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app /api/dashboard";

const getToken = () => localStorage.getItem("token");

export const getDashboard = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};