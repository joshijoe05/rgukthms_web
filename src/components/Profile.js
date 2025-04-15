import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./Api"; // Ensure correct API setup
import "./ProfileStyles.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Prevent state updates if unmounted

    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/auth/profile"); // Ensure correct API endpoint
        console.log("API Response:", response.data); // Debugging log

        if (isMounted && response.data) {
          
          setUser(response.data.data.user); // Set user data
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);

        if (error.response) {
          console.error("Error Response:", error.response.data); // Log API error response
        }

        // Handle unauthorized access (e.g., expired token)
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false; // Cleanup to avoid memory leaks
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <div className="profile-container">
      <button className="profile-logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h2>User Profile</h2>
      {user ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.contactNumber}</p>
          <p><strong>Role:</strong> {user.role.toUpperCase()}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
