import React from "react";
import { Pie } from "react-chartjs-2";

const Occupancy = () => {
  const pieData1 = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [250, 100],
        backgroundColor: ["#00FFFF", "#333"],
      },
    ],
  };

  const pieData2 = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [230, 120],
        backgroundColor: ["#FFD700", "#333"],
      },
    ],
  };

  const pieData3 = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [210, 140],
        backgroundColor: ["#FF4500", "#333"],
      },
    ],
  };

  return (
    <div className="cards">
      {/* Card 1 */}
      <div className="card">
        <h3>K2</h3>
        <Pie data={pieData1} />
        <p>Total Students: 350</p>
        <p>
          Present: <span className="highlight">250</span>
        </p>
        <p>Absent: 100</p>
      </div>

      {/* Card 2 */}
      <div className="card">
        <h3>K3</h3>
        <Pie data={pieData2} />
        <p>Total Students: 350</p>
        <p>
          Present: <span className="highlight">230</span>
        </p>
        <p>Absent: 120</p>
      </div>

      {/* Card 3 */}
      <div className="card">
        <h3>I1</h3>
        <Pie data={pieData3} />
        <p>Total Students: 350</p>
        <p>
          Present: <span className="highlight">210</span>
        </p>
        <p>Absent: 140</p>
      </div>
    </div>
  );
};

export default Occupancy;
