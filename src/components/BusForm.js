import React, { useState, useEffect } from 'react';
import './BusForm.css';
import api from './Api';

const Districts = [
  "Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna",
  "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram",
  "West Godavari", "NTR", "Eluru", "Bapatla", "Palnadu", "Parvathipuram Manyam",
  "Alluri Sitharama Raju", "Annamayya", "KonaSeema", "Tirupati", "Nuzvid"
];

const BusForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    selectedCity: [],
    selectedHostel: [],
    expiryDate: '',
    departureTime: ''
  });

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch hostels from API
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await api.get("/hostel/");
        setHostels(response.data.data.hostels || []);
      } catch (err) {
        console.error("Error fetching hostels:", err);
        setError(err.message);
      }
    };
    fetchHostels();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Merge date + time into ISO
    const expiresAt = new Date(`${formData.expiryDate}T${formData.departureTime}`).toISOString();

    const payload = {
      cities: formData.selectedCity,
      hostelId: formData.selectedHostel,
      expiresAt: expiresAt
    };

    try {
      const response = await api.post('/bus/form/create', JSON.stringify(payload));
      const data = await response.data;

      if (response.status === 201) {
        alert('Form Submitted Successfully!');
        setFormData({
          selectedCity: '',
          selectedHostel: '',
          expiryDate: '',
          departureTime: ''
        });
        onCancel();
      } else {
        alert(data.message || 'Failed to submit form.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bus-form-container">
      <div className="bus-form-header">
        <h2>Create New Bus Route</h2>
      </div>

      <form onSubmit={handleSubmit} className="bus-form-body">
      <div className="bus-form-group">
          <label>Select Cities:</label>
          <select
            onChange={(e) => {
              const selectedCity = e.target.value;
              if (selectedCity && !formData.selectedCity.includes(selectedCity)) {
                setFormData({
                  ...formData,
                  selectedCity: [...formData.selectedCity, selectedCity]
                });
              }
            }}
            className="busdetails-dropdown"
          >
            <option value="">Select City</option>
            {Districts.map((city, idx) => (
              !formData.selectedCity.includes(city) && (
                <option key={idx} value={city}>
                  {city}
                </option>
              )
            ))}
          </select>

          <div className="busdetails-selected-hostels">
            {formData.selectedCity.map((city, index) => (
              <div key={index} className="busdetails-hostel-chip">
                {city}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      selectedCity: formData.selectedCity.filter((c) => c !== city),
                    });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            {formData.selectedCity.length === 0 && (
              <p className="busdetails-hint">No city selected.</p>
            )}
          </div>
        </div>


        <div className="bus-form-group">
        <label>Select Hostels:</label>
        <select
          onChange={(e) => {
            const selectedId = e.target.value;
            if (selectedId && !formData.selectedHostel.includes(selectedId)) {
              setFormData({
                ...formData,
                selectedHostel: [...formData.selectedHostel, selectedId]
              });
            }
          }}
          className="busdetails-dropdown"
        >
          <option value="">Select Hostel</option>
          {hostels.map((hostel) => (
            !formData.selectedHostel.includes(hostel._id) && (
              <option key={hostel._id} value={hostel._id}>
                {hostel.name}
              </option>
            )
          ))}
        </select>

        <div className="busdetails-selected-hostels">
          {formData.selectedHostel.map((id) => {
            const hostel = hostels.find(h => h._id === id);
            return (
              <div key={id} className="busdetails-hostel-chip">
                {hostel?.name}
                <button type="button" onClick={() => {
                  setFormData({
                    ...formData,
                    selectedHostel: formData.selectedHostel.filter(hid => hid !== id)
                  });
                }}>×</button>
              </div>
            );
          })}
          {formData.selectedHostel.length === 0 && (
            <p className="busdetails-hint">No hostel selected.</p>
          )}
        </div>
      </div>



        <div className="bus-form-group">
          <label>Expiry Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bus-form-group">
          <label>Departure Time:</label>
          <input
            type="time"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bus-form-actions">
          <button type="submit" className="busform-submit-button" disabled={loading}>Submit</button>
          <button type="button" className="busform-cancel-button" onClick={onCancel} disabled={loading}>Cancel</button>
        </div>

        {loading && <div className="bus-loader-container"><div className="bus-loader"></div></div>}
        {error && <div className="busdetails-error">{error}</div>}
      </form>
    </div>
  );
};

export default BusForm;
