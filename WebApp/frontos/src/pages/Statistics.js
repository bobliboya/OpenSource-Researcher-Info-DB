import React, { useState } from "react";
import "./Statistics.css";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

const Statistics = () => {
  const [category, setCategory] = useState("");
  const [byYear, setByYear] = useState([]);
  const [byUniversity, setByUniversity] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!category.trim()) {
      setError("Please enter a category.");
      return;
    }

    setError("");
    setMessage("");
    try {
      const response = await fetch("http://localhost:5000/api/statistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred.");
        return;
      }

      const data = await response.json();
      setByYear(data.publications_by_year);
      setByUniversity(data.publications_by_university);
      setMessage(data.update_message || "Database updated successfully.");
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Failed to fetch data. Please try again.");
    }
  };

  return (
    <div className="statistics">
      <h2>Statistics</h2>
      <div className="search-bar">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter a category"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="charts">
        {byYear.length > 0 && (
          <div className="chart">
            <h3>Publications by Year</h3>
            <Line
              data={{
                labels: byYear.map((item) => item.year),
                datasets: [
                  {
                    label: "Number of Publications",
                    data: byYear.map((item) => item.count),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        )}

        {byUniversity.length > 0 && (
          <div className="chart">
            <h3>Publications by University</h3>
            <Bar
              data={{
                labels: byUniversity.map((item) => item.university),
                datasets: [
                  {
                    label: "Number of Publications",
                    data: byUniversity.map((item) => item.count),
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { ticks: { maxRotation: 90, minRotation: 45 } },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
