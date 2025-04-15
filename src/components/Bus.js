import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import BusDetails from "./BusDetails";
import BookingDetails from "./BookingDetails";
import api from "./Api"; // Assuming you have an api.js file for API requests
import CircularProgress from "@mui/material/CircularProgress"; // Importing CircularProgress
import "./Bus.css";

const Bus = () => {
  const [busData, setBusData] = useState([]);
  const [totalBuses, setTotalBuses] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [showForm, setShowForm] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch buses data
  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bus?page=${page}&limit=${limit}`);
      const buses = res.data.data.busRoutes;
      const total = res.data.data.meta.totalPages;

      setBusData(buses);
      setTotalBuses(total);
    } catch (err) {
      setError("Failed to fetch bus data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch buses when page changes
  useEffect(() => {
    fetchBuses();
  }, [page]);

  const handleCreateBus = () => {
    setShowForm(false);
    fetchBuses(); // Refresh after creation
  };

  const totalPages = Math.ceil(totalBuses / limit);

  return (
    <div className="buss-container">
      {!showForm && !selectedBus ? (
        <>
          <div className="buss-header">
            <h2 className="buss-title">Bus Management</h2>
            <button className="buss-create-button" onClick={() => setShowForm(true)}>
              Create
            </button>
          </div>

          {loading ? (
            <div className="buss-loader-container">
              <CircularProgress style={{ color: "white" }} />
            </div>
          ) : error ? (
            <p className="buss-error">{error}</p>
          ) : (
            <>
              <div className="buss-table-container">
                <table className="buss-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Name</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {busData.map((bus, index) => (
                      <tr key={bus._id}>
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{bus.name}</td>
                        <td>{bus.from}</td>
                        <td>{bus.to}</td>
                        <td>{bus.busType}</td>
                        <td className="buss-action-cell">
                          <button className="buss-arrow-button" onClick={() => setSelectedBus(bus)}>
                            <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="buss-pagination">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      className={`buss-page-circle ${pageNumber === page ? 'active' : ''}`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : showForm ? (
        <BusDetails onClose={() => setShowForm(false)} onCreate={handleCreateBus} />
      ) : (
        <BookingDetails busId={selectedBus._id} onClose={() => setSelectedBus(null)} />
      )}
    </div>
  );
};

export default Bus;
