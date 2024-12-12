import React, { useState } from "react";
import Topnav from './templates/Topnav';
import Chart from './templates/Chart';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([
    { date: "2024-12-05", count: 15 },
    { date: "2024-12-06", count: 18 },
    { date: "2024-12-07", count: 14 },
    { date: "2024-12-08", count: 17 },
    { date: "2024-12-09", count: 19 },
    { date: "2024-12-10", count: 16 },
    { date: "2024-12-11", count: 20 },
  ]);

  const addTodayAttendance = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const existingEntry = attendanceData.find((entry) => entry.date === today);

    if (existingEntry) {
      alert("Attendance for today has already been added.");
      return;
    }

    const newAttendance = { date: today, count: Math.floor(Math.random() * 11) + 10 }; // Random count between 10-20

    // Keep only the last 6 days and add today (7-day tracking)
    const updatedData = [...attendanceData.slice(-6), newAttendance];
    setAttendanceData(updatedData);
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };


  return (
    <div className='p-1'>
      <Topnav title={"Attendance"}/>
      <Chart/>
      <div className="p-4">
        <h1 className="text-lg lg:text-2xl font-bold mb-4 text-center">7-Day Attendance</h1>

        <button
          onClick={addTodayAttendance}
          className="mb-4 px-2 py-1 lg:px-4 lg:py-2 right-4 bg-blue-400 text-white rounded hover:bg-blue-600"
        >
          Add Today's Attendance
        </button>

        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 bg-gray-100">
            <thead className="text-xs text-gray-700 uppercase  ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Day
                </th>
                <th scope="col" className="px-6 py-3">
                  Attendance Count
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-200"
                      : "bg-gray-100"
                  } border-b dark:border-gray-700`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="px-6 py-4">
                    {getDayName(item.date)}
                  </td>
                  <td className="px-6 py-4">{item.count}</td>
                  <td className="font-medium text-blue-600 px-6 py-4 hover:underline">Edit</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Attendance;
