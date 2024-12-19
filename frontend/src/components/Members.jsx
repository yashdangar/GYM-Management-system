import React, { useState, useEffect } from "react";
import Table from "./templates/Table";
import Topnav from "./templates/Topnav";
import axios from "../utils/axios";

const TABLE_HEAD = [
  "Name",
  "Email",
  "phonenumber",
  "Gender",
  "Status",
  "birthdate",
  "membershiptype",
  "",
];

// Component to display members
function Members() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phonenumber: "",
    gender: "",
    status: true,
    membershiptype: "Bronze", // Default membership type
    birthdate: "",
    cloudinaryId: "",
    img: null,
  });
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    getMembers();
  }, []);

  // Fetch members from the API
  const getMembers = async () => {
    try {
      const response = await axios.get("/members/all");
      setMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMember({
      ...newMember,
      [name]: value,
    });
  };
  // Handle form submission for Add/Edit
  const handleAddOrEditMember = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // console.log(newMember);
    const formData = new FormData();
    formData.append("profileImage", newMember.img || "");
    formData.append("name", newMember.name);
    formData.append("email", newMember.email);
    formData.append("phoneNumber", newMember.phonenumber);
    formData.append("gender", newMember.gender);
    formData.append(
      "status",
      newMember.status === true || newMember.status === "true"
    );
    formData.append("membershiptype", newMember.membershiptype);
    formData.append("birthdate", newMember.birthdate);
    formData.append("cloudinaryId", newMember.cloudinaryId || "");
    formData.append("secretKey", "yashdangar123");
    console.log("FormData Entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, typeof value ,value);
    }
    try {
      let response;

      if (selectedMember) {
        // console.log(selectedMember._id)
        // Editing an existing member
        response = await axios.put(
          `/members/edit/${selectedMember._id}`,formData
        );
        console.log("Member updated");
        getMembers();
        setShowForm(false);

      } else {
      // Adding a new member
      console.log("Sending request with FormData...");
      let response = await axios.post("/members/add", formData);
      console.log("Member added:", response.data);
      getMembers();
      setShowForm(false);
      }

      // resetForm();
    } catch (error) {
      console.error(
        selectedMember ? "Error editing member:" : "Error adding member:",
        error
        
      );
    }
  };

  const handleAdd = () => {
    setShowForm(true); // Show the add form
    setSelectedMember(null); // Reset for a new entry
    setNewMember({
      name: "",
      email: "",
      phonenumber: "",
      gender: "",
      status: true,
      membershiptype: "bronze", // Default membership type
      birthdate: "",
      cloudinaryId: "",
      img: null,
    });
  };

  // Handle edit functionality
  const handleEdit = (member) => {
    const formattedDate = member.birthdate
    ? new Date(member.birthdate).toISOString().split("T")[0]
    : "";
    setSelectedMember(member);
    setShowForm(true);
    setNewMember({
      name: member.name,
      email: member.email,
      phonenumber: member.phonenumber,
      gender: member.gender,
      status: member.status,
      membershiptype: member.membershiptype,
      birthdate: formattedDate,
      cloudinaryId: member.cloudinaryId,
      img: member.img,
    });
  };

  // Handle delete member
  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/members/delete/${member._id}`);
      alert("Member deleted successfully.");
      getMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Members" />

      {/* Member Add/Edit Form - Card Style */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Member Registration Form</h2>
            <form onSubmit={handleAddOrEditMember} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newMember.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={(e) =>
                    setNewMember({ ...newMember, img: e.target.files[0] })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newMember.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <input
                type="tel"
                name="phonenumber"
                placeholder="Phone Number"
                value={newMember.phonenumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <select
                name="membershiptype"
                value={newMember.membershiptype}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              >
                <option value="bronze">bronze</option>
                <option value="silver">silver</option>
                <option value="gold">gold</option>
                <option value="platinum">platinum</option>
              </select>
              <select
                name="gender"
                value={newMember.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              >
                <option value="">Select Gender</option>
                <option value="male">male</option>
                <option value="female">female</option>
              </select>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Birthdate
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={newMember.birthdate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                {selectedMember ? "Update Member" : "Add Member"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display Table of Members */}
      <Table
        title={"Members"}
        TABLE_HEAD={TABLE_HEAD}
        info
        TABLE_ROWS={
          Array.isArray(members) ? members : Object.values(members).flat()
        }
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Members;