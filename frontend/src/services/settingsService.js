import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app/api/users";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProfile = async () => {
  return await axios.get(
    `${API}/profile`,
    getConfig()
  );
};

export const updateProfile = async (data) => {
  return await axios.put(
    `${API}/profile`,
    data,
    getConfig()
  );
};

export const changePassword = async (data) => {
  return await axios.put(
    `${API}/change-password`,
    data,
    getConfig()
  );
};