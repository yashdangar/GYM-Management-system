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

// Component to display trainers
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
  });
  const [selectedTrainer, setSelectedTrainer] = useState(null);

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setnewTrainer({
      ...newTrainer,
      [name]: value,
    });
  };
  // Handle form submission for Add/Edit
  const handleAddOrEditTrainer = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // console.log(newTrainer);
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
    formData.append("secretKey", "yashdangar123");
    // console.log("FormData Entries:");
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}:`, typeof value ,value);
    // }
    try {
      let response;

      if (selectedTrainer) {
        // console.log(selectedTrainer._id);
        response = await axios.put(
          `/trainers/edit/${selectedTrainer._id}`,
          formData
        );
        console.log("Trainer updated:", response.data);
        getTrainers();
        setShowForm(false);
      } else {
        console.log("Sending request with FormData...");
        let response = await axios.post("/trainers/add", formData);
        console.log("Trainer added");
        getTrainers();
        setShowForm(false);
      }

      // resetForm();
    } catch (error) {
      console.error(
        selectedTrainer ? "Error editing trainer:" : "Error adding trainer:",
        error
      );
    }
  };

  const handleAdd = () => {
    setShowForm(true); // Show the add form
    setSelectedTrainer(null); // Reset for a new entry
    setnewTrainer({
      name: "",
      email: "",
      phonenumber: "",
      gender: "",
      status: true,
      birthdate: "",
      cloudinaryId: "",
      img: null,
    });
  };

  // Handle edit functionality
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
    });
  };

  // Handle delete 
  const handleDelete = async (trainer) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trainer?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/trainers/delete/${trainer._id}`);
      alert("Trainer deleted successfully.");
      getTrainers();
    } catch (error) {
      console.error("Error deleting trainer:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Trainers" />
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Trainer Registration Form
            </h2>
            <form onSubmit={handleAddOrEditTrainer} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newTrainer.name}
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
                    setnewTrainer({ ...newTrainer, img: e.target.files[0] })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newTrainer.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <input
                type="tel"
                name="phonenumber"
                placeholder="Phone Number"
                value={newTrainer.phonenumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <select
                name="gender"
                value={newTrainer.gender}
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
                  value={newTrainer.birthdate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                {selectedTrainer ? "Update Trainer" : "Add Trainer"}
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
      />
    </div>
  );
}

export default Trainers;
