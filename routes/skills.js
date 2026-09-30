const express = require('express');
const connectDB = require('../db');
const Skill = require('../models/Skill');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// Public — anyone visiting the portfolio can view skills
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ createdAt: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load skills.' });
  }
});

// Admin-only — add
router.post('/', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { name, category, level } = req.body;
    if (!name || !category || !level) {
      return res.status(400).json({ error: 'Name, category and level are required.' });
    }
    const skill = await Skill.create({ name, category, level });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add skill.' });
  }
});

// Admin-only — edit
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { name, category, level } = req.body;
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, category, level },
      { new: true, runValidators: true }
    );
    if (!skill) return res.status(404).json({ error: 'Skill not found.' });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update skill.' });
  }
});

// Admin-only — delete
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Skill not found.' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete skill.' });
  }
});

module.exports = router;
