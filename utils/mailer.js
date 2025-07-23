// mailer.js

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Send OTP Email
exports.sendOTPEmail = async (to, otp, name) => {
  const mailOptions = {
    from: `"Pasheon" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Your Pasheon OTP Verification Code',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <h2>Hello ${name},</h2>
        <p>Thank you for signing up at <strong>Pasheon</strong>.</p>
        <p>Your OTP for verification is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br/>
        <p>Regards,<br/>Team Pasheon</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// For password reset
exports.sendPasswordResetOTP = async (to, otp, name) => {
  const mailOptions = {
    from: `"Pasheon" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Pasheon Password Reset OTP',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <h2>Hello ${name},</h2>
        <p>We received a request to reset your password.</p>
        <p>Your OTP to reset password is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <br/>
        <p>Regards,<br/>Team Pasheon</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};