import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app";

const getToken = () => localStorage.getItem("token");

export const getDashboard = async () => {
  const res = await axios.get(`${API}/api/dashboard`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};