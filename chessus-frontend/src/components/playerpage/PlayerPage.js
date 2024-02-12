import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import styles from "./player-page.module.scss";
import { deleteUser } from "../../actions/auth";
import axios from "axios";

const PlayerPage = (props) => {
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
            <div className={styles["player-info"]}>Player Information</div>
            <table className={styles["player-page-table"]}>
              <tbody>
                <tr>
                  <td>Username:</td>
                  <td>{username}</td>
                </tr>
                <tr>
                  <td>First name:</td>
                  <td>{userInfo.first_name ? userInfo.first_name : "N/A"}</td>
                </tr>
                <tr>
                  <td>Last name:</td>
                  <td>{userInfo.last_name ? userInfo.last_name : "N/A"}</td>
                </tr>
                <tr>
                  <td>ID:</td>
                  <td>{userInfo.id}</td>
                </tr>
              </tbody>
            </table>
          </div>
           : 
           <div className={styles["user-not-found"]}>
              <strong>
                <header>
                  User not found!
                </header>
              </strong>
           </div>}
      {currentUser.username === username ?
            <div className={styles["profile-buttons"]}>
            <button className={styles["profile-button"]} onClick={handleDelete}>Delete Account</button>
            <button className={styles["profile-button"]} onClick={handleEdit}>Edit Account</button> 
            </div>
            : ""}
    </div>
  );
};

export default PlayerPage;