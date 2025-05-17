import express from "express";
import cros from "cors";
import "dotenv/config";
import connectDB from "./config/mongdb.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
connectDB();
app.use(express.json());
app.use(cros());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Đang chạy...");
});

app.listen(port, () => console.log("Server đang chạy dưới port: " + port));
