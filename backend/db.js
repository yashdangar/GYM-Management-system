const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

console.log("connected to database");

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId; 
const ObjectId = mongoose.Types.ObjectId;


const memberSchema = new Schema({
  img: {
    type: String, // Stores the URL of the image uploaded to Cloudinary
    default: null
  },
  name: { type: String, required: true },
  email: { type: String, unique: true },
  membershiptype: { type: String, enum: ["bronze", "silver", "gold", "platinum"] },
  membershipdate :{ type: Date },
  datejoined: { type: Date },
  gender: { type: String, enum: ["male", "female"], required: true },
  birthdate: { type: Date, required: true },
  phonenumber: { type: String, required: true},
  address: { type: String},
  pincode: { type: String },
  status: { type: Boolean, default: true },
  
  cloudinaryId: {
    type: String, // Stores the public ID of the image on Cloudinary
    default: null
  },
});

const trainerSchema = new Schema({
  img: {
    type: String, // Stores the URL of the image uploaded to Cloudinary
    default: null
  },
  name: { type: String, required: true },
  email: { type: String, unique: true },
  datejoined: { type: Date},
  gender: { type: String, enum: ["male", "female"], required: true },
  birthdate: { type: Date, required: true },
  phonenumber: { type: String, required: true, unique: true },
  address: { type: String },
  pincode: { type: String },
  status: { type: Boolean, default: true },
  cloudinaryId: { 
    type: String, // Stores the public ID of the image on Cloudinary
    default: null 
  },
});

const followUpSchema = new Schema({
  img: {type:String},
  name:{type:String},
  email:{type:String , required:true},
  type: { type: String, enum: ["Enquiry", "Fee Due", "Trial"], required: true },
  date: { type: Date, required: true },
  notes: String,
  status: { type: Boolean, default: false },
})

const invoiceSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  membershiptype: { type: String, enum: ["bronze", "silver", "gold", "platinum"] },
  invoicedate: { type: Date, required: true },
  totalamount: { type: Number, required: true },
  paidamount: { type: Number, required: true },
  dueamount: { type: Number, required: true },
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
