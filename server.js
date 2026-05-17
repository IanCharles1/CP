/**
 * CHARMU PRIME VENTURES — CONTACT FORM BACKEND
 * Node.js + Express + Nodemailer
 *
 * SETUP:
 *   npm install express nodemailer cors dotenv
 *   Create a .env file with your credentials (see below)
 *   node server.js
 *
 * .env file contents:
 *   EMAIL_USER=charmuprimeventures@gmail.com
 *   EMAIL_PASS=your_gmail_app_password
 *   PORT=3000
 */

require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─── MIDDLEWARE ─── */
app.use(cors({ origin: '*' })); // Restrict to your domain in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve your HTML/CSS/JS files

/* ─── EMAIL TRANSPORTER ─── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use Gmail App Password, NOT your account password
  },
});

/* ─── CONTACT FORM ENDPOINT ─── */
app.post('/api/contact', async (req, res) => {
  const { fname, lname, email, phone, service, message } = req.body;

  // Server-side validation
  if (!fname || !lname || !email || !service || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  // Service label mapping
  const serviceLabels = {
    hardware: 'Computer & Laptop Supply',
    it:       'IT Consultancy',
    data:     'Data Analytics',
    web:      'Website Development',
    social:   'Social Media Management',
    writing:  'Professional Writing',
    other:    'General Inquiry',
  };

  const serviceLabel = serviceLabels[service] || service;

  try {
    // Email to the company
    await transporter.sendMail({
      from:    `"Charmu Prime Website" <${process.env.EMAIL_USER}>`,
      to:      'charmuprimeventures@gmail.com',
      subject: `[New Inquiry] ${serviceLabel} — ${fname} ${lname}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1E; color: #F5F0E8; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #C9A84C, #E8C96D); padding: 24px; text-align: center;">
            <h2 style="margin: 0; color: #0A0F1E; font-size: 22px;">New Website Inquiry</h2>
            <p style="margin: 8px 0 0; color: rgba(10,15,30,0.7); font-size: 14px;">Charmu Prime Ventures</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; color: #A8A39A; font-size: 13px; width: 140px;">Name</td><td style="padding: 10px 0; color: #F5F0E8;">${fname} ${lname}</td></tr>
              <tr><td style="padding: 10px 0; color: #A8A39A; font-size: 13px;">Email</td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #C9A84C;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 10px 0; color: #A8A39A; font-size: 13px;">Phone</td><td style="padding: 10px 0; color: #F5F0E8;">${phone}</td></tr>` : ''}
              <tr><td style="padding: 10px 0; color: #A8A39A; font-size: 13px;">Service</td><td style="padding: 10px 0; color: #C9A84C; font-weight: bold;">${serviceLabel}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #111827; border-radius: 8px; border-left: 3px solid #C9A84C;">
              <p style="margin: 0 0 8px; color: #A8A39A; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
              <p style="margin: 0; color: #F5F0E8; line-height: 1.7;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:${email}" style="background: linear-gradient(135deg, #C9A84C, #E8C96D); color: #0A0F1E; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">Reply to ${fname}</a>
            </div>
          </div>
          <div style="padding: 16px; text-align: center; border-top: 1px solid rgba(201,168,76,0.2);">
            <p style="margin: 0; color: #A8A39A; font-size: 12px;">Charmu Prime Ventures &bull; Nairobi, Kenya &bull; +254 728 427 203</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to the client
    await transporter.sendMail({
      from:    `"Charmu Prime Ventures" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: `We received your inquiry — Charmu Prime Ventures`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1E; color: #F5F0E8; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #C9A84C, #E8C96D); padding: 24px; text-align: center;">
            <h2 style="margin: 0; color: #0A0F1E;">Thank You, ${fname}!</h2>
            <p style="margin: 8px 0 0; color: rgba(10,15,30,0.7); font-size: 14px;">We've received your message</p>
          </div>
          <div style="padding: 32px; line-height: 1.8; color: #A8A39A;">
            <p>Hi <strong style="color: #F5F0E8;">${fname}</strong>,</p>
            <p>Thank you for reaching out to Charmu Prime Ventures. We've received your inquiry about <strong style="color: #C9A84C;">${serviceLabel}</strong> and one of our specialists will get back to you within <strong style="color: #F5F0E8;">24 business hours</strong>.</p>
            <p>In the meantime, feel free to call us directly:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="tel:+254728427203" style="background: linear-gradient(135deg, #C9A84C, #E8C96D); color: #0A0F1E; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold;">+254 728 427 203</a>
            </div>
            <p>Or chat with us on WhatsApp:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://wa.me/254728427203" style="background: #25D366; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold;">Chat on WhatsApp</a>
            </div>
            <p>We look forward to engineering something exceptional with you.</p>
            <p>Warm regards,<br><strong style="color: #F5F0E8;">The Charmu Prime Team</strong></p>
          </div>
          <div style="padding: 16px; text-align: center; border-top: 1px solid rgba(201,168,76,0.2);">
            <p style="margin: 0; color: #A8A39A; font-size: 12px;">Charmu Prime Ventures &bull; Nairobi, Kenya &bull; charmuprimeventures@gmail.com</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try calling us directly.' });
  }
});

/* ─── HEALTH CHECK ─── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', company: 'Charmu Prime Ventures' });
});

/* ─── START SERVER ─── */
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   Charmu Prime Ventures — Backend     ║
  ║   Server running on port ${PORT}          ║
  ║   http://localhost:${PORT}                ║
  ╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
