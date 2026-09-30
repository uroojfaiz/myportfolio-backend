const express = require('express');
const connectDB = require('../db');
const Language = require('../models/Language');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const languages = await Language.find().sort({ createdAt: 1 });
    res.json(languages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load languages.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { name, level } = req.body;
    if (!name || !level) return res.status(400).json({ error: 'Name and level are required.' });
    const language = await Language.create({ name, level });
    res.status(201).json(language);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add language.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { name, level } = req.body;
    const language = await Language.findByIdAndUpdate(
      req.params.id, { name, level }, { new: true, runValidators: true }
    );
    if (!language) return res.status(404).json({ error: 'Language not found.' });
    res.json(language);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update language.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const language = await Language.findByIdAndDelete(req.params.id);
    if (!language) return res.status(404).json({ error: 'Language not found.' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete language.' });
  }
});

module.exports = router;
