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
  "",
];

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTrainer, setnewTrainer] = useState({
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
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedTrainerInfo, setSelectedTrainerInfo] = useState(null);
  useEffect(() => {
    getTrainers();
  }, []);

  const getTrainers = async () => {
    try {
      const response = await axios.get("/trainers/all");
      setTrainers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setnewTrainer({
      ...newTrainer,
      [name]: value,
    });
  };
  const handleAddOrEditTrainer = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profileImage", newTrainer.img || "");
    formData.append("name", newTrainer.name);
    formData.append("email", newTrainer.email);
    formData.append("phoneNumber", newTrainer.phonenumber);
    formData.append("gender", newTrainer.gender);
    formData.append(
      "status",
      newTrainer.status === true || newTrainer.status === "true"
    );
    formData.append("birthdate", newTrainer.birthdate);
    formData.append("cloudinaryId", newTrainer.cloudinaryId || "");
    formData.append("secretKey", newTrainer.secretKey);
    formData.append("datejoined", newTrainer.datejoined);
    formData.append("address", newTrainer.address);
    formData.append("pincode", newTrainer.pincode);

    try {
      let response;

      if (selectedTrainer) {
        response = await axios.put(
          `/trainers/edit/${selectedTrainer._id}`,
          formData
        );
        if (response.data.message === "Invalid secret key") {
          setErrorMessage("Invalid secret key.");
        } else if (response.data.message === "Email or Phone number exists") {
          setErrorMessage("Email or Phone number exists.");
        } else {
          getTrainers();
          setShowForm(false);
        }
      } else {
        response = await axios.post("/trainers/add", formData);
        if (response.data.message === "Invalid secret key") {
          setErrorMessage("Invalid secret key.");
        } else if (response.data.message === "Email or Phone number exists") {
          setErrorMessage("Email or Phone number exists.");
        } else {
          getTrainers();
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error(
        selectedTrainer ? "Error editing trainer:" : "Error adding trainer:",
        error
      );
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleAdd = () => {
    setShowForm(true);
    setSelectedTrainer(null);
    setnewTrainer({
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

  const handleEdit = (trainer) => {
    const formattedDate = trainer.birthdate
      ? new Date(trainer.birthdate).toISOString().split("T")[0]
      : "";
    setSelectedTrainer(trainer);
    setShowForm(true);
    setnewTrainer({
      name: trainer.name,
      email: trainer.email,
      phonenumber: trainer.phonenumber,
      gender: trainer.gender,
      status: trainer.status,
      birthdate: formattedDate,
      cloudinaryId: trainer.cloudinaryId,
      img: trainer.img,
      datejoined: trainer.datejoined,
      address: trainer.address,
      pincode: trainer.pincode,
      secretKey: trainer.secretKey,
    });
    setErrorMessage("");
  };

  const handleDelete = async (trainer) => {
    // const confirmed = window.confirm(
    //   "Are you sure you want to delete this trainer?"
    // );
    // if (!confirmed) return;

    try {
      await axios.delete(`/trainers/delete/${trainer._id}`);
      // alert("Trainer deleted successfully.");
      getTrainers();
    } catch (error) {
      alert("Error deleting trainer");
    }
  };
  const fetchTrainerInfo = async (id) => {
    try {
      const response = await axios.get(`/trainers/person/${id}`);

      setSelectedTrainerInfo(response.data.trainer);
      setShowInfoModal(true);
    } catch (error) {
      console.error("Error fetching trainer info:", error);
    }
  };
  const handleInfo = (trainer) => {
    fetchTrainerInfo(trainer._id);
  };
  function InfoItem({ label, value }) {
    return (
      <div className="flex justify-between items-center border-b pb-2">
        <span className="font-medium text-gray-700">{label}:</span>
        <span className="text-gray-500">{value || "N/A"}</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Trainers" />
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedTrainer ? "Edit Trainer" : "New Trainer Registration"}
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

            <form onSubmit={handleAddOrEditTrainer} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newTrainer.name}
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
                    value={newTrainer.email}
                    onChange={handleChange}
                    disabled={!!selectedTrainer}
                    placeholder="Enter email address"
                    className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${
                      selectedTrainer
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
                    value={newTrainer.phonenumber}
                    disabled={!!selectedTrainer}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 ${
                      selectedTrainer
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
                    value={newTrainer.gender}
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
                    value={newTrainer.birthdate}
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
                    value={newTrainer.datejoined}
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
                    value={newTrainer.pincode}
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
                    value={newTrainer.secretKey}
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
                  value={newTrainer.address}
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
                    setnewTrainer({ ...newTrainer, img: e.target.files[0] })
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
                  value={newTrainer.status}
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
                  {selectedTrainer ? "Update Trainer" : "Add Trainer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showInfoModal && selectedTrainerInfo && (
        <div onClick={() => setShowInfoModal(false)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white p-10 rounded-lg shadow-2xl w-[900px] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-2xl transition"
            >
              ✖
            </button>
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
              Trainer Information
            </h2>
            <div className="flex gap-8">
              <div className="w-1/3 flex flex-col items-center">
                <img
                  src={selectedTrainerInfo.img || "/placeholder.svg"}
                  alt={selectedTrainerInfo.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-gray-300 mb-4"
                />
                <p className="text-2xl font-medium text-gray-800">
                  {selectedTrainerInfo.name}
                </p>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                  <InfoItem label="Email" value={selectedTrainerInfo.email} />
                  <InfoItem
                    label="Phone"
                    value={selectedTrainerInfo.phonenumber}
                  />
                  <InfoItem label="Gender" value={selectedTrainerInfo.gender} />
                  <InfoItem
                    label="Birthdate"
                    value={new Date(
                      selectedTrainerInfo.birthdate
                    ).toLocaleDateString()}
                  />
                  <InfoItem
                    label="Address"
                    value={selectedTrainerInfo.address}
                  />
                  <InfoItem
                    label="Pincode"
                    value={selectedTrainerInfo.pincode}
                  />
                  <InfoItem
                    label="Status"
                    value={selectedTrainerInfo.status ? "Active" : "Inactive"}
                  />
                  <InfoItem
                    label="Joining Date"
                    value={
                      selectedTrainerInfo.datejoined
                        ? new Date(
                            selectedTrainerInfo.datejoined
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

      <Table
        title={"Trainers"}
        TABLE_HEAD={TABLE_HEAD}
        info
        TABLE_ROWS={
          Array.isArray(trainers) ? trainers : Object.values(trainers).flat()
        }
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleInfo={handleInfo}
      />
    </div>
  );
}

export default Trainers;
