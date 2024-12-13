import React, { useEffect, useState } from "react";
import Topnav from "./templates/Topnav";
import Card from "./templates/Card";
import { FaUsers, FaHourglassHalf } from "react-icons/fa";
import { GiWhistle } from "react-icons/gi";
import { MdTrendingUp } from "react-icons/md";
import Chart from "./templates/Chart";
import axios from "../utils/axios";

function Dashboard() {
  const [memberCount, setMemberCount] = useState(0);
  const [trainerCount, setTrainerCount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [income, setIncome] = useState(0);
  const [attendance, setAttendance] = useState([]);
  const [labels, setLabels] = useState([]);
  const getMemberCount = async () => {
    try {
      const { data } = await axios.get("/members/count");
      setMemberCount(data.count);
    } catch (err) {
      console.log(err);
    }
  };
  const getTrainerCount = async () => {
    try {
      const { data } = await axios.get("/trainers/count");
      setTrainerCount(data.count);
    } catch (err) {
      console.log(err);
    }
  };
  const getSales = async () => {
    try {
      const { data } = await axios.get("/sales");
      setDueAmount(data.sales.totalUnpaidMoney);
      setIncome(data.sales.totalIncome);
    } catch (err) {
      console.log(err);
    }
  };
  const getAttendance = async () => {
    try {
      const { data } = await axios.get("/attendance/last7days");
      console.log(data.records);
      const rawAttendance = data.records;
      const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      const last7Days = Array.from({ length: 7 }).map((_, index) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - index)); // Start from 6 days ago to today
        return {
          date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
          label: labels[date.getDay()],
        };
      });

      // Map attendance data to the last 7 days with default presentCount: 0
      const processedAttendance = last7Days.map(({ date, label }) => {
        const record = rawAttendance.find((item) => item.date.startsWith(date));
        return { label, presentCount: record ? record.presentCount : 0 };
      });

      // Separate labels and data for easier use
      const chartLabels = processedAttendance.map((item) => item.label);
      const chartData = processedAttendance.map((item) => item.presentCount);
      setAttendance(chartData);
      setLabels(chartLabels)
      console.log({
        labels: chartLabels,
        data: chartData,
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getMemberCount();
    getTrainerCount();
    getSales();
    getAttendance();
  }, []);
  const cardDetails = [
    {
      title: "Total Members",
      count: memberCount,
      icon: FaUsers,
      bgcolor: "#aed6f1",
      iconBgcolor: "#85c1e9",
      iconcolor: "#2874A6",
    },
    {
      title: "Total Trainers",
      count: trainerCount,
      icon: GiWhistle,
      bgcolor: "#abebc6",
      iconBgcolor: "#58d68d",
      iconcolor: "#239b56",
    },
    {
      title: "Due Amount",
      count: dueAmount,
      icon: FaHourglassHalf,
      bgcolor: "#f5b7b1",
      iconBgcolor: "#f1948a",
      iconcolor: "#e74c3c",
    },
    {
      title: "Total Income",
      count: income,
      icon: MdTrendingUp,
      bgcolor: "#f9e79f",
      iconBgcolor: "#f7dc6f",
      iconcolor: "#f39c12",
    },
  ];
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
      <Chart data ={attendance} label = {labels}/>
    </div>
  );
}

export default Dashboard;
