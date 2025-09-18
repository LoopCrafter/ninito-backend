import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.DB_URL}`);
  } catch (e) {
    console.log(`error Connection to Mongo Db ${e.message}`);
    process.exit(1);
  }
};
