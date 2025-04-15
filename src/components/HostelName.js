import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./HostelNameStyles.css";
import axios from "axios";
import api from "./Api";

const HostelName = ({ onAddHostel }) => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Fetch hostel details from API
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await api.get("/hostel/");
        const data = await response.data;
        console.log(data);
        setHostels(data.data.hostels);
      } catch (error) {
        console.error("Error fetching hostels:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      
      }
    };

    fetchHostels();
  }, []);

  return (
    <div className="hostel-name-container">
      {/* Add Hostel Button */}
      <button className="add-hostel-button" onClick={onAddHostel}>
        Add Hostel
      </button>

      {/* Hostel List Table */}
      <h2>Hostel List</h2>

      {loading ? (
        
        <div className="hostelname-loader-container">
        <CircularProgress style={{ color: "white" }} />
      </div>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : hostels.length === 0 ? (
        <p>No hostels available.</p>
      ) : 

      <table className="hostel-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th className="spaced">Name</th>
            <th className="spaced">Total Rooms</th>
            <th className="spaced">No. of Caretakers</th>
            <th className="spaced">Caretakers</th>
          </tr>
        </thead>
        <tbody>
          {hostels.length > 0 ? (
            hostels.map((hostel, index) => (
              <tr key={hostel._id}>
                <td>{index + 1}</td>
                <td className="spaced">{hostel.name}</td>
                <td className="spaced">{hostel.totalRooms}</td>
                <td className="spaced">{hostel.caretakers.length}</td>
                <td className="spaced">{hostel.caretakers.join(", ")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hostels available</td>
            </tr>
          )}
        </tbody>
      </table>
}
    </div>
  );
};

export default HostelName;
