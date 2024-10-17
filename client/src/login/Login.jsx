import { useEffect, useState } from "react";
import "../stylesheets/Login.css";
import { useNavigate } from "react-router-dom";
import BrockportLogo from "/BrockportLogo.jpg";
import { JWT_KEY, useLocalState } from "../hooks/useLocalStorage";
import { apiFetch } from "../utils/apiFetch";
import { decodeJWT } from "../utils/decodeJWT";

function LoginPage() {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const params = {
      url: "http://localhost:8000/v1/auth/login",
      method: "POST",
      requestBody: {
        username,
        password,
      },
    };

    const response = await apiFetch(params);

    if (response.error) {
      alert(`${response.error}`);
    } else {
      const jwtToken = response.access_token;

      if (jwtToken) {
        setJwt(jwtToken);
      }
    }
  };

  useEffect(() => {
    if (jwt) {
      const decodedRole = decodeJWT(jwt).role;

      navigate(
        decodedRole === "ADMIN"
          ? "/adminDash"
          : decodedRole === "STUDENT"
            ? "/studentDash"
            : "/teacherDash",
      );
    }
  }, [jwt, navigate]);

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
    </div>
  );
}

export default LoginPage;
