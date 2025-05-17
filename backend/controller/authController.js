import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";

// Load biến môi trường
dotenv.config();

// Đăng nhập Admin
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu, Vui lòng kiểm tra lại",
      });
    }

    const isMatch = await bcrypt.compare(password, adminPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu, Vui lòng kiểm tra lại",
      });
    }

    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Đăng nhập quản trị viên thành công",
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Có lỗi máy chủ. Vui lòng thử lại!" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;
    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng không bỏ trống thông tin!",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không đúng định dạng. Vui lòng kiểm tra lại!",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email đã được đăng ký. Hãy nhập Email khác",
      });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại đã được đăng ký. Hãy nhập số khác",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: "user",
      emailVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.otp = otp;
    newUser.otpExpiry = Date.now() + 10 * 60 * 1000;

    await newUser.save();

    await sendEmail({
      to: email,
      subject: "Mã xác nhận email của bạn:",
      html: otpEmailTemplate(otp),
    });

    return res.status(200).json({
      success: true,
      message:
        "Mã OTP đã được gửi tới Email của bạn, Hãy kiểm tra Email để xác thực tài khoản",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email và OTP không được để trống!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không đúng. Vui lòng kiểm tra lại!",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Mã OTP đã hết hạn" });
    }

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Xác thực Email thành công, hãy đăng nhập tài khoản.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đủ thông tin!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản không tồn tại. Hãy kiểm tra lại!",
      });
    }

    if (!user.emailVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Email chưa được xác thực. Vui lòng kiểm tra hộp thư email để xác thực!",
      });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message:
          "Tài khoản của bạn đang khóa. Vui lòng liên hệ tổng đài để xử lý!",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email không đúng định dạng" });
    }

    const user = await User.findOne({ email });
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 100;
      await user.save();

      await sendEmail({
        to: email,
        subject: "Mã xác nhận email quên mật khẩu:",
        html: otpEmailTemplate(otp),
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Mã OTP đã được gửi về Email của bạn" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đủ thông tin!" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email không đúng định dạng" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công. Hãy đăng nhập lại",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
