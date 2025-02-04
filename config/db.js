const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB is connected! 🎉");
  } catch (err) {
    console.error("Connection failed", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
