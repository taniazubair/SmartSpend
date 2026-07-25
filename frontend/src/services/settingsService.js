import axios from "axios";

const API = "http://localhost:5000/api/users";


const getToken = () => {
  return localStorage.getItem("token");
};


// GET PROFILE
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


// UPDATE PROFILE
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


// CHANGE PASSWORD
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