import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDashboard = async () => {
  const res = await axios.get(
    `${API}/api/dashboard`,
    getConfig()
  );

  return res.data;
};