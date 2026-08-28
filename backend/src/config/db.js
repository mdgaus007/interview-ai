import mongoose from "mongoose";

const ConnectDB = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);
  //await mongoose.connect("mongodb://127.0.0.1:27017/interviewAI");
  console.log("Connected to DB");
};

export default ConnectDB;
