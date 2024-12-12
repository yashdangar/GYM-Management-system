import React from "react";
import Topnav from "./templates/Topnav";
import Card from "./templates/Card";
import { FaUsers, FaHourglassHalf } from "react-icons/fa";
import { GiWhistle } from "react-icons/gi";
import { MdTrendingUp } from "react-icons/md";
import Chart from "./templates/Chart";

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

function Dashboard() {
  return (
    <div className="min-h-screen overflow-auto">
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
      <Chart />
    </div>
  );
}

export default Dashboard;
