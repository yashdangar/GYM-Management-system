require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose")
const app = express();
const { memberRouter } = require("./routes/member")
const { trainerRouter } = require("./routes/trainer")
const { invoiceRouter } = require("./routes/invoice")

const cors = require('cors');


app.use(cors());
app.use(express.json());

app.use("/members", memberRouter)
app.use("/trainers", trainerRouter)
app.use("/invoice",invoiceRouter);

app.post("/signin", async function (req, res) {
    const { id, password} = req.body;
    if(id === process.env.ADMIN_ID && password === process.env.ADMIN_PASS){
      res.json({
          message: "You are signed in",
        });
    }else{
      res.json({
        message: "Invalid credentials",
      });
    }
  });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        // console.log("Connected to database");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}
main();