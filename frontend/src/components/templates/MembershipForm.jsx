import React, { useState } from "react";

const MembershipForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    status: "Active",
    membershipType: "Bronze",
    birthdate: "",
    img: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add form submission logic here
    setIsOpen(false); // Close the popup after submission
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Button to open the form */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
        onClick={() => setIsOpen(true)}
      >
        Open Membership Form
      </button>

      {/* Popup form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Membership Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
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
                  onChange={(e) => {
                    setFormData({ ...formData, img: e.target.files[0] });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              >
                <option value="">Select Membership Type</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div>
              <label className="block text-gray-700 font-medium mb-2">
                   Birthdate
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipForm;
