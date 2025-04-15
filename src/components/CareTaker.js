import React, { useEffect, useState } from "react";
import CareTakerForm from "./CareTakerForm";
import CircularProgress from "@mui/material/CircularProgress";
import api from "./Api";
import "./CareTakerStyles.css";

const CareTaker = () => {
  const [caretakers, setCaretakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch caretakers from API
  useEffect(() => {
    const fetchCaretakers = async () => {
      try {
        const response = await api.get("/caretaker/");
        console.log(response.data);
        setCaretakers(response.data.data.caretakers);
      } catch (error) {
        console.error("Error fetching caretakers:", error);
        setError("Failed to load caretakers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCaretakers();
  }, []);

  // Add caretaker function
  const addCaretaker = async (newCaretaker) => {
    try {
      const response = await api.post("/caretaker/", newCaretaker);
      setCaretakers([...caretakers, response.data.data]); // Update list with new caretaker
      setShowForm(false);
    } catch (error) {
      console.error("Error adding caretaker:", error);
      setError("Failed to add caretaker.");
    }
  };

  return (
    <div className="caretaker-container">
      {!showForm ? (
        <>
          <button className="add-caretaker-button" onClick={() => setShowForm(true)}>
            Add Caretaker
          </button>

          <h2 className="caretaker-title">Caretakers List</h2>

          {loading ? (
            <div className="caretaker-loader-container">
              <CircularProgress style={{ color: "white" }} />
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : caretakers.length === 0 ? (
            <p>No caretakers available.</p>
          ) : (
            <div className="table-container">
              <table className="caretaker-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {/* <th>Password</th> */}
                    <th>Phone Number</th>
                    <th>Hostel</th>
                  </tr>
                </thead>
                <tbody>
                  {caretakers.map((caretaker) => (
                    <tr key={caretaker._id}>
                      <td>{caretaker.fullName}</td>
                      <td>{caretaker.email}</td>
                      {/* <td>{caretaker.password}</td> */}
                      <td>{caretaker.contactNumber}</td>
                      <td>{caretaker.hostel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <CareTakerForm onCancel={() => setShowForm(false)} onAdd={addCaretaker} />
      )}
    </div>
  );
};

export default CareTaker;
