import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("E-Commerce API đang chạy...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy dưới port ${PORT}`);
});
