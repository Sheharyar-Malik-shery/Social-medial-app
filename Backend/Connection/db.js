const mongoose = require("mongoose");

async function connectDB() {
  await mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
      console.log("MongoDB connected...");
    })
    .catch((err) => {
      console.log("Somethink went wrong in db connection", err);
    });
}
module.exports = connectDB;
