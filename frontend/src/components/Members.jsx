import React from 'react'
import Table from './templates/Table'
import Topnav from './templates/Topnav';

const TABLE_HEAD = ["Name", "E-mail", "Phone No.", "Gender", "Status", ""];

const TABLE_ROWS = [
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    email: "Manager",
    phone: "23/04/18 10:30 AM",
    status: "Online",
    comments: "High-performing team member",
  }
];


function Members() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Members" />
      <Table title={"Member"} TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={TABLE_ROWS}/>
    </div>
  )
}

export default Members