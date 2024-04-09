import React, { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import styles from "./edit-forum.module.scss";
import { deleteUser } from "../../actions/auth";
import StandardButton from "../standardbutton/StardardButton";
import { getForum, editForum } from "../../actions/forums";
import axios from "axios";

const EditForum = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const form = useRef();
  const checkBtn = useRef();
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [date, setDate] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [messageDisplay, setMessageDisplay] = useState(false);
  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentForum = useSelector((state) => state.forums.forum);
  const [firstRender, setFirstRender] = useState(false);

  const { forumId } = useParams();

  useEffect(() => {
    if (!firstRender) {
      console.log(forumId)
      dispatch(getForum(forumId));
      setFirstRender(true);
    }
  }, [firstRender]);

  const onChangeTitle = (e) => {
    const title = e.target.value;
    setTitle(title);
    // document.getElementById("title-field").value = e.target.value;
  };

  const onChangeContent = (e) => {
    const content = e.target.value;
    setContent(content);
  };

  const handleEditPost = (e) => {
    e.preventDefault();
    console.log("in handle edit post");
    const todaysDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setDate(todaysDate);
    let inputTitle = title;
    let inputContent = content;
    let last_updated_at = todaysDate;
    if (title === null) {
      inputTitle = currentForum.title;
    }
    if (content === null) {
      inputContent = currentForum.content;
      console.log(content);
    }
    console.log("title: " + title, "content: " + content);
    dispatch(editForum(inputTitle, inputContent, last_updated_at, forumId))
      .then(() => {
        navigate(`/forums/${forumId}`);
      })
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser && currentForum && currentForum.author_id != currentUser.id) {
    return <Navigate to="/" />;
  }

  
  function formatDateFromString(date) {
    let year = date.substring(0,4);
    let day = date.substring(8,10);
    let month = date.substring(5,7);
    let hoursTime = date.substring(11, 13);
    let minutesTime = date.substring(14, 16);
    let dayHalf = "am"
    if (hoursTime > 12) {
      dayHalf = "pm"
      hoursTime = (parseInt(hoursTime) - 12).toString();
    }
    if (hoursTime[0] === "0") {
      hoursTime = hoursTime.substring(1);
    }
    return month + "/" + day + "/" + year + " " + hoursTime + ":" + minutesTime + dayHalf;
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["wrapper"]}>
        {/* <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        /> */}
        <form ref={form}>
          {!successful && (
            <div>
              <h2 className={styles["edit-forum-title"]}>Edit Post</h2>
              <div className={styles["form-group"]}>
                <label htmlFor="username" className={styles["field-label"]}>Post Subject</label>
                <input
                  id="title-field"
                  type="text"
                  className={styles["forum-title-input"]}
                  name="title"
                  defaultValue={currentForum ? currentForum.title : title}
                  // value = {title}
                  onChange={onChangeTitle}
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="email" className={styles["field-label"]}>Content</label>
                <textarea
                  type="text"
                  className="form-control"
                  name="content"
                  defaultValue={currentForum ? currentForum.content : content}
                  onChange={onChangeContent}
                />
              </div>
              <div className="form-group">
                <StandardButton buttonText={"Update Post"} onClick={handleEditPost}></StandardButton>
              </div>
            </div>
          )}
          {message && messageDisplay && (
            <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
        <div className={styles["comments-container"]}>
        <h2>Comments</h2>
            {
            currentForum && currentForum.comments ? currentForum.comments.map(function(comment) {
              return (
                <div className={styles["comment-container"]} key={comment.id}>
                  <div className={styles["comment"]}>
                    <div className={styles["comment-data"]}>
                      <div className={styles["comment-date"]}>
                        {comment.last_updated_at === comment.created_at ? "" : "Last updated "}{ comment.last_updated_at ? formatDateFromString(comment.last_updated_at.toString()) : "" }
                      </div>
                      <div className={styles["comment-author"]}>
                        <div className={styles["comment-link"]}>
                            <Link to={`/profile/${comment.author_name}`}>
                              { comment.author_name }
                            </Link>
                        </div>
                      </div>
                      <div className={styles["comment-content"]}>
                        { comment.content }
                      </div>
                    </div>
                  </div>
                </div>
              )
            }) : "No comments so far"
          }
        </div>
      </div>
    </div>
  );
};
export default EditForum;