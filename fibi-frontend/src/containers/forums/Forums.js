import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import styles from "./forums.module.scss";
import StandardButton from "../../components/standardbutton/StardardButton";
import { forums } from "../../actions/forums";
const Forums = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const allForums = useSelector((state) => state.forums);
  const navigate = useNavigate();
  const [firstRender, setFirstRender] = useState(false);
  // const [forums, setForums] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!firstRender) {
      console.log("in useeffect forums page");
      // dispatch(users());
      dispatch(forums());
      setFirstRender(true);
    }
  }, [firstRender]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  function createNewPost() {
    navigate("/forums/new");
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
    return month + "/" + day + "/" + year + " " + hoursTime + ":" + minutesTime + dayHalf;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3 className={styles["forum-page-title"]}>
          Forums
        </h3>
      </header>
    <div className={styles["forums"]}>
      {allForums.forums ? 
    <table className={styles["forums-table"]}>
      <tbody>
        <tr>
          <th>
            Date
          </th>
          <th>
            Username
          </th>
          <th>
            Subject
          </th>
          <th>
            Content
          </th>
        </tr>
          {
            allForums.forums.map(function(forum) {
              return (
                <tr key={forum.id} className={styles["forum-row"]}>
                    <td className={styles["date-td"]}>
                      {
                      formatDateFromString(forum.created_at.toString())
                      // forum.created_at
                      }
                    </td>
                    <td>
                    <div className={styles["forums-link"]}>
                        <Link to={`/profile/${forum.author_name}`}>
                          <div className={styles["forums-username"]}>{ forum.author_name }</div>
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div className={styles["forums-link"]}>
                        <br/>
                        <Link to={`/forums/${forum.id}`}>
                          <strong><div className={styles["forum-title"]}>{ forum.title }</div></strong> <br/> <div className={styles["forums-comments-likes"]}>Likes: {forum.likes ? forum.likes.length : 0} <br/> Comments: {forum.comment_count}</div>
                        </Link>
                      </div>
                    </td>
                    <td className={styles["content-td"]}>
                      <div className={styles["forum-content"]}>
                        {forum.content}
                      </div>
                    </td>
                </tr>
              )
            })
          }
      </tbody>
    </table>
    : 
    <h1>No Forums Found</h1>
      }
    </div>
      <div className="buttons">
        <StandardButton buttonText={"Create New Post"} onClick={createNewPost}/>
      </div>
    </div>
  );
};

export default Forums;