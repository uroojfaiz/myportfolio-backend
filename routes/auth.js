const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '');
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, email });
});

// Used by the client on page load to confirm a stored token is still valid,
// instead of optimistically showing admin controls that would fail on save.
router.get('/me', requireAdmin, (req, res) => {
  res.json({ ok: true, email: req.admin.email });
});

module.exports = router;
