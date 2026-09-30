const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    // category is a free key referencing Category.key — kept flexible so
    // the admin can add new categories (e.g. "cybersecurity") without a code change
    category: { type: String, required: true, trim: true, lowercase: true },
    desc: { type: String, required: true, maxlength: 400 },
    tools: [{ type: String, maxlength: 30 }],
    live: { type: String, default: '' },
    github: { type: String, default: '' },
    media: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    // Case study fields (all optional — shown only if filled in)
    problem: { type: String, default: '', maxlength: 600 },
    approach: { type: String, default: '', maxlength: 600 },
    architecture: { type: String, default: '' }, // architecture diagram image URL
  },
  { timestamps: true }
);

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
