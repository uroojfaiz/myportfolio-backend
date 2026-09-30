const express = require('express');
const connectDB = require('../db');
const Experience = require('../models/Experience');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

const fields = (b) => ({
  role: b.role,
  org: b.org,
  kind: b.kind,
  start: b.start,
  end: b.end,
  current: !!b.current,
  desc: b.desc,
  tags: b.tags,
  order: b.order,
});

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const items = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load experience.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!req.body.role || !req.body.org) {
      return res.status(400).json({ error: 'Role and organization are required.' });
    }
    const item = await Experience.create(fields(req.body));
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add experience.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const item = await Experience.findByIdAndUpdate(req.params.id, fields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'Entry not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update experience.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Entry not found.' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete experience.' });
  }
});

module.exports = router;
