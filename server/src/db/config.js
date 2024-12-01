const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/vector-emb`
    );

    console.log(`✔️  mongodb connected`);
    console.log(`✔️  mongodb host ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Error: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
