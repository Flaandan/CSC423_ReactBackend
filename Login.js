import React, { useState } from 'react';
import './Login.css';
import logo from './assets/Brockport_logo.avif';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="logo" /> 
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Your Account</h2>

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">Login</button>

        <p className="forgot-password">
          <a href="#">Forgot your password?</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
