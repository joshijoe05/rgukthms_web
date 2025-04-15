import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import BusForm from "./BusForm";
import BusAnalytics from "./BusAnalytics";
import "./BusCreation.css";
import api from "./Api";

const BusCreation = () => {
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);

  const fetchBusData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/bus/form?page=${page}&limit=10`);
      const buses = response.data?.data?.busForms || [];
      const pagination = response.data?.data?.meta;
      setBusData(Array.isArray(buses) ? buses : []);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching bus data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusData(currentPage);
  }, [currentPage]);

  return (
    <div className="buscreation-container">
      <div className="buscreation-header">
        <h2 className="buscreation-title">Bus Management</h2>
        {/* Create button added here */}
        {!showForm && !showAnalytics && (
          <button
            className="buscreation-create-button"
            onClick={() => setShowForm(true)}
          >
            Create Bus
          </button>
        )}
      </div>

      {/* Display Loader only when loading */}
      {loading && (
        <div className="buscreation-loader-container">
          <div className="buscreation-loader"></div>
        </div>
      )}

      {/* Show message if no buses available and not loading */}
      {!loading && busData.length === 0 && (
        <div className="no-buses-message">No buses available.</div>
      )}

      {!loading && !showForm && !showAnalytics && busData.length > 0 ? (
        <>
          <div className="buscreation-table-container">
            <table className="buscreation-styled-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Allowed Hostels</th>
                  <th>Cities</th>
                  <th>Is Active</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {busData.map((bus, index) => (
                  <tr key={bus._id || index}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>
                      {Array.isArray(bus.hostelId)
                        ? bus.hostelId.map(h => h.name).join(", ")
                        : "No Hostels Assigned"}
                    </td>
                    <td>
                      {Array.isArray(bus.cities)
                        ? bus.cities.join(", ")
                        : "No Cities Selected"}
                    </td>
                    <td>
                      <span
                        className={
                          new Date(bus.expiresAt) > new Date()
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {new Date(bus.expiresAt) > new Date() ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="buscreation-action-cell">
                      <button
                        className="buscreation-arrow-button"
                        onClick={() => {
                          setSelectedBus(bus);
                          setShowAnalytics(true);
                        }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="buscreation-pagination">
            {[...Array(totalPages)].map((_, pageIndex) => (
              <button
                key={pageIndex}
                className={`buscreation-page-btn ${currentPage === pageIndex + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(pageIndex + 1)}
              >
                {pageIndex + 1}
              </button>
            ))}
          </div>
        </>
      ) : showForm ? (
        <BusForm onCancel={() => setShowForm(false)} />
      ) : showAnalytics ? (
        <BusAnalytics
          analyticsData={selectedBus}
          onBack={() => setShowAnalytics(false)}
        />
      ) : null}
    </div>
  );
};

export default BusCreation;
