import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import SignUp from './components/signup/SignUp';
import Login from "./components/signin/Login";
import Register from "./components/signup/Register";
import Profile from "./components/profile/Profile";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { history } from "./helpers/history";
import NotFound from './components/notfound/NotFound';
import "./App.css";

function App() {

  // const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  // const [showAdminBoard, setShowAdminBoard] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  // useEffect(() => {
  //   if (currentUser) {
  //     setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
  //     setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
  //   }
  // }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Router history={history}>
      <div className="app">
        <div className="app-header">
          <Navbar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;