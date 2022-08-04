import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.scss';

const SignUp = () => {

  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loginStatus, setLoginStatus] = useState(false);

  const navigate = useNavigate();

  const signup = () => {
    Axios.post('http://localhost:3001/signup', {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      console.log(response);
    });
  };

  const login = () => {
    Axios.post('http://localhost:3001/login', {
      username: username,
      password: password,
    }).then((response) => {
      
      if (!response.data.auth) {
        setLoginStatus(false)
      } else {
        console.log(response.data)
        localStorage.setItem("token", response.data.token);
        setLoginStatus(true);
        navigate('/');
      }
    });
  };
  
  return ( 
    <div className="wrapper center">
      <div className="registration">
        <h1>Sign Up</h1>
        <label>Username</label>
        <input type="text" onChange={(e) => {setUsernameReg(e.target.value);}}/>
        <label>Password</label>
        <input type="password" onChange={(e) => {setPasswordReg(e.target.value);}}/>
        <button onClick={signup}>Sign up</button>
      </div>
      <hr></hr>
      <h2>Already have an account?</h2>

      <div className="login">
        <h2>Log In</h2>
        <label>Username</label>
        <input type="text" placeholder="Username..." onChange={(e) => {setUsername(e.target.value);}}/>
        <label>Password</label>
        <input type="password" placeholder="Password..." onChange={(e) => {setPassword(e.target.value);}}/>
        <button onClick={login}>Login</button>
      </div>
      <h1>{loginStatus }</h1>
    </div>
   );
}
 
export default SignUp;