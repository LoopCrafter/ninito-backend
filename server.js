import express from "express";
import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import Routes from "./routes/index.js";
import cors from "cors";

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));
app.use("/", Routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`DB connected Successfully and listening to port ${PORT}`);
});
