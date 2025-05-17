import express from "express";
import {
  adminLogin,
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyOtp,
} from "../controller/authController.js";
import authorizeRole from "../middleware/authorizeRole.js";
const router = express.Router();

// Post
router.post("/admin/login-admin", adminLogin);
router.post("/register", registerUser);
router.post("/verify-email", verifyOtp);
router.post("/login-user", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/update-password", resetPassword);

export default router;
