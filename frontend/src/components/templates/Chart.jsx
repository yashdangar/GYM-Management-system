import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const Chart = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Attendance",
        data: [50, 60, 45, 70, 90, 80, 100], // Example attendance data
        backgroundColor: "black", // Full black bars
        borderWidth: 0, // No borders for bars
        borderRadius: 4,
        // categoryPercentage: 0.4,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "black", // Adjust legend color if needed
        },
      },
      title: {
        display: true,
        text: "Gym Attendance (Last 7 Days)",
        color: "black",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove gridlines from the x-axis
        },
        ticks: {
          color: "black", // Make axis labels black
        },
      },
      y: {
        grid: {
          display: false, // Remove gridlines from the y-axis
        },
        ticks: {
          color: "black", // Make axis labels black
        },
      },
    }
  };

  return (
    <div className="chart-container" style={{ width: "60%", height: "30%" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Chart;
