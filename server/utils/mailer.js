const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = (to, token) => {
    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
    const url = `${BASE_URL}/api/auth/verify?token=${token}`;    

  return transporter.sendMail({
    from: `"Natalie Nails" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your email address',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
};

module.exports = sendVerificationEmail;