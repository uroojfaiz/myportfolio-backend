const nodemailer = require('nodemailer');

async function sendContactEmail({ name, email, message }) {
  if (!process.env.SMTP_HOST || !process.env.CONTACT_TO_EMAIL) {
    // Not configured — message is still saved to MongoDB, just no email sent.
    return { sent: false, reason: 'SMTP not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  return { sent: true };
}

module.exports = sendContactEmail;
