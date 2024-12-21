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
  const [showForm, setShowForm] = useState(false); 
  const [newPayment, setNewPayment] = useState({
    customerName: "",
    customerEmail: "",
    invoicedate: "",
    membershipType: "bronze",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    paymentId: "", 
    secretKey:""
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getPayments = async () => {
    try {
      const response = await axios.get(`/invoice/all`);
      setPayments(response.data.invoice);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  const handleAddOrEditPayment = async () => {
    if (newPayment.paidAmount < 0 || newPayment.dueAmount < 0) {
      setErrorMessage("Paid and Due Amount cannot be negative.");
      return;
    }

    const calculatedTotalAmount =
      Number(newPayment.paidAmount) + Number(newPayment.dueAmount);
    if (calculatedTotalAmount !== Number(newPayment.totalAmount)) {
      setErrorMessage(
        "Total Amount should be the sum of Paid Amount and Due Amount."
      );
      return;
    }

    try {
      const processedPayment = {
        ...newPayment,
        totalAmount: calculatedTotalAmount,
        paidAmount: Number(newPayment.paidAmount),
        dueAmount: Number(newPayment.dueAmount),
      };

      if (selectedPayment) {
        const response = await axios.put(
          `/invoice/edit/${selectedPayment._id}`,
          processedPayment
        );
        if (response.data.message === "Invalid secret key") {
          setErrorMessage("Invalid secret key.");
        } else if (response.data.message === "Member not found") {
          setErrorMessage("Enter Right Email");
        } else {
          getPayments();
          setShowForm(false);
        }
      } else {
        console.log(processedPayment)
        const response = await axios.post("/invoice/create", processedPayment);
        if (response.data.message === "Invalid secret key") {
          setErrorMessage("Invalid secret key.");
        } else if (response.data.message === "Member not found") {
          setErrorMessage("Enter Right Email");
        } else {
          getPayments();
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleAdd = () => {
    setShowForm(true); 
    setSelectedPayment(null); 
    setNewPayment({
      customerName: "",
      customerEmail: "",
      invoicedate: "",
      membershipType: "bronze",
      totalAmount: "",
      paidAmount: "",
      dueAmount: "",
      paymentId: "",
      secretKey:""
    });
    setErrorMessage("");
  };

  const handleEdit = (payment) => {
    const formattedDate = payment.invoicedate
      ? new Date(payment.invoicedate).toISOString().split("T")[0]
      : "";
    setSelectedPayment(payment);
    setShowForm(true);
    setNewPayment({
      customerName: payment.name,
      customerEmail: payment.email,
      invoicedate: formattedDate,
      membershipType: payment.membershiptype,
      totalAmount: payment.totalamount,
      paidAmount: payment.paidamount,
      dueAmount: payment.dueamount,
      paymentId: payment._id,
      secretKey:payment.secretkey
    });
    setErrorMessage("");
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

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);
    setNewPayment((prev) => {
      const updatedPayment = { ...prev, [name]: newValue };
      if (name === "paidAmount" || name === "dueAmount") {
        updatedPayment.totalAmount =
          updatedPayment.paidAmount + updatedPayment.dueAmount;
      }
      return updatedPayment;
    });
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
              placeholder="Paid Amount"
              value={newPayment.paidAmount}
              onChange={handleAmountChange}
              name="paidAmount"
              className="border p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Due Amount"
              value={newPayment.dueAmount}
              onChange={handleAmountChange}
              name="dueAmount"
              className="border p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Total Amount"
              value={newPayment.totalAmount}
              onChange={handleAmountChange}
              name="totalAmount"
              className="border p-2 rounded-md"
              disabled
            />
            <input
              type="password"
              name="secretKey"
              value={newPayment.secretKey}
              onChange={(e) =>
                setNewPayment({...newPayment, secretKey: e.target.value })
              }
              placeholder="Enter Secret Key"
              className="border p-2 rounded-md"
              required
            />
            {errorMessage && (
              <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg">
                {errorMessage}
              </div>
            )}
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
