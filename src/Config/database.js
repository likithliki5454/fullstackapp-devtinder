
// Config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://namastenodeliki:iUxpQJHgGqzWtJxW@namastenodelearn.zuhl9su.mongodb.net/devtinder'
  );
};

module.exports = connectDB;
