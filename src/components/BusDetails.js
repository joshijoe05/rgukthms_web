import React, { useState, useEffect } from "react";
import "./BusDetails.css";
import api from "./Api";

const apDistricts = [
  "Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna",
  "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram",
  "West Godavari", "NTR", "Eluru", "Bapatla", "Palnadu", "Parvathipuram Manyam",
  "Alluri Sitharama Raju", "Annamayya", "KonaSeema", "Tirupati", "Nuzvid"
];

const BusDetails = ({ onClose, onCreate }) => {
  const [bus, setBus] = useState({
    from: "Nuzvid",
    to: "",
    name: "",
    busType: "",
    busFare: "",
    date: "",
    hostels: [],
    seatsAvailable: "", departureTime: "",
  });

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateTimeISO = new Date(`${bus.date}T${bus.departureTime}:00`).toISOString();

  const busData = {
    ...bus,
    departureTime: dateTimeISO,
  };
    try {
      const response = await api.post("/bus/create", busData);
      console.log("Bus created:", response.data);

      onClose(); // Close the modal or form
    } catch (error) {
      console.error("Error creating bus:", error);
      alert("Failed to create bus. Please try again.");
    }
  };
  

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await api.get("/hostel/");
        setHostels(response.data.data.hostels);
      } catch (err) {
        console.error("Error fetching hostels:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus({ ...bus, [name]: value });
  };

  const handleHostelSelect = (e) => {
    const selectedId = e.target.value;
    if (!bus.hostels.includes(selectedId)) {
      setBus({ ...bus, hostels: [...bus.hostels, selectedId] });
    }
  };

  const handleHostelRemove = (id) => {
    setBus({ ...bus, hostels: bus.hostels.filter((hostelId) => hostelId !== id) });
  };


  return (
    <div className="busdetails-container">
      <h3 className="busdetails-title">Create New Bus</h3>
      <form className="busdetails-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>From:</label>
          <select name="from" value={bus.from} onChange={handleChange} required>
            {apDistricts.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>To:</label>
          <select name="to" value={bus.to} onChange={handleChange} required>
            <option value="">Select Destination</option>
            {apDistricts.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Bus Name:</label>
          <input type="text" name="name" value={bus.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Bus Type:</label>
          <select name="busType" value={bus.busType} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="Express">Express</option>
            <option value="Super Luxury">Super Luxury</option>
            <option value="Ultra Deluxe">Ultra Deluxe</option>
          </select>
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <input type="number" name="busFare" value={bus.busFare} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={bus.date} onChange={handleChange} required />
        </div>

        <label>Departure Time:</label>
<input
  type="time"
  name="departureTime"
  value={bus.departureTime}
  onChange={handleChange}
  required
/>


        <div className="form-group">
          <label>Hostels:</label>
          <select onChange={handleHostelSelect} className="busdetails-dropdown">
            <option value="">Select Hostel</option>
            {hostels.map((hostel) => (
              !bus.hostels.includes(hostel._id) && (
                <option key={hostel._id} value={hostel._id}>
                  {hostel.name}
                </option>
              )
            ))}
          </select>

          <div className="busdetails-selected-hostels">
            {bus.hostels.map((id) => {
              const hostel = hostels.find(h => h._id === id);
              return (
                <div key={id} className="busdetails-hostel-chip">
                  {hostel?.name}
                  <button type="button" onClick={() => handleHostelRemove(id)}>×</button>
                </div>
              );
            })}
            {bus.hostels.length === 0 && <p className="busdetails-hint">No hostel selected.</p>}
          </div>
        </div>

        {loading && <p className="busdetails-info">Loading hostels...</p>}
        {error && <p className="busdetails-error">{error}</p>}

        <div className="form-group">
          <label>Seats:</label>
          <input type="number" name="seatsAvailable" value={bus.seatsAvailable} onChange={handleChange} required />
        </div>

        <div className="busdetails-button-group">
          <button type="submit" className="busdetails-create-button">Create</button>
          <button type="button" className="busdetails-cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BusDetails;
