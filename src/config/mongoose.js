require("dotenv").config();

// MONGODB CONNECTION THROUGH MONGOOSE MODULE
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECT + "/db");

const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "Error connecting to MongoDB ......")
);

db.once("open", function () {
  console.log("Connected to Database :: Mongodb");
});

module.exports = db;
