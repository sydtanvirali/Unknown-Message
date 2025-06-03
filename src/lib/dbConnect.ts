import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connecttion: ConnectionObject = {};

const dbConnect = async () => {
  if (connecttion.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connecttion.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
export default dbConnect;
