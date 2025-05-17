import jwt from "jsonwebtoken";

const authorizeRole = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Không có mã người dùng, quyền hạn bị từ chối!" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (req.user.role === "admin") {
        return next();
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Truy cập bị từ chối: Yêu cầu một trong các vai trò sau: ${roles.join(
            ", "
          )}`,
        });
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Mã người dùng không hợp lệ, quyền hạn bị từ chối" });
    }
  };
};

export default authorizeRole;
