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
  const [deleteForm, setDeleteForm] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [followupToDelete, setFollowupToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

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

  const handleDelete = (followup) => {
    setFollowupToDelete(followup);
    setDeleteForm(true);
    setSecretKey("");
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`/followups/delete/${followupToDelete._id}`, {
        data: { secretKey }
      });
      
      if (response.data.message === "Invalid secret key") {
        setDeleteError("Invalid secret key. Please try again.");
        return;
      }
      
      setDeleteForm(false);
      setFollowupToDelete(null);
      setSecretKey("");
      setDeleteError("");
      getFollowups();
      alert("followup deleted successfully");
    } catch (error) {
      console.error("Error deleting followup:", error);
      setDeleteError("An error occurred while deleting the followup. Please try again.");
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
      {deleteForm && followupToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Deletion</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete follow up?
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Secret Key to Confirm
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter secret key"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {deleteError && (
                <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                  {deleteError}
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setDeleteForm(false);
                    setFollowupToDelete(null);
                    setSecretKey("");
                    setDeleteError("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete FollowUp
                </button>
              </div>
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
