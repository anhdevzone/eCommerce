import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String, // URL cloudinary
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    emailVerified: {
      type: Boolean,
      default: false, // Mặc định là chưa xác thực
    },
    otp: {
      type: String, // Mã OTP sẽ được lưu ở đây
    },
    otpExpiry: {
      type: Date, // Thời gian hết hạn của mã OTP
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      fullName: { type: String },
      phone: { type: String },
      street: { type: String },
      city: { type: String },
      country: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
