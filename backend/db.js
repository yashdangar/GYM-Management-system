const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

console.log("connected to database");

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId; 
const ObjectId = mongoose.Types.ObjectId;


const memberSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true },
  membershipType: { type: String, enum: ["bronze", "silver", "gold", "platinum"] },
  membershipDate :{ type: Date },
  dateJoined: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  birthdate: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  activeStatus: { type: Boolean, default: true },
  profileImage: {
    type: String, // Stores the URL of the image uploaded to Cloudinary
    default: null
  },
  cloudinaryId: {
    type: String, // Stores the public ID of the image on Cloudinary
    default: null
  },
  memberId: ObjectId
});

const trainerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true },
  dateJoined: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  birthdate: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  activeStatus: { type: Boolean, default: true },
  profileImage: { 
    type: String, // Stores the URL of the image uploaded to Cloudinary
    default: null 
  },
  cloudinaryId: { 
    type: String, // Stores the public ID of the image on Cloudinary
    default: null 
  },
  trainerId: ObjectId,
});

const followUpSchema = new Schema({
  followUpType: { type: String, enum: ["Enquiry", "Fee Due", "Trial"], required: true },
  followupDate: { type: Date, required: true },
  followUpTime: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/  // Regex for time in HH:mm format
  },
  nextAppointmentDate: { type: Date, required: true },
  notes: String,
  memberEmail:{type:String , required:true},
  status: { type: Boolean, default: false },
})

const invoiceSchema = new Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true, unique: true },
  membershipType: { type: String, enum: ["bronze", "silver", "gold", "platinum"] },
  invoiceDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  dueAmount: { type: Number, required: true },
})

const attendanceSchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true, // Ensure there's only one record per day
    index: true  // For optimized querying
  },
  presentCount: {
    type: Number,
    default: 0,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const salesSchema = new Schema({
  totalIncome: {
    type: Number,
    default: 0, // Initial income is 0
    required: true
  },
  membershipCounts: {
    bronze: { type: Number, default: 0 },
    silver: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    platinum: { type: Number, default: 0 }
  },
  totalPaidMoney: {
    type: Number,
    default: 0, // Initially no payments
    required: true
  },
  totalUnpaidMoney: {
    type: Number,
    default: 0, // Initially no unpaid money
    required: true
  }
});


const memberModel = mongoose.model("member", memberSchema);
const trainerModel = mongoose.model("trainer", trainerSchema);
const followUpModel = mongoose.model("followup", followUpSchema);
const invoiceModel = mongoose.model("invoice", invoiceSchema);
const attendanceModel = mongoose.model("attendance", attendanceSchema);
const salesModel = mongoose.model("sales", salesSchema);

module.exports = {
  memberModel,
  trainerModel,
  followUpModel,
  invoiceModel,
  attendanceModel,
  salesModel
};
