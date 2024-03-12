import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import styles from "./forum.module.scss";
import { deleteUser } from "../../actions/auth";
import StandardButton from "../standardbutton/StardardButton";
import axios from "axios";

const Forum = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  
  const [loading, setLoading] = useState(false);
  const [ messageDisplay, setMessageDisplay ] = useState(false);
  const dispatch = useDispatch();
  const [firstRender, setFirstRender] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [realUser, setRealUser] = useState(false);
  
  const navigate = useNavigate();

  const { username } = useParams();

  useEffect(() => {
    if (!firstRender) {
      checkIfRealUser(username);
      setFirstRender(true);
    }
  }, [firstRender]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteUser(currentUser.username))
  };

  const handleEdit = (e) => {
    e.preventDefault();
    navigate("/profile/edit");
  }

  const checkIfRealUser = (username) => {
    axios.get('http://localhost:3001/user', 
     {params: { username: username}})
    .then (res => {
        setUserInfo(currentUser);
        setUserInfo(res.data.result);
      setRealUser(true);
    })
    .catch(
      err => {
        setRealUser(false);
        console.log(err);
    })
  }

  return (
    <div className="container">
          {realUser ? 
          <div className={styles["player-page-table-container"]}>
            <div className={styles["player-info"]}>Forum</div>
            <table className={styles["player-page-table"]}>
              <tbody>
                <tr>
                  <td>Username:</td>
                  <td>{username}</td>
                </tr>
                <tr>
                  <td>First name:</td>
                  <td>{username === currentUser.username ? (currentUser.first_name ? currentUser.first_name : "N/A") 
                  : userInfo.first_name ? userInfo.first_name : "N/A"}</td>
                </tr>
                <tr>
                  <td>Last name:</td>
                  <td>{username === currentUser.username ? (currentUser.last_name ? currentUser.last_name : "N/A") 
                  : userInfo.last_name ? userInfo.last_name : "N/A"}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>{username === currentUser.username ? (currentUser.email ? currentUser.email : "N/A") 
                  : userInfo.email ? userInfo.email : "N/A"}</td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>{username === currentUser.username ? (currentUser.phone ? currentUser.phone : "N/A") 
                  : userInfo.phone ? userInfo.phone : "N/A"}</td>
                </tr>
                <tr>
                  <td>Role:</td>
                  <td>{username === currentUser.username ? (currentUser.role ? currentUser.role : "N/A")
                  : userInfo.role ? userInfo.role : "N/A"}</td>
                </tr>
                <tr>
                  <td>Last Active:</td>
                  <td>{username === currentUser.username ? (currentUser.last_active_at ? currentUser.last_active_at : "N/A") 
                  : userInfo.last_active_at ? userInfo.last_active_at : "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
           : 
           <div className={styles["user-not-found"]}>
              <strong>
                <header>
                  Player with username "{username}" not found!
                </header>
              </strong>
           </div>}
      {currentUser.username === username ?
            <div className={styles["profile-buttons"]}>
              <div className={styles["profile-button"]}>
                <StandardButton buttonText={"Delete Account"} onClick={handleDelete} />
              </div>
              <div className={styles["profile-button"]}>
                <StandardButton buttonText={"Edit Account"} onClick={handleEdit} />
              </div>
            </div>
            : ""}
    </div>
  );
};

export default Forum;