const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: String, required: true, trim: true, maxlength: 40 },
    icon: { type: String, required: true, default: 'layers' },
    color: { type: String, required: true, default: '#F0C419' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
