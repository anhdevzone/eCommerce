import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    address: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String, // Lưu URL từ Cloudinary
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
    emailVerified: {
      type: Boolean,
      default: false, // Mặc định là chưa xác thực
    },
    pendingEmail: {
      type: String,
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
  },
  {
    timestamps: true, // Thêm createdAt và updatedAt
  }
);

const User = mongoose.model("User", userSchema);
export default User;
