import axios from "axios";
// import { response } from "express";

const API_URL = "http://localhost:3001/";

const register = (username, password, email) => {
  if (email === "") {
    email = null;
  }
  return axios.post(API_URL + "register", {
    username,
    password,
    email,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.result.username) {
        localStorage.setItem("user", JSON.stringify(response.data.result));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "logout").then((response) => {
    return response.data;
  });
};

const deleteUser = (username) => {
  localStorage.removeItem("user");
  return axios
    .post(API_URL + "delete", {
      username,
    })
    .then((response) => {
      return response.data;
  });
}

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  deleteUser,
}

export default AuthService;