import React, { useEffect, useState } from "react";
import Topnav from "./templates/Topnav";
import Table from "./templates/Table";
import axios from "../utils/axios";

const TABLE_HEAD = [
  "Name",
  "Email",
  "InvoiceDate",
  "MembershipType",
  "TotalAmount",
  "",
];

function Payments() {
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [newPayment, setNewPayment] = useState({
    customerName: "",
    customerEmail: "",
    invoicedate: "",
    membershipType: "bronze",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    paymentId: "", // Optional for editing
  });
  const [selectedPayment, setSelectedPayment] = useState(null);

  const getPayments = async () => {
    try {
      const response = await axios.get(`/invoice/all`);
      // console.log(response.data.invoice)
      setPayments(response.data.invoice);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  // Handle adding or editing a payment
  const handleAddOrEditPayment = async () => {
    try {
      const processedPayment = {
        ...newPayment,
        totalAmount: Number(newPayment.totalAmount),
        paidAmount: Number(newPayment.paidAmount),
        dueAmount: Number(newPayment.dueAmount),
      };
  
      if (selectedPayment) {
        // If editing, send PUT request
        const response = await axios.put(
          `/invoice/edit/${selectedPayment._id}`,
          processedPayment
        );
        getPayments();
      } else {
        // If adding, send POST request
        console.log(processedPayment)
        const response = await axios.post("/invoice/create", processedPayment);
        console.log(response.data.payment)
        getPayments();
      }

      // Reset form and close it
      setShowForm(false);
      setNewPayment({
        customerName: "",
        customerEmail: "",
        invoicedate: "",
        membershipType: "bronze",
        totalAmount: "",
        paidAmount: "",
        dueAmount: "",
        paymentId: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    setShowForm(true); // Show the add form
    setSelectedPayment(null); // Reset selected payment
    setNewPayment({
      customerName: "",
      customerEmail: "",
      invoicedate: "",
      membershipType: "bronze",
      totalAmount: "",
      paidAmount: "",
      dueAmount: "",
      paymentId: "",
    });
  };

  const handleEdit = (payment) => {
    // console.log(payment)
    const formattedDate = payment.invoicedate
    ? new Date(payment.invoicedate).toISOString().split("T")[0]
    : "";
    setSelectedPayment(payment); // Set selected payment for editing
    setShowForm(true); // Show the edit form
    setNewPayment({
      customerName: payment.name,
      customerEmail: payment.email,
      invoicedate:formattedDate,
      membershipType: payment.membershiptype,
      totalAmount: payment.totalamount,
      paidAmount: payment.paidamount,
      dueAmount:payment.dueamount,
      paymentId: payment._id, // Set the paymentId for editing
    });
  };

  const handleDelete = async (payment) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this payment?"
      );
      if (!confirmed) return;

      await axios.delete(`/invoice/delete/${payment._id}`);
      setPayments((prevPayments) =>
        prevPayments.filter((p) => p._id !== payment._id)
      );
      alert("Payment deleted successfully.");
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Payments" />
      {showForm && (
        <div className="mb-4 p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-bold mb-2">
            {selectedPayment ? "Edit Payment" : "Add Payment"}
          </h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newPayment.customerName}
              onChange={(e) =>
                setNewPayment({ ...newPayment, customerName: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={newPayment.customerEmail}
              onChange={(e) =>
                setNewPayment({ ...newPayment, customerEmail: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <input
              type="date"
              value={newPayment.invoicedate}
              onChange={(e) =>
                setNewPayment({ ...newPayment, invoicedate: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <select
              value={newPayment.membershipType}
              onChange={(e) =>
                setNewPayment({ ...newPayment, membershipType: e.target.value })
              }
              className="border p-2 rounded-md"
            >
              <option value="bronze">bronze</option>
              <option value="silver">silver</option>
              <option value="gold">gold</option>
              <option value="platinum">platinum</option>
            </select>
            <input
              type="number"
              placeholder="Total Amount"
              value={newPayment.totalAmount}
              onChange={(e) =>
                setNewPayment({ ...newPayment, totalAmount: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Paid Amount"
              value={newPayment.paidAmount}
              onChange={(e) =>
                setNewPayment({ ...newPayment, paidAmount: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Due Amount"
              value={newPayment.dueAmount}
              onChange={(e) =>
                setNewPayment({ ...newPayment, dueAmount: e.target.value })
              }
              className="border p-2 rounded-md"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddOrEditPayment}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                {selectedPayment ? "Update" : "Submit"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Table
        title="Payments"
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={payments}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Payments;
