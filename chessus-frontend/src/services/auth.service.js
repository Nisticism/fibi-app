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

const updateUser = (updatedData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  Object.keys(updatedData).forEach((key) => {
      user[key] = updatedData[key];
  });
  localStorage.setItem('user', JSON.stringify(user));
}

const edit = (username, password, email, first_name, last_name, phone, id) => {
  console.log("in auth service");
  console.log("btw the password is still: " + password);
  // localStorage.removeItem("user");
  if (email === "") {
    email = null;
  }
  if (phone === "") {
    phone = null;
  }
  return axios.post(API_URL + "profile/edit", {
    username,
    password,
    email,
    first_name, 
    last_name,
    phone,
    id,
  })
  .then((response) => {
    if (response.data.result.username) {
      updateUser(response.data.result);
    }
    return response.data;
  });
}

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
  edit,
  login,
  logout,
  getCurrentUser,
  deleteUser,
}

export default AuthService;