const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true, maxlength: 80 },
    org: { type: String, required: true, trim: true, maxlength: 80 },
    kind: { type: String, default: 'work' }, // work | education | training | freelance
    start: { type: String, default: '' },
    end: { type: String, default: '' },
    current: { type: Boolean, default: false },
    desc: { type: String, default: '', maxlength: 600 },
    tags: [{ type: String, maxlength: 30 }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
