import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from "./not-found.module.scss";

class NotFound extends Component {
  render () {
    return <div>
      <h1 className={styles["not-found-text"]}>Sorry, we couldn't find a page here!</h1>
      <Link className={styles["not-found-link"]} to="/">Back to home</Link>
    </div>
  }
}

export default NotFound