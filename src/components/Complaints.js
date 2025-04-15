import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./Api";
import "./Complaints.css";

const Complaints = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);
        console.log(response.data);
        
        setComplaint(response.data.data);
      } catch (err) {
        setError("Failed to fetch complaint details.");
      }
      setLoading(false);
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="complaint-loader"></div> // Display loader
    );
  }

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="complaint-details">
      <h2>Complaint Details</h2>
      <p><strong>Issue ID:</strong> {complaint._id}</p>
      <p><strong>Type:</strong> {complaint.type.toUpperCase()}</p>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Student Name:</strong> {complaint.raised_by}</p>
      <p><strong>Hostel:</strong> {complaint.hostel}</p>
      <p><strong>Priority:</strong> {complaint.priority.toUpperCase()}</p>
      <p><strong>Status:</strong> {complaint.status.toUpperCase()}</p>
  
      {/* Conditionally render images if the list is not empty */}
      {complaint.images && complaint.images.length > 0 && (
        <div className="complaint-images">
          <h3>Attached Images:</h3>
          <div className="image-gallery">
            {complaint.images.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`Complaint Image ${index + 1}`} className="complaint-image" />
            ))}
          </div>
        </div>
      )}
  
      <button className="back-button" onClick={() => navigate('/complaints')}>
        Back to Issues
      </button>
    </div>
  );
};

export default Complaints;
