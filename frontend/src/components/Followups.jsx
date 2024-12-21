import React, { useEffect, useState } from "react";
import Topnav from "./templates/Topnav";
import Table from "./templates/Table";
import axios from "../utils/axios";

const TABLE_HEAD = ["Name", "Email", "Type", "Date", "Notes", "Status", ""];

function Followups() {
  const [followups, setFollowups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    name: "",
    email: "",
    type: "Enquiry",
    date: "",
    notes: "",
    status: true,
    followUpId: "",
    secretKey: "",
  });
  const [selectedFollowup, setSelectedFollowup] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getFollowups = async (page) => {
    try {
      const response = await axios.get(`/followups/all`);
      setFollowups(response.data.followUps);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFollowups();
  }, []);

  const handleAddOrEditFollowUp = async () => {
    try {
      const response = await axios.post("/followups/create", newFollowUp);
      if (response.data.message === "Invalid secret key") {
        setErrorMessage("Invalid secret key.");
      } else if (response.data.message === "Member not found") {
        setErrorMessage("Member does not exist.");
      } else {
        getFollowups();
        setShowForm(false);
        setNewFollowUp({
          name: "",
          email: "",
          type: "Enquiry",
          date: "",
          notes: "",
          status: true,
          secretKey: "",
        });
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleAdd = () => {
    setShowForm(true);
    setSelectedFollowup(null);
    setNewFollowUp({
      name: "",
      email: "",
      type: "Enquiry",
      date: "",
      notes: "",
      status: true,
      secretKey: "",
    });
    setErrorMessage("");  
  };

  const handleEdit = (followup) => {
    setSelectedFollowup(followup);
    setShowForm(true);
    setNewFollowUp({
      name: followup.name,
      email: followup.email,
      type: followup.type,
      date: followup.date,
      notes: followup.notes,
      status: followup.status,
      followUpId: followup._id,
      secretKey: followup.secretKey,
    });
    setErrorMessage("");

  };

  const handleDelete = async (followup) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this follow-up?"
      );
      if (!confirmed) return;

      const response = await axios.delete(`/followups/delete/${followup._id}`);
      if (response.status === 200) {
        getFollowups();
        alert("Follow-up deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting follow-up:", error);
      alert("Failed to delete follow-up. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Follow Ups" />
      {showForm && (
        <div className="mb-4 p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-bold mb-2">
            {selectedFollowup ? "Edit Follow Up" : "Add Follow Up"}
          </h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newFollowUp.name}
              onChange={(e) =>
                setNewFollowUp({ ...newFollowUp, name: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={newFollowUp.email}
              onChange={(e) =>
                setNewFollowUp({ ...newFollowUp, email: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <select
              value={newFollowUp.type}
              onChange={(e) =>
                setNewFollowUp({ ...newFollowUp, type: e.target.value })
              }
              className="border p-2 rounded-md"
            >
              <option value="Enquiry">Enquiry</option>
              <option value="Fee Due">Fee Due</option>
              <option value="Trial">Trial</option>
            </select>
            <input
              type="date"
              value={newFollowUp.date}
              onChange={(e) =>
                setNewFollowUp({ ...newFollowUp, date: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <textarea
              placeholder="Notes"
              value={newFollowUp.notes}
              onChange={(e) =>
                setNewFollowUp({ ...newFollowUp, notes: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <input
              type="password"
              value={newFollowUp.secretKey}
              onChange={(e) =>
                setNewFollowUp({ ...newFollowUp, secretKey: e.target.value })
              }
              placeholder="Enter secret key"
              className="border p-2 rounded-md"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newFollowUp.status}
                onChange={(e) =>
                  setNewFollowUp({ ...newFollowUp, status: e.target.checked })
                }
                className="border"
              />
              Active
            </label>
            {errorMessage && (
              <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg">
                {errorMessage}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleAddOrEditFollowUp}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                {selectedFollowup ? "Update" : "Submit"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Table
        title="Follow Up"
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={followups}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Followups;
