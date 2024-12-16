import React, { useEffect, useState } from "react";
import Topnav from "./templates/Topnav";
import Table from "./templates/Table";
import axios from "../utils/axios";

const TABLE_HEAD = ["Name", "Email", "Type", "Date", "Notes", "Status", ""];

function Followups() {
  const [followups, setFollowups] = useState([]);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [newFollowUp, setNewFollowUp] = useState({
    name: "",
    email: "",
    type: "Enquiry",
    date: "",
    notes: "",
    status: true,
    followUpId: "", // Optional for editing
  });
  const [selectedFollowup, setSelectedFollowup] = useState(null);

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

  // Handle adding or editing a follow-up
  const handleAddOrEditFollowUp = async () => {
    try {
      // console.log(newFollowUp)
      const response = await axios.post("/followups/create", newFollowUp);
    //  console.log(response);
      if (selectedFollowup) {
        // If editing, update the local followups array
        setFollowups(followups.map(followUp =>
          followUp._id === selectedFollowup._id ? response.data.followUp : followUp
        ));
      } else {
        // If adding, add to the followups array
        setFollowups([...followups, response.data.followUp]);
      }

      setShowForm(false); // Close the form after submission
      setNewFollowUp({
        name: "",
        email: "",
        type: "Enquiry",
        date: "",
        notes: "",
        status: true,
      }); // Reset form state
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    setShowForm(true); // Show the add form
    setSelectedFollowup(null); // Reset for a new entry
    setNewFollowUp({
      name: "",
      email: "",
      type: "Enquiry",
      date: "",
      notes: "",
      status: true,
    });
  };

  const handleEdit = (followup) => {
    setSelectedFollowup(followup); // Set selected followup for editing
    setShowForm(true); // Show the edit form
    setNewFollowUp({
      name: followup.name,
      email: followup.email,
      type: followup.type,
      date: followup.date,
      notes: followup.notes,
      status: followup.status,
      followUpId: followup._id, // Set the followUpId for editing
    });
  };

  const handleDelete = async (followup) => {
    try {
      // Confirm deletion before proceeding
      const confirmed = window.confirm("Are you sure you want to delete this follow-up?");
      if (!confirmed) return;
  
      // Make the API request to delete the follow-up by its _id
      const response = await axios.delete(`/followups/delete/${followup._id}`);
      console.log(response)
      if (response.status === 200) {
        // On successful deletion, filter out the deleted followup from the list
        setFollowups(followups.filter(f => f._id !== followup._id));
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
