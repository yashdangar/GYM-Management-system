import React from 'react'
import Table from './templates/Table'
import Topnav from './templates/Topnav';

const TABLE_HEAD = ["Name", "Email", "Date", "MembershipType","TotalAmount", ""];

const TABLE_ROWS = [
  {
    // img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    email: "john@gmail.com",
    date: "23/04/18",
    membershiptype: "Gold",
    totalamount:1234,
  }
];


function Payments() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Payments" />
      <Table title={"Payment"} TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={TABLE_ROWS} info/>
    </div>
  )
}

export default Payments