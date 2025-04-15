import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress"; // Import MUI spinner
import "./LoginStyles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track login progress
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let customError = null;
    try {
      const response = await axios.post(
        "https://rgukt-hms.vercel.app/api/v1/auth/login",
        { email, password }
      );
      console.log(response.data);
      if (response.data.data.user.role !== "admin" && response.data.data.user.role !== "caretaker") {
        customError = "You are not authorized to access this page.";
        throw new Error();
      }

      const { accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Redirect to Admin Dashboard
      window.location.href = "/admindashboard";
    } catch (err) {
      setError(customError || err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false); // Stop loading after login attempt
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
};

export default Login;
