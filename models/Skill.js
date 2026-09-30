const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    // category is a free key referencing Category.key — kept flexible so
    // the admin can add new categories (e.g. "cybersecurity") without a code change
    category: { type: String, required: true, trim: true, lowercase: true },
    level: { type: Number, required: true, min: 5, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
