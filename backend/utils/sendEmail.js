import nodemailer from "nodemailer";

export const sendVerificationEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Có thể thay đổi theo dịch vụ email của bạn
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Xác thực Email của bạn",
    html: `
      <div style="background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 800px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold;">
            Xác thực Email
          </div>
          <div style="padding: 30px; font-family: Arial, sans-serif; color: #333;">
            <p>Xin chào,</p>
            <p>Chúng tôi đã nhận được yêu cầu xác thực email của bạn.</p>
            <p style="margin: 20px 0;">Mã OTP của bạn là:</p>
            <div style="font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #777;">Lưu ý: Mã OTP này chỉ có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
            <div style="margin-top: 40px; text-align: center;">
              <p style="font-size: 14px; color: #777;">Nếu bạn không yêu cầu xác thực này, vui lòng bỏ qua email này.</p>
            <p style="font-size: 14px; color: #777;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <p style="font-size: 14px; color: #777;">Trân trọng,</p>
            <p style="font-size: 14px; color: #777;">Đội ngũ hỗ trợ khách hàng</p>
            </div>
          </div>
          <div style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 12px; color: #888;">
            © 2025 Công ty của bạn. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Lỗi gửi email:", error);
  }
};
