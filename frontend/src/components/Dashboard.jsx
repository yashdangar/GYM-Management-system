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
import Topnav from "./templates/Topnav";
import Card from "./templates/Card";
import { FaUsers, FaHourglassHalf } from "react-icons/fa";
import { GiWhistle } from "react-icons/gi";
import { MdTrendingUp } from "react-icons/md";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const cardDetails = [
  {
    title: "Total Members",
    count: 1234,
    icon: FaUsers,
    bgcolor: "#aed6f1",
    iconBgcolor: "#85c1e9",
    iconcolor: "#2874A6",
  },
  {
    title: "Total Trainers",
    count: 234,
    icon: GiWhistle,
    bgcolor: "#abebc6",
    iconBgcolor: "#58d68d",
    iconcolor: "#239b56",
  },
  {
    title: "Due Amount",
    count: 234,
    icon: FaHourglassHalf,
    bgcolor: "#f5b7b1",
    iconBgcolor: "#f1948a",
    iconcolor: "#e74c3c",
  },
  {
    title: "Total Income",
    count: 234,
    icon: MdTrendingUp,
    bgcolor: "#f9e79f",
    iconBgcolor: "#f7dc6f",
    iconcolor: "#f39c12",
  },
];

const ChartComponent = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Attendance",
        data: [50, 60, 45, 70, 90, 80, 100], // Example attendance data
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
    <div className="lg:w-2/3 lg:h-[30%] w-full mx-auto mt-5">
      <Bar data={data} options={options} />
    </div>
  );
};

function Dashboard() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold ml-12 mt-2">Hi, Welcome Back!</h1>
      <Topnav title="Dashboard" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4 mt-5 mb-10">
        {cardDetails.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            count={item.count}
            icon={item.icon}
            bgcolor={item.bgcolor}
            iconBgcolor={item.iconBgcolor}
            iconcolor={item.iconcolor}
          />
        ))}
      </div>
      <ChartComponent />
    </div>
  );
}

export default Dashboard;
