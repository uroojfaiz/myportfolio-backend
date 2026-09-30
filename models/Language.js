const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 30 },
    level: {
      type: String,
      required: true,
      enum: ['Native', 'Fluent', 'Intermediate', 'Basic'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Language || mongoose.model('Language', languageSchema);
