
// Config/database.js
const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://namastenodeliki:namastenodeliki@namastenodelearn.zuhl9su.mongodb.net/devtinder" 
    );
    console.log("Database connected");
  } catch (err) {
    console.error("Error:", err);
  }
};



module.exports = connectDB;

