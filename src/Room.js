import React, { useState } from "react";
import "./roomStyles.css";

const Room = () => {
  const [selectedHostel, setSelectedHostel] = useState("K2");

  // Data for different hostels
  const hostelData = {
    K2: { total: 120, present: 90, vacantRooms: { "Ground Floor": [2, 5, 8, 11], "First Floor": [3, 6, 9, 12], "Second Floor": [1, 4, 7, 10], "Third Floor": [2, 5, 8] } },
    K3: { total: 100, present: 75, vacantRooms: { "Ground Floor": [1, 3, 7, 12], "First Floor": [2, 4, 8, 10], "Second Floor": [5, 9, 13], "Third Floor": [3, 6, 9] } },
    I1: { total: 80, present: 60, vacantRooms: { "Ground Floor": [4, 6, 9, 11], "First Floor": [3, 7, 12], "Second Floor": [2, 5, 8], "Third Floor": [1, 4, 7, 10] } },
  };

  const { total, present, vacantRooms } = hostelData[selectedHostel];
  const absent = total - present;

  const floors = [
    { name: "Ground Floor", rooms: 40 },
    { name: "First Floor", rooms: 40 },
    { name: "Second Floor", rooms: 40 },
    { name: "Third Floor", rooms: 40 },
  ];

  return (
    <div className="room-container">
      {/* Hostel Selection & Stats */}
      <div className="header">
        <div className="hostel-selection">
          {Object.keys(hostelData).map((hostel) => (
            <button
              key={hostel}
              className={selectedHostel === hostel ? "active" : ""}
              onClick={() => setSelectedHostel(hostel)}
            >
              {hostel}
            </button>
          ))}
        </div>
        <div className="stats">
          <p>Total: <span>{total}</span></p>
          <p>Present: <span className="present">{present}</span></p>
          <p>Absent: <span className="absent">{absent}</span></p>
        </div>
      </div>

      {/* Rooms Grid - Two Rows */}
      <div className="rooms-grid">
        {/* Row 1 - Ground & First Floor */}
        <div className="row">
          {floors.slice(0, 2).map((floor, index) => (
            <div key={index} className="floor">
              <h3>{floor.name}</h3>
              <div className="grid">
                {Array.from({ length: floor.rooms }, (_, i) => {
                  const roomNumber = i + 1;
                  const isVacant = vacantRooms[floor.name]?.includes(roomNumber);
                  return (
                    <div key={i} className={`room ${isVacant ? "vacant" : ""}`}>
                      {roomNumber}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 - Second & Third Floor */}
        <div className="row">
          {floors.slice(2, 4).map((floor, index) => (
            <div key={index} className="floor">
              <h3>{floor.name}</h3>
              <div className="grid">
                {Array.from({ length: floor.rooms }, (_, i) => {
                  const roomNumber = i + 1;
                  const isVacant = vacantRooms[floor.name]?.includes(roomNumber);
                  return (
                    <div key={i} className={`room ${isVacant ? "vacant" : ""}`}>
                      {roomNumber}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Room;
