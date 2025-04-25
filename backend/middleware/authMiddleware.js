import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Nếu là admin từ .env thì không cần tìm DB
      if (
        decoded.email === process.env.ADMIN_EMAIL &&
        decoded.role === "admin"
      ) {
        req.user = {
          email: decoded.email,
          role: "admin",
        };
        return next();
      }

      // Nếu không phải admin, thì tìm từ DB
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Người dùng không tồn tại." });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      res.status(401).json({ message: "Token không hợp lệ." });
    }
  } else {
    res.status(401).json({ message: "Không có token xác thực." });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Không có quyền admin." });
  }
};
