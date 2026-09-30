const express = require('express');
const connectDB = require('../db');
const Certificate = require('../models/Certificate');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load certificates.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { title, issuer, date, credentialUrl, image } = req.body;
    if (!title || !issuer) return res.status(400).json({ error: 'Title and issuer are required.' });
    const certificate = await Certificate.create({ title, issuer, date, credentialUrl, image });
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add certificate.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { title, issuer, date, credentialUrl, image } = req.body;
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id, { title, issuer, date, credentialUrl, image }, { new: true, runValidators: true }
    );
    if (!certificate) return res.status(404).json({ error: 'Certificate not found.' });
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update certificate.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found.' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete certificate.' });
  }
});

module.exports = router;
