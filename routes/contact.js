const express = require('express');
const rateLimit = require('express-rate-limit');
const connectDB = require('../db');
const ContactMessage = require('../models/ContactMessage');
const requireAdmin = require('../middleware/auth');
const sendContactEmail = require('../mailer');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per IP per window
  message: { error: 'Too many messages sent. Please try again later.' },
});

// Public — anyone can send a message
router.post('/', contactLimiter, async (req, res) => {
  try {
    await connectDB();
    const { name, email, message, website } = req.body;

    // Honeypot: real visitors never fill this hidden field, bots usually do.
    if (website) return res.status(201).json({ ok: true });

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are all required.' });
    }
    await ContactMessage.create({ name, email, message });
    sendContactEmail({ name, email, message }).catch(() => {}); // best-effort, never blocks the response
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// Admin-only — view the inbox
router.get('/', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages.' });
  }
});

// Admin-only — mark read / unread
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: !!req.body.read },
      { new: true }
    );
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message.' });
  }
});

// Admin-only — delete a message
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

module.exports = router;
