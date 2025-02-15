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

const Chart = ({data:Data,label}) => {
  const data = {
    labels: label,
    datasets: [
      {
        label: "Attendance",
        data: Data, // Example attendance data
        backgroundColor: "black", // Full black bars
        borderWidth: 0, // No borders for bars
        borderRadius: 4,
        barPercentage: 0.6, // Controls bar width
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
    },
  };

  return (
    <div className="lg:w-2/3 lg:h-[30%] w-full mx-auto mt-5 border-[0.123vw] border-black rounded-lg lg:p-10">
      <Bar data={data} options={options} />
    </div>
  );
};

export default Chart;
