import React from "react";
import styles from "./standard-button.module.scss";
function StandardButton ({buttonText, onClick}) {
  return (
    <button className={styles["standard-button"]} onClick={onClick}>{buttonText}</button>
  );
};

export default StandardButton;