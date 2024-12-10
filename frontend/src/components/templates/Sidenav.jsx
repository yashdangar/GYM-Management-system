import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaChartBar,
  FaUsers,
  FaClock,
  FaCreditCard
} from "react-icons/fa";
import { GiWhistle } from "react-icons/gi";
import { IoInformationCircle } from "react-icons/io5"; 
import { IoMdContact } from "react-icons/io";
import { BsPersonRaisedHand } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: MdDashboard },
  { name: "Attendance", icon: BsPersonRaisedHand },
  { name: "Follow Ups", icon: FaClock },
  { name: "Members", icon: FaUsers },
  { name: "Trainers", icon: GiWhistle  },
  { name: "Sales", icon: FaChartBar },
  { name: "Payments", icon: FaCreditCard },
];

const information = [
  { name: "About me", icon: IoInformationCircle  },
  { name: "Contact me", icon: IoMdContact  }
];

const Sidenav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button for Mobile View */}
      <button
        className={`lg:hidden fixed top-4 ${
          isOpen ? "right-4" : "left-4"
        } z-50 p-2 bg-white rounded shadow-md focus:outline-none`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <FaTimes className="h-6 w-6 text-black" />
        ) : (
          <FaBars className="h-6 w-6 text-black" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
              <img src="/placeholder.svg" alt="Logo" className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black">
                 My GYM
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={`/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                index === 0 ? "bg-gray-100" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
              
            </Link>
          ))}
        </nav>
        <hr className="border-none h-[1px] bg-zinc-400 my-3" />
        {/* information Section */}
        <div className="">
          <nav className="mt-1">
            {information.map((item) => (
              <Link
                key={item.name}
                to={`/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay for Mobile View */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidenav;