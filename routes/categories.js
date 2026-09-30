const express = require('express');
const connectDB = require('../db');
const Category = require('../models/Category');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load categories.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { label, icon, color } = req.body;
    if (!label) return res.status(400).json({ error: 'Label is required.' });
    const key = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const exists = await Category.findOne({ key });
    if (exists) return res.status(400).json({ error: 'A category with this name already exists.' });
    const category = await Category.create({ key, label, icon, color });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add category.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { label, icon, color } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { label, icon, color },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

module.exports = router;
