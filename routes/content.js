const express = require('express');
const connectDB = require('../db');
const Content = require('../models/Content');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// Public — the site reads its own editable content from here
router.get('/:key', async (req, res) => {
  try {
    await connectDB();
    const doc = await Content.findOne({ key: req.params.key.toLowerCase() });
    res.json(doc ? doc.data : {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to load content.' });
  }
});

// Admin-only — save the whole editable content object in one shot
router.put('/:key', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const data = req.body && typeof req.body === 'object' ? req.body : {};
    const doc = await Content.findOneAndUpdate(
      { key: req.params.key.toLowerCase() },
      { key: req.params.key.toLowerCase(), data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(doc.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save content.' });
  }
});

module.exports = router;
