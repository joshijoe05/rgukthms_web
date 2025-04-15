import React, { useState } from "react";
import Occupancy from "./Occupancy";
import Room from "./Room";
import HostelForm from "./HostelForm"; // Importing HostelForm

const AppContent = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelection = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="logo">RGUKT</h1>
        <nav>
          <ul>
            <li onClick={() => handleSelection("hostels")} className="nav-item">Hostels</li>
            <li onClick={() => handleSelection("caretakers")} className="nav-item">Caretakers</li>
            <li onClick={() => handleSelection("issues")} className="nav-item">Issues</li>
            <li onClick={() => handleSelection("students")} className="nav-item">Students</li>
            <li onClick={() => handleSelection("buses")} className="nav-item">Buses</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <h2>Admin Dashboard</h2>
          <div className="profile">👤</div>
        </header>

        {/* Conditional Rendering for Components */}
        {selectedOption === "hostels" && <HostelForm />}
        {selectedOption === "caretakers" && <Room />}
      </div>
    </div>
  );
};

export default AppContent;
