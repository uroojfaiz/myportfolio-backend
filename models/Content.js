const mongoose = require('mongoose');

// A single flexible document per key (we use key = "site").
// Everything the admin can edit from the UI — hero text, about, stats,
// services, roadmap, profile, education, training, theme, SEO — lives here,
// so no text ever has to be changed in the code again.
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.models.Content || mongoose.model('Content', contentSchema);
