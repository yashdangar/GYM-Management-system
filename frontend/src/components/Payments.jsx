import React, { useEffect, useState } from "react";
import Topnav from "./templates/Topnav";
import Table from "./templates/Table";
import axios from "../utils/axios";
import easyinvoice from "easyinvoice";
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
    secretKey: "",
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteForm, setDeleteForm] = useState(false);
    const [secretKey, setSecretKey] = useState("");
    const [paymentToDelete, setPaymentToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState("");
  // const [selectedMemberInfo,setSelectedMemberInfo]=useState(null);

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

  const generateInvoicePDF = async (payment) => {
    if (!payment) {
      console.error("Payment data is undefined or null");
      return;
    }
    console.log(payment)
    let member;
    try {
      const id = payment.memberId;
      const response = await axios.get(`/members/person/${id}`);

      console.log("Fetched Member Info:", response.data.member);
      // setSelectedMemberInfo(response.data.member);
      member = response.data.member;
    } catch (error) {
      console.error("Error fetching member info:", error);
    }
  
    const invoiceData = {
      documentTitle: "Invoice", 
      currency: "INR",
      taxNotation: "vat", 
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      sender: {
        company: "My GYM",
        address: "123 Gym Street",
        zip: "395004",
        city: "Surat",
        country: "India",
        email: "yashdangar123@gmail.com",
      },
      client: {
        company: member.name || "Unknown",
        address: member.address,
        zip: member.pincode,
        country: "India",
        email: member.email || "N/A",
      },
      invoiceDate: payment.invoicedate
        ? new Date(payment.invoicedate).toLocaleDateString()
        : "N/A",
      products: [
        {
          quantity: 1,
          description: `${payment.membershiptype} Membership` || "Membership",
          price: payment.totalamount || 0,
          paidAmount:payment.paidamount || 0,
          dueAmount:payment.dueamount || 0
        },
      ],
      bottomNotice: "Thank you for your payment!",
    };
    try {
      const result = await easyinvoice.createInvoice(invoiceData);
      easyinvoice.download(`Invoice-${payment.name}.pdf`, result.pdf);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };
  const handleInfo = (payment) => {
    generateInvoicePDF(payment);
  };
  
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
        console.log(processedPayment);
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
      secretKey: "",
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
      secretKey: payment.secretkey,
    });
    setErrorMessage("");
  };

  const handleDelete = (payment) => {
    setPaymentToDelete(payment);
    setDeleteForm(true);
    setSecretKey("");
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`/invoice/delete/${paymentToDelete._id}`, {
        data: { secretKey }
      });
      
      if (response.data.message === "Invalid secret key") {
        setDeleteError("Invalid secret key. Please try again.");
        return;
      }
      
      setDeleteForm(false);
      setPaymentToDelete(null);
      setSecretKey("");
      setDeleteError("");
      getPayments();
      alert("Payment deleted successfully");
    } catch (error) {
      console.error("Error deleting payment:", error);
      setDeleteError("An error occurred while deleting the payment. Please try again.");
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
      <div className="text-black text-sm font-semibold">Membership Duration : Bronze = 1-Month | Silver = 3-Month | Gold = 6-Month | Platinum = 1-Year</div>
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
                setNewPayment({ ...newPayment, secretKey: e.target.value })
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
      {deleteForm && paymentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Deletion</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete payment?
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Secret Key to Confirm
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter secret key"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {deleteError && (
                <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                  {deleteError}
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setDeleteForm(false);
                    setPaymentToDelete(null);
                    setSecretKey("");
                    setDeleteError("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Table
        title="Payments"
        info
        handleInfo={handleInfo}
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
