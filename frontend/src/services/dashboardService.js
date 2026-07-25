import axios from "axios";

const API = "http://localhost:5000/api/dashboard";

const getToken = () => localStorage.getItem("token");

export const getDashboard = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};