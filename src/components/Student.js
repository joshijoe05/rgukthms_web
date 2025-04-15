import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Student.css";
import api from "./Api";

import { jwtDecode } from "jwt-decode";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
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
      fetchStudents(currentPage, selectedHostel);
    }
  }, [currentPage, role, selectedHostel]);

  const fetchStudents = async (page, hostelId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/hostel/students?hostelId=${hostelId}&page=${page}`);
      setStudents(response.data.data.students);
      setTotalPages(response.data.data.meta.totalPages);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="students-container">
      <h2>Student List</h2>

      {loading && (
        <div className="students-loader-container">
          <div className="students-loader"></div>
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
      {!loading && !error && students.length === 0 && <p>No students available.</p>}
      {!loading && !error && students.length > 0 && (
        <>
          <table className="students-styled-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Hostel</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id} className="clickable-row">
                  <td>{index + 1 + (currentPage - 1) * 10}</td>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.contactNumber}</td>
                  <td>{student.hostelId.name || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="students-pagination">
            {[...Array(totalPages)].map((_, pageIndex) => (
              <button
                key={pageIndex}
                className={`students-page-btn ${currentPage === pageIndex + 1 ? "active" : ""}`}
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

export default Student;
