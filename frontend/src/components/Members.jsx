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
function Members() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phonenumber: "",
    gender: "",
    status: true,
    birthdate: "",
    cloudinaryId: "",
    img: null,
    datejoined: "",
    address: "",
    pincode: "",
    secretKey: "",
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedMemberInfo, setSelectedMemberInfo] = useState(null);
  const [deleteForm, setDeleteForm] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    getMembers();
  }, []);

  const getMembers = async () => {
    try {
      const response = await axios.get("/members/all");
      setMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMember({
      ...newMember,
      [name]: value,
    });
  };
  const handleAddOrEditMember = async (e) => {
    e.preventDefault();
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
    formData.append("address", newMember.address);
    formData.append("pincode", newMember.pincode);
    formData.append("datejoined", newMember.datejoined);
    formData.append("birthdate", newMember.birthdate);
    formData.append("cloudinaryId", newMember.cloudinaryId || "");
    formData.append("secretKey", newMember.secretKey);
    try {
      if (selectedMember) {
        let response = await axios.put(
          `/members/edit/${selectedMember._id}`,
          formData
        );
        if (response.data.message === "Invalid secret key") {
          setErrorMessage("Invalid secret key.");
        } else if (response.data.message === "Email or Phone number exists") {
          setErrorMessage("Email or Phone number exists.");
        } else {
          getMembers();
          setShowForm(false);
        }
      } else {
        let response = await axios.post("/members/add", formData);
        if (response.data.message === "Invalid secret key") {
          setErrorMessage("Invalid secret key.");
        } else if (response.data.message === "Email or Phone number exists") {
          setErrorMessage("Email or Phone number exists.");
        } else {
          getMembers();
          setShowForm(false);
        }
      }

    } catch (error) {
      console.error(
        selectedMember ? "Error editing member:" : "Error adding member:",
        error
      );
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleAdd = () => {
    setShowForm(true);
    setSelectedMember(null);
    setNewMember({
      name: "",
      email: "",
      phonenumber: "",
      gender: "",
      status: true,
      birthdate: "",
      cloudinaryId: "",
      img: null,
      datejoined: "",
      address: "",
      pincode: "",
      secretKey: "",
    });
    setErrorMessage("");
  };

  const handleEdit = (member) => {
    const formattedDate = member.birthdate
      ? new Date(member.birthdate).toISOString().split("T")[0]
      : "";
    const formattedDateJoined = member.datejoined
      ? new Date(member.datejoined).toISOString().split("T")[0]
      : "";
    setSelectedMember(member);
    setShowForm(true);
    setNewMember({
      name: member.name,
      email: member.email,
      phonenumber: member.phonenumber,
      gender: member.gender,
      status: member.status,
      birthdate: formattedDate,
      datejoined: formattedDateJoined,
      address: member.address,
      pincode: member.pincode,
      cloudinaryId: member.cloudinaryId,
      img: member.img,
      secretKey: member.secretKey,
    });
    setErrorMessage("");
  };

  

  const fetchMemberInfo = async (id) => {
    try {
      const response = await axios.get(`/members/person/${id}`);

      console.log("Fetched Member Info:", response.data.member);
      setSelectedMemberInfo(response.data.member);
      setShowInfoModal(true);
    } catch (error) {
      console.error("Error fetching member info:", error);
    }
  };
  const handleInfo = (member) => {
    fetchMemberInfo(member._id); 
  };
  function InfoItem({ label, value }) {
    return (
      <div className="flex justify-between items-center border-b pb-2">
        <span className="font-medium text-gray-700">{label}:</span>
        <span className="text-gray-500">{value || "N/A"}</span>
      </div>
    );
  }
  const handleDelete = (member) => {
    setMemberToDelete(member);
    setDeleteForm(true);
    setSecretKey("");
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`/members/delete/${memberToDelete._id}`, {
        data: { secretKey }
      });
      
      if (response.data.message === "Invalid secret key") {
        setDeleteError("Invalid secret key. Please try again.");
        return;
      }
      
      setDeleteForm(false);
      setMemberToDelete(null);
      setSecretKey("");
      setDeleteError("");
      getMembers();
      alert("Member deleted successfully");
    } catch (error) {
      console.error("Error deleting member:", error);
      setDeleteError("An error occurred while deleting the member. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Members" />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedMember ? "Edit Member" : "New Member Registration"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddOrEditMember} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newMember.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newMember.email}
                    onChange={handleChange}
                    disabled={!!selectedMember}
                    placeholder="Enter email address"
                    className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${
                      selectedMember
                        ? "bg-gray-200 cursor-not-allowed"
                        : "focus:ring-blue-500"
                    } focus:border-blue-500 transition-all`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phonenumber"
                    value={newMember.phonenumber}
                    disabled={!!selectedMember}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${
                      selectedMember
                        ? "bg-gray-200 cursor-not-allowed"
                        : "focus:ring-blue-500"
                    } focus:border-blue-500 transition-all`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={newMember.gender}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={newMember.birthdate}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date Joined
                  </label>
                  <input
                    type="date"
                    name="datejoined"
                    value={newMember.datejoined}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={newMember.pincode}
                    onChange={handleChange}
                    placeholder="Enter Pincode"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    name="secretKey"
                    value={newMember.secretKey}
                    onChange={handleChange}
                    placeholder="Enter Secret Key"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={newMember.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter Address"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={(e) =>
                    setNewMember({ ...newMember, img: e.target.files[0] })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={newMember.status}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              {errorMessage && (
                <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedMember ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showInfoModal && selectedMemberInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-10 rounded-lg shadow-2xl w-[900px] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-2xl transition"
            >
              ✖
            </button>
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
              Member Information
            </h2>
            <div className="flex gap-8">
              <div className="w-1/3 flex flex-col items-center">
                <img
                  src={selectedMemberInfo.img || "/placeholder.svg"}
                  alt={selectedMemberInfo.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-gray-300 mb-4"
                />
                <p className="text-2xl font-medium text-gray-800">
                  {selectedMemberInfo.name}
                </p>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                  <InfoItem label="Email" value={selectedMemberInfo.email} />
                  <InfoItem
                    label="Phone"
                    value={selectedMemberInfo.phonenumber}
                  />
                  <InfoItem label="Gender" value={selectedMemberInfo.gender} />
                  <InfoItem
                    label="Birthdate"
                    value={new Date(
                      selectedMemberInfo.birthdate
                    ).toLocaleDateString()}
                  />
                  <InfoItem
                    label="Address"
                    value={selectedMemberInfo.address}
                  />
                  <InfoItem
                    label="Pincode"
                    value={selectedMemberInfo.pincode}
                  />
                  <InfoItem
                    label="Status"
                    value={selectedMemberInfo.status ? "Active" : "Inactive"}
                  />
                  <InfoItem
                    label="Joining Date"
                    value={
                      selectedMemberInfo.datejoined
                        ? new Date(
                            selectedMemberInfo.datejoined
                          ).toLocaleDateString()
                        : "Not Provided"
                    }
                  />
                  <InfoItem
                    label="Membership Type"
                    value={selectedMemberInfo.membershiptype || "Not Provided"}
                  />
                  <InfoItem
                    label="Membership Date"
                    value={
                      selectedMemberInfo.membershipdate
                        ? new Date(
                            selectedMemberInfo.membershipdate
                          ).toLocaleDateString()
                        : "Not Provided"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteForm && memberToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Deletion</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete member: <span className="font-semibold">{memberToDelete.name}</span>?
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
                    setMemberToDelete(null);
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
                  Delete Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        handleInfo={handleInfo}
      />
    </div>
  );
}

export default Members;
