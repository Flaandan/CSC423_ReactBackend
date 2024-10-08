<<<<<<< Updated upstream:client/src/Login.jsx
import { useState } from "react";
import "./Login.css";
import BrockportLogo from "/BrockportLogo.jpg";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`${data.error}`);
    } else {
      const role = data.user.role;

      navigate(
        role === "ADMIN"
          ? "/adminDash"
          : role === "STUDENT"
            ? "/studentDash"
            : "/teacherDash",
      );
    }
  };

  const handleForgotPassword = () => {
    console.log("Redirect to forgot password page");
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin} className="form">
        <img src={BrockportLogo} alt="Brockport Logo" />
        <h2 className="DarkBlue-text">Sign In:</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="loginButton">
          Login
        </button>

        <div className="buttonContainer">
          <button onClick={handleForgotPassword} className="bottomButtons">
            Forgot Password
          </button>
=======
import { useState } from 'react';
import '../stylesheets/Login.css';
import BrockportLogo from '/BrockportLogo.jpg';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(`${data.error}`);
        } else {
            const role = data.user.role;

            navigate(
                role === "ADMIN"
                    ? "/adminDash"
                    : role === "STUDENT"
                        ? "/studentDash"
                        : "/teacherDash",
            );
        }
    };


    return (
        <div className="container">
            <form onSubmit={handleLogin} className="form">
                <img src={BrockportLogo} alt="Brockport Logo" />
                <h2 className="DarkBlue-text">Sign In:</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
                <button type="submit" className="loginButton">
                    Login
                </button>
            </form>
>>>>>>> Stashed changes:client/src/login/Login.jsx
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
