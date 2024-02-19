import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { useNavigate, Navigate } from "react-router-dom";
import { isEmail } from "validator";
import { edit } from "../../actions/auth";
import styles from "./edit-account.module.scss";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vFirstName = (value) => {
  if (value.length < 1 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The first name must be between 1 and 20 characters.
      </div>
    )
  }
}

const vLastName = (value) => {
  if (value.length < 1 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The last name must be between 1 and 20 characters.
      </div>
    )
  }
}

const vPhoneNumber = (value) => {
  if (value.length != 10) {
    return (
      <div className="alert alert-danger" role="alert">
        The phone number must be 10 digits!
      </div>
    )
  }
}

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const EditAccount = () => {

  const { user: currentUser } = useSelector((state) => state.auth);

  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState(currentUser && currentUser.username ? currentUser.username : "");
  const [email, setEmail] = useState(currentUser && currentUser.email ? currentUser.email : "");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [firstName, setFirstName] = useState(currentUser && currentUser.first_name ? currentUser.first_name : "");
  const [lastName, setLastName] = useState(currentUser && currentUser.last_name ? currentUser.last_name : "");
  const [phone, setPhone] = useState(currentUser && currentUser.phone ? currentUser.phone : "");
  const [successful, setSuccessful] = useState(false);
  const [messageDisplay, setMessageDisplay] = useState(false);
  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const id = currentUser.id;

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangeFirstName = (e) => {
    const first_name = e.target.value;
    setFirstName(first_name);
  }

  const onChangeLastName = (e) => {
    const last_name = e.target.value;
    setLastName(last_name);
  }

  const onChangePhoneNumber = (e) => {
    const phone = e.target.value;
    setPhone(phone);
  }

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangeOldPassword = (e) => {
    const oldPassword = e.target.value;
    setOldPassword(oldPassword);
  }

  const handleAccountUpdate = (e) => {
    e.preventDefault();
    console.log("edit submit clicked");
    setSuccessful(false);
    // form.current.validateAll();
    // if (checkBtn.current.context._errors.length === 0) {
      console.log("old password: " + oldPassword + " new password: " + password);
    dispatch(edit(username, password, email, firstName, lastName, phone, id))
      .then(() => {
        setSuccessful(true)
        .then(() => {
          console.log("navigating to profile")
          navigate("/profile/" + username);
        })
      })
      .catch(() => {
        setMessageDisplay(true);
        setSuccessful(false);
      });
    // }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["wrapper"]}>
        <div>
          <h1 className={styles["account-info-header"]}>
            Your Account Information
          </h1>
        </div>
        {/* <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        /> */}
        <form onSubmit={handleAccountUpdate} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="username" className={styles["field-label"]}>Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, vusername]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className={styles["field-label"]}>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="firstName" className={styles["field-label"]}>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  value={firstName}
                  onChange={onChangeFirstName}
                  validations={[required, vFirstName]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className={styles["field-label"]}>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  value={lastName}
                  onChange={onChangeLastName}
                  validations={[required, vLastName]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className={styles["field-label"]}>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone_number"
                  value={phone}
                  onChange={onChangePhoneNumber}
                  validations={[required, vPhoneNumber]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className={styles["field-label"]}>Old Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={oldPassword}
                  onChange={onChangeOldPassword}
                  validations={[required, vpassword]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className={styles["field-label"]}>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>
              <div className="form-group">
                <button className={styles["update-button"]}>Update Account</button>
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
          <button style={{ display: "none" }} ref={checkBtn} />
        </form>
      </div>
    </div>
  );
};
export default EditAccount;