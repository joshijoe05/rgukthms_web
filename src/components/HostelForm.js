import React, { useState } from "react";
import "./HostelFormStyles.css";
import api from "./Api";

const HostelForm = ({ onCancel }) => {
  const [hostelName, setHostelName] = useState("");
  const [numRooms, setNumRooms] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hostelData = {
      name: hostelName,
      totalRooms: Number(numRooms),
    };

    try {
      const response = await api.post("/hostel/create", JSON.stringify(hostelData));
      const data = await response.data;
      console.log(data);

      if (response.status === 201) {
        alert("Hostel created successfully!");
        setHostelName("");
        setNumRooms("");
        onCancel();
      } else {
        alert(data.message || "Failed to create hostel");
      }
    } catch (error) {
      console.error("Error creating hostel:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hostel-form-container">
      <h2>Create Hostel</h2>
      <form className="hostel-form" onSubmit={handleSubmit}>
        <label>Hostel Name</label>
        <input
          type="text"
          placeholder="Enter hostel name"
          value={hostelName}
          onChange={(e) => setHostelName(e.target.value)}
          required
        />

        <label>Number of Rooms</label>
        <input
          type="number"
          placeholder="Enter number of rooms"
          value={numRooms}
          onChange={(e) => setNumRooms(e.target.value)}
          required
        />

        <div className="hostel-button-group">
          <button type="submit" className="hostel-create-button" disabled={loading}>Create</button>
          <button type="button" className="hostel-cancel-button" onClick={onCancel} disabled={loading}>Cancel</button>
        </div>

        {/* Loader below buttons */}
        {loading && <div className="hostel-loader-container"><div className="hostel-loader"></div></div>}
      </form>
    </div>
  );
};

export default HostelForm;