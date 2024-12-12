import React from 'react'
import Table from './templates/Table'
import Topnav from './templates/Topnav';

const TABLE_HEAD = ["Name", "Email", "Phone", "Gender", "Status", ""];

const TABLE_ROWS = [
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    email: "john@gmail.com",
    phone: "9988776655",
    gender: "Male",
    status: "Active",
  }
];


function Trainers() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Trainers" />
      <Table title={"Trianer"} TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={TABLE_ROWS} info/>
    </div>
  )
}

export default Trainers