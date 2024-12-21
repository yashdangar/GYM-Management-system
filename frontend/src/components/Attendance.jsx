import React, { useEffect, useState } from "react";
import Topnav from "./templates/Topnav";
import Chart from "./templates/Chart";
import axios from "../utils/axios";
import { Tooltip, IconButton } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [labels, setLabels] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state to track editing mode
  const [newAttendance, setNewAttendance] = useState({ date: "", count: 0 });

  const getAttendance = async () => {
    try {
      const { data } = await axios.get("/attendance/last7days");
      const formattedData = data.records.map((item) => ({
        date: item.date.split("T")[0],
        count: item.presentCount,
      }));
      setAttendanceData(formattedData);

      const rawAttendance = data.records;
      const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      const last7Days = Array.from({ length: 7 }).map((_, index) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - index));
        return {
          date: date.toISOString().split("T")[0],
          label: labels[date.getDay()],
        };
      });

      const processedAttendance = last7Days.map(({ date, label }) => {
        const record = rawAttendance.find((item) => item.date.startsWith(date));
        return { label, presentCount: record ? record.presentCount : 0 };
      });

      const chartLabels = processedAttendance.map((item) => item.label);
      const chartData = processedAttendance.map((item) => item.presentCount);
      setAttendance(chartData);
      setLabels(chartLabels);
    } catch (err) {
      console.log(err);
    }
  };

  const addTodayAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/attendance/add", {
        date: newAttendance.date,
        presentCount: newAttendance.count,
      });
      alert(isEditing ? "Attendance updated successfully!" : "Attendance added successfully!");
      setIsFormVisible(false);
      setIsEditing(false);
      getAttendance();
    } catch (err) {
      console.error(err);
      alert("Failed to submit attendance.");
    }
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    setIsEditing(false);
    if (!isFormVisible) {
      const today = new Date().toISOString().split("T")[0];
      setNewAttendance({ date: today, count: 0 });
    }
  };

  const editHandler = (date, count) => {
    setIsFormVisible(true);
    setIsEditing(true);
    setNewAttendance({ date, count });
  };

  useEffect(() => {
    getAttendance();
  }, []);

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <div className="p-1">
      <Topnav title={"Attendance"} />
      <Chart data={attendance} label={labels} />

      <div className="p-4">
        <h1 className="text-lg lg:text-2xl font-bold mb-4 text-center">
          7-Day Attendance
        </h1>

        <button
          onClick={toggleForm}
          className="mb-4 px-2 py-1 lg:px-4 lg:py-2 bg-blue-400 text-white rounded hover:bg-blue-600"
        >
          {isFormVisible ? "Close Form" : "Add Attendance"}
        </button>

        {isFormVisible && (
          <form
            onSubmit={addTodayAttendance}
            className="bg-gray-100 p-4 rounded shadow-md mb-4"
          >
            <h2 className="text-lg font-bold mb-2">
              {isEditing ? "Edit Attendance" : "Add Attendance"}
            </h2>

            <label className="block mb-2">
              <span className="text-gray-700">Date</span>
              <input
                type="date"
                className="block w-full mt-1 p-2 border rounded"
                value={newAttendance.date}
                onChange={(e) =>
                  setNewAttendance({ ...newAttendance, date: e.target.value })
                }
                required
                disabled={isEditing}
              />
            </label>

            <label className="block mb-2">
              <span className="text-gray-700">Attendance Count</span>
              <input
                type="number"
                className="block w-full mt-1 p-2 border rounded"
                value={newAttendance.count}
                onChange={(e) =>
                  setNewAttendance({
                    ...newAttendance,
                    count: parseInt(e.target.value, 10),
                  })
                }
                required
                min="0"
              />
            </label>

            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              {isEditing ? "Update" : "Submit"}
            </button>
          </form>
        )}

        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 bg-gray-100">
            <thead className="text-xs text-gray-700 uppercase">
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
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
                  } border-b dark:border-gray-700`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="px-6 py-4">{getDayName(item.date)}</td>
                  <td className="px-6 py-4">{item.count}</td>
                  <td className="px-6 py-4">
                    <Tooltip content="Edit">
                      <IconButton
                        variant="text"
                        onClick={() => editHandler(item.date, item.count)}
                      >
                        <PencilIcon className="h-4 w-4 text-gray-500" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
