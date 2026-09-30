const express = require('express');
const connectDB = require('../db');
const Testimonial = require('../models/Testimonial');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

const fields = (b) => ({
  name: b.name,
  role: b.role,
  org: b.org,
  quote: b.quote,
  avatar: b.avatar,
  rating: b.rating,
});

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const items = await Testimonial.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load testimonials.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!req.body.name || !req.body.quote) {
      return res.status(400).json({ error: 'Name and quote are required.' });
    }
    const item = await Testimonial.create(fields(req.body));
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add testimonial.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const item = await Testimonial.findByIdAndUpdate(req.params.id, fields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'Testimonial not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update testimonial.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Testimonial not found.' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete testimonial.' });
  }
});

module.exports = router;
