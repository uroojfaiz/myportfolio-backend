const express = require('express');
const connectDB = require('../db');
const Project = require('../models/Project');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

const fields = (b) => ({
  name: b.name,
  category: b.category,
  desc: b.desc,
  tools: b.tools,
  live: b.live,
  github: b.github,
  media: b.media,
  featured: !!b.featured,
  problem: b.problem,
  approach: b.approach,
  architecture: b.architecture,
});

// Public — anyone visiting the portfolio can view projects
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load projects.' });
  }
});

// Admin-only — add
router.post('/', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { name, category, desc } = req.body;
    if (!name || !category || !desc) {
      return res.status(400).json({ error: 'Name, category and description are required.' });
    }
    const project = await Project.create(fields(req.body));
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add project.' });
  }
});

// Admin-only — edit
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const project = await Project.findByIdAndUpdate(req.params.id, fields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// Admin-only — delete
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router;
