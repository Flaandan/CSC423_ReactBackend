import { useEffect, useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import BrockportLogo from "/BrockportLogo.jpg";
import { JWT_KEY, useLocalState } from "../hooks/useLocalStorage";
import { apiLogin } from "../lib/api";
import { decodeJWT } from "../utils/decodeJWT";

function LoginPage() {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (username.length === 0 || password.length === 0) {
      return;
    }

    const response = await apiLogin(username, password);

    if (response.error) {
      alert(`${response.error}`);
    } else {
      setJwt(response.accessToken);
    }
  };

  useEffect(() => {
    if (jwt) {
      const decodedRole = decodeJWT(jwt).user_role;

      navigate(
        decodedRole === "ADMIN"
          ? "/admin"
          : decodedRole === "STUDENT"
            ? "/student"
            : "/teacher",
      );
    }
  }, [jwt, navigate]);

  return (
    <div className="login-page-container">
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
      </div>
    </div>
  );
}

export default LoginPage;
