import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Có thể thay đổi theo dịch vụ email của bạn
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Xác thực Email của bạn',
    text: `Mã OTP của bạn là: ${otp}`,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Lỗi gửi email:', error)
  }
}
