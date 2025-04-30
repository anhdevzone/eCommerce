import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import fs from "fs";
import { cloudinary } from "../config/cloudinary.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP ngẫu nhiên 6 chữ số
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP(); // Tạo OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn trong 10 phút

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    // Gửi email xác thực
    await sendVerificationEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công. Kiểm tra email để xác thực tài khoản.",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// Logic xác thực OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng với email này.",
      });
    }

    if (user.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Mã OTP không chính xác.", success: false });
    }

    // Kiểm tra hết hạn
    if (new Date() > user.otpExpiry) {
      return res
        .status(400)
        .json({ message: "Mã OTP đã hết hạn.", success: false });
    }

    // Xác thực email
    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: "Xác thực email thành công. Bạn có thể đăng nhập.",
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server.", error: error.message, success: false });
  }
};
// Đăng nhập tài khoản người dùng
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu.", success: false });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Tài khoản không tồn tại.", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Mật khẩu không đúng.", success: false });
    }

    // Kiểm tra xác thực email
    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Tài khoản chưa xác thực email. Vui lòng kiểm tra hộp thư.",
        success: false,
      });
    }

    // Tạo JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Trả về user info và token
    res.status(200).json({
      message: "Đăng nhập thành công.",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server.",
      error: error.message,
      success: false,
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu.", success: false });
    }

    // So sánh với thông tin trong .env
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không đúng.", success: false });
    }

    // Tạo access token
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({
      message: "Đăng nhập admin thành công.",
      success: true,
      user: {
        name: "ADMIN TỔNG",
        email,
        role: "admin",
      },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server.", error: error.message, success: false });
  }
};
// ✅ API: Admin tạo seller
export const createSeller = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Kiểm tra trùng email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email đã tồn tại.", success: false });
    }

    // Mã hoá mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const seller = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address,
      role: "seller",
      emailVerified: true, // Tài khoản do admin tạo thì đã xác thực sẵn
    });

    res.status(201).json({
      message: "Tạo tài khoản người bán thành công.",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        role: seller.role,
      },
      success: true,
    });
  } catch (error) {
    console.error("Lỗi tạo seller:", error);
    res
      .status(500)
      .json({ message: "Lỗi server.", error: error.message, success: false });
  }
};
// ✅ API: Seller đăng nhập
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await User.findOne({ email });
    if (!seller || seller.role !== "seller") {
      return res.status(401).json({
        message: "Tài khoản không hợp lệ hoặc không phải người bán.",
        success: false,
      });
    }

    if (seller.isBlocked) {
      return res
        .status(403)
        .json({ message: "Tài khoản người bán đã bị khoá.", success: false });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu.", success: false });
    }

    // Tạo token
    const token = jwt.sign(
      { id: seller._id, role: seller.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công.",
      token,
      user: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        role: seller.role,
        avatar: seller.avatar,
      },
      success: true,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập seller:", error);
    res
      .status(500)
      .json({ message: "Lỗi server.", error: error.message, success: false });
  }
};
// Cập nhật địa chỉ giao hàng
export const updateShippingAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, street, city, country } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    user.shippingAddress = {
      fullName,
      phone,
      street,
      city,
      country,
    };

    await user.save();

    res.status(200).json({
      message: "Cập nhật địa chỉ giao hàng thành công.",
      shippingAddress: user.shippingAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server.",
      error: error.message,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    console.log("User ID:", userId);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    const { email, currentPassword, newPassword } = req.body;

    // 1. Update email if it has changed
    if (email && email !== user.email) {
      user.email = email.toLowerCase();
    }

    // 2. Change password if requested
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Mật khẩu hiện tại không chính xác." });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // 3. Upload new avatar if provided
    if (req.file && req.file.path) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars", // Specify folder in Cloudinary
          public_id: `user_${userId}`, // Optional: Use a unique identifier
          overwrite: true, // Overwrite existing image if it exists
        });

        // Update user's avatar URL
        user.avatar = result.secure_url;

        // Delete temporary file after upload
        fs.unlinkSync(req.file.path);
      } catch (uploadErr) {
        console.error("Lỗi upload Cloudinary:", uploadErr);
        return res.status(500).json({
          message: "Lỗi upload ảnh đại diện.",
          error: uploadErr.message,
        });
      }
    }

    await user.save();

    res.status(200).json({
      message: "Cập nhật thông tin thành công.",
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Lỗi cập nhật thông tin người dùng:", error);
    res.status(500).json({
      message: "Lỗi server.",
      error: error.message,
    });
  }
};

// Gửi OTP để reset password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Vui lòng nhập email." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại." });
    }

    // Generate OTP and expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP to email
    await sendVerificationEmail(email, otp);

    res.status(200).json({
      message: "Mã OTP đã được gửi đến email của bạn.",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi forgotPassword:", error);
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// Xác thực OTP reset password
export const verifyOtpReset = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email và OTP là bắt buộc." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản." });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP không hợp lệ hoặc đã hết hạn." });
    }

    res.status(200).json({
      success: true,
      message: "Xác thực OTP thành công. Bạn có thể đổi mật khẩu.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// Đặt lại mật khẩu mới
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP và mật khẩu mới là bắt buộc.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản." });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP không hợp lệ hoặc đã hết hạn." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Xóa OTP sau khi reset xong
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};
