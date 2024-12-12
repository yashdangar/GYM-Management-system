import React, { useState } from "react";
import Topnav from "./templates/Topnav";
import Table from "./templates/Table";

const TABLE_HEAD = ["Name", "Type", "Scheduled", "Status", "Comments", ""];

const TABLE_ROWS = [
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    type: "Manager",
    scheduled: "23/04/18 10:30 AM",
    status: "Online",
    comments: "High-performing team member",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
    name: "Alexa Liras",
    type: "Developer",
    scheduled: "19/06/21 2:15 PM",
    status: "Offline",
    comments: "Needs to complete certifications",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
    name: "Laurent Perrier",
    type: "Executive",
    scheduled: "12/09/20 4:00 PM",
    status: "Online",
    comments: "Great leadership skills",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
    name: "Michael Levi",
    type: "Programmer",
    scheduled: "11/11/22 8:45 AM",
    status: "Online",
    comments: "Exceptional problem-solver",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
    name: "Richard Gran",
    type: "Manager",
    scheduled: "04/10/21 9:30 AM",
    status: "Offline",
    comments: "Overseeing key projects",
  },
];

function Followups() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Follow Ups" />
      <Table title={"Follow Up"} TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={TABLE_ROWS}/>
    </div>
  );
}

export default Followups;
