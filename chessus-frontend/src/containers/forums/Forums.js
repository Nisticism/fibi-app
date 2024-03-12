import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import styles from "./forums.module.scss";
import StandardButton from "../../components/standardbutton/StardardButton";
const Forums = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>Forums</strong>
        </h3>
      </header>
    <div className={styles["forums"]}>
    <table>
      <tbody>
        <tr>
          <th>
            Date
          </th>
          <th>
            Topic
          </th>
        </tr>
        <tr>
          <td>
            Test date
          </td>
          <td>
            Test Topic
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div className="buttons">
      <StandardButton buttonText={"Create Forum"} />
    </div>
    </div>
  );
};

export default Forums;