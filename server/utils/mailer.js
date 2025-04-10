const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (to, { subject, html }) => {
  return transporter.sendMail({
    from: `"Natalie Nails" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = (to, token) => {
  const BASE_URL = process.env.BASE_URL || "https://natalie-booking-portal.railway.internal";
  const url = `${BASE_URL}/api/auth/verify?token=${token}`;

  return sendEmail(to, {
    subject: 'Verify your email address',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendEmail,
};
