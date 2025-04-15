import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Button } from "@mui/material";
import "chart.js/auto";
import "./BusAnalytics.css";
import api from "./Api";

const BusAnalytics = ({ analyticsData, onBack }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const busId = analyticsData?._id;

  useEffect(() => {
    const fetchStats = async () => {
      if (!busId) return;

      setLoading(true);
      try {
        const response = await api.get(`/bus/form/stats/${busId}`);
        console.log("Bus Stats:", response.data);
        setStats(response.data.data.stats);
      } catch (error) {
        console.error("Error fetching bus stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [busId]);

  if (!busId) return <p>No Bus Selected</p>;
  if (loading) return <p>Loading Analytics...</p>;
  if (!stats) return <p>No analytics available.</p>;


  const cityCount = stats.cityCount || {};


  const pieData = {
    labels: ["Yes", "No"],
    datasets: [
      {
        data: [stats.busYesCount, stats.busNoCount],
        backgroundColor: ["#4CAF50", "#FF5252"],
      },
    ],
  };


  const barData = {
    labels: Object.keys(cityCount),
    datasets: [
      {
        label: "Students Count",
        data: Object.values(cityCount),
        backgroundColor: "#42A5F5",
      },
    ],
  };

  return (
    <div className="bus-analytics-container">
      <h2>Bus Analytics</h2>
      <div className="charts-container">
        <div className="chart-box">
          <h3>Yes vs No</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart-box">
          <h3>Student Count per City</h3>
          <Bar data={barData} />
        </div>
      </div>
      <Button className="back-button" onClick={onBack}>
        Back
      </Button>
    </div>
  );
};

export default BusAnalytics;
