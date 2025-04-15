import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Issues.css";
import api from "./Api";
import { jwtDecode } from "jwt-decode";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

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
    const fetchHostels = async () => {
      console.log(role);
      if (role !== "admin") return;
      setLoading(true);
      try {
        const response = await api.get("/hostel/");
        setHostels(response.data.data.hostels);
        if (response.data.data.hostels.length > 0) {
          setSelectedHostel(response.data.data.hostels[0]._id);
        }
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
      setLoading(false);
    };
    fetchHostels();
  }, [role]);

  useEffect(() => {
    if (role === "caretaker" || selectedHostel) {
      fetchIssues(currentPage, selectedHostel);
    }
  }, [currentPage, role, selectedHostel]);

  const fetchIssues = async (page, hostelId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/complaints/hostel?hostelId=${hostelId}&page=${page}`
      );
      setIssues(response.data.data.complaints);
      setTotalPages(response.data.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to load issues. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="issues-container">
      <h2>Issues Reported</h2>

      {loading && (
        <div className="issues-loader-container">
          <div className="issues-loader"></div>
        </div>
      )}

      {!loading && role === "admin" && (
        <div className="hostel-select-container">
          <label htmlFor="hostel-select">Select Hostel: </label>
          <select
            id="hostel-select"
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
          >
            {hostels.map((hostel) => (
              <option key={hostel._id} value={hostel._id}>
                {hostel.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
      {!loading && !error && issues.length === 0 && <p>No issues found.</p>}
      {!loading && !error && issues.length > 0 && (
        <>
          <table className="issues-styled-table">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Issue Type</th>
                <th>Description</th>
                <th>Student Name</th>
                <th>Hostel Name</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue._id}
                  onClick={() => navigate(`/complaints/${issue._id}`)} // Navigate to Complaints.js
                  className="clickable-row"
                >
                  <td>{issue._id}</td>
                  <td>{issue.type.toUpperCase()}</td>
                  <td>{issue.description}</td>
                  <td>{issue.raised_by}</td>
                  <td>{issue.hostel}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="issues-pagination">
            {[...Array(totalPages)].map((_, pageIndex) => (
              <button
                key={pageIndex}
                className={`issues-page-btn ${currentPage === pageIndex + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(pageIndex + 1)}
              >
                {pageIndex + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Issues;
