// utils/templates/emailTemplates.js
export const otpEmailTemplate = (otp) => {
  return `
    <div style="background-color:#0056e0; padding: 40px 0; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #0056e0; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: white; font-family: 'Arial', sans-serif; letter-spacing: 1px;">
            Zenmart
          </h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p>Xin chào,</p>
          <p>Chúng tôi đã nhận được yêu cầu xác thực email của bạn.</p>
          <p>Mã xác thực của bạn là:</p>

          <div style="font-size: 28px; font-weight: bold; color: #000; text-align: center; margin: 20px 0;">
            ${otp}
          </div>

          <p style="font-size: 14px; color: #666;">Lưu ý: Mã OTP này chỉ có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">Nếu bạn không yêu cầu xác thực này, bạn có thể bỏ qua email này.</p>

          <p style="margin-top: 30px;">Cảm ơn,</p>
          <p style="font-weight: bold;">Đội ngũ hỗ trợ khách hàng</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999;">
          © 2025 Công ty của bạn. All rights reserved. • <a href="#" style="color: #0056e0; text-decoration: none;">Liên hệ</a>
        </div>
      </div>
    </div>
  `;
};

// Bạn có thể thêm các template email khác ở đây khi cần
