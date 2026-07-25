import axios from "axios";

const API = "https://smartspend-production-2753.up.railway.app/api/users";

const getToken = () => localStorage.getItem("token");

export const getProfile = async () => {
  return await axios.get(
    `${API}/profile`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
};

export const updateProfile = async (data) => {
  return await axios.put(
    `${API}/profile`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
};

export const changePassword = async (data) => {
  return await axios.put(
    `${API}/change-password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
};