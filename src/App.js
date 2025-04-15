import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import api from "./components/Api";
import CircularProgress from "@mui/material/CircularProgress";
import Complaints from "./components/Complaints";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // ✅ Use state

  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return payload.exp * 1000 > Date.now(); // Check expiration
    } catch (error) {
      console.error("Invalid Token:", error);
      return false;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await api.post("/auth/refresh", { refreshToken });
      localStorage.setItem("accessToken", response.data.accessToken);
      return true;
    } catch (error) {
      console.error("Token Refresh Failed:", error);
      return false;
    }
  };

  const validateAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!isTokenValid(accessToken) && isTokenValid(refreshToken)) {
      const refreshed = await refreshAccessToken();
      return refreshed;
    }
    return isTokenValid(accessToken);
  };

  // ✅ Run authentication check on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await validateAuth();
      setIsAuthenticated(authStatus);
    };
    checkAuth();
  }, []);

  // ✅ Prevent rendering until authentication is checked
  if (isAuthenticated === null) {
    return <div className="loader-container" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress style={{ color: "white" }} />
    </div>
  }

  return (
    // <div style={{ height: "100vh", overflow: "hidden" }}>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/admindashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/admindashboard" /> : <Login />} />
          <Route path="/admindashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/complaints/:id" element={<Complaints />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>

  );
};

export default App;
