import React, { useState, useEffect } from "react";
import HostelName from "./HostelName";
import HostelForm from "./HostelForm";
import CareTaker from "./CareTaker";
import Student from "./Student";
import Issues from "./Issues";
import Profile from "./Profile";
import BusCreation from "./BusCreation";
import { jwtDecode } from "jwt-decode";

import "./styles.css";
import Bus from "./Bus";

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Token decode error", err);
      }
    }
  }, []);
  useEffect(() => {
    if (role === "admin") {
      setSelectedOption("hostels");
    } else {
      setSelectedOption("issues");
    }
  }, [role]);

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="logo">RGUKT</h1>
        <nav>
          <ul>
            {role === "admin" && (<li
              className={`nav-item ${selectedOption === "hostels" ? "active" : ""}`}
              onClick={() => { setSelectedOption("hostels"); setShowForm(false); }}
            >
              Hostels
            </li>)}
            {role === "admin" && (<li
              className={`nav-item ${selectedOption === "caretakers" ? "active" : ""}`}
              onClick={() => setSelectedOption("caretakers")}
            >
              Caretakers
            </li>)}
            <li
              className={`nav-item ${selectedOption === "issues" ? "active" : ""}`}
              onClick={() => setSelectedOption("issues")}
            >
              Issues
            </li>
            <li
              className={`nav-item ${selectedOption === "students" ? "active" : ""}`}
              onClick={() => setSelectedOption("students")}
            >
              Students
            </li>
            {role === "admin" && (<li
              className={`nav-item ${selectedOption === "buscreation" ? "active" : ""}`}
              onClick={() => setSelectedOption("buscreation")}
            >
              Bus Creation
            </li>)}
            {role === "admin" && (<li
              className={`nav-item ${selectedOption === "bus" ? "active" : ""}`}
              onClick={() => setSelectedOption("bus")}
            >
              Bus
            </li>)}
            <li
              className={`nav-item ${selectedOption === "profile" ? "active" : ""}`}
              onClick={() => setSelectedOption("profile")}
            >
              Profile
            </li>

          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {selectedOption === "hostels" && role === "admin" && !showForm && <HostelName onAddHostel={() => setShowForm(true)} />}
        {selectedOption === "hostels" && role === "admin" && showForm && <HostelForm onCancel={() => setShowForm(false)} />}
        {selectedOption === "caretakers" && role === "admin" && <CareTaker />}
        {selectedOption === "issues" && <Issues />}
        {selectedOption === "students" && <Student />}
        {selectedOption === "buscreation" && role === "admin" && <BusCreation />}
        {selectedOption === "bus" && role === "admin" && <Bus />}
        {selectedOption === "profile" && <Profile />}


      </div>
    </div>
  );
};

export default AdminDashboard;
