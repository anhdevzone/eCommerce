import express from "express";
import {
  createSeller,
  registerUser,
  loginAdmin,
  loginSeller,
  verifyOTP,
  loginUser,
  updateShippingAddress,
  updateProfile,
} from "../controllers/authController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Đăng ký
router.post("/register", registerUser);

// Xác thực OTP
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/create-seller", protect, adminOnly, createSeller);
router.post("/seller-login", loginSeller);
router.put("/shipping-address", protect, updateShippingAddress);
router.put("/update-profile", protect, upload.single("avatar"), updateProfile);

export default router;
