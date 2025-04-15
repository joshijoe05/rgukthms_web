import React, { useState, useEffect } from "react";
import api from "./Api"; // Assuming you have an api.js file for API requests
import "./BookingDetails.css";

const BookingDetails = ({ busId, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  // Fetch bookings data using GET API with dynamic busId and pagination
  const fetchBookings = async (page) => {
    try {
      setLoading(true);
      const res = await api.get(`/bus/bookings/${busId}?page=${page}&limit=10`); // Example: 10 bookings per page
      setBookings(res.data.data.bookings); // Assuming the API returns bookings in a bookings field
      setTotalPages(res.data.data.meta.totalPages);
    } catch (err) {
      setError("Failed to fetch booking data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch data whenever busId or currentPage changes
  useEffect(() => {
    if (busId) {
      fetchBookings(currentPage);
    }
  }, [busId, currentPage]);

  return (
    <div className="bookingdetails-container">
      <h3 className="bookingdetails-title">Booking Details</h3>

      {/* Show loading spinner or error message if applicable */}
      {loading ? (
        <div className="loading-spinner"></div> // Loading spinner
      ) : error ? (
        <p className="bookingdetails-error">{error}</p>
      ) : (
        <table className="bookingdetails-table">
          <thead>
            <tr>
              <th>Passenger Name</th>
              <th>Passenger Email</th>
              <th>Passenger Phone</th>
              <th>Booked By</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.passengerName}</td>
                <td>{booking.passengerEmail}</td>
                <td>{booking.passengerPhone}</td>
                <td>{booking.userId.fullName}</td>
                <td>{booking.transactionId}</td>
                <td>{booking.amount}</td>
                <td className={`bookingdetails-status ${booking.status === "CONFIRMED" ? "CONFIRMED" : "PENDING"}`}>
                  {booking.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="booking-pagination">
        {[...Array(totalPages)].map((_, pageIndex) => (
          <button
            key={pageIndex}
            className={`booking-page-btn ${currentPage === pageIndex + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(pageIndex + 1)}
          >
            {pageIndex + 1}
          </button>
        ))}
      </div>

      <button className="bookingdetails-close-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default BookingDetails;
