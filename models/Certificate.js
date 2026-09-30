const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    issuer: { type: String, required: true, trim: true, maxlength: 80 },
    date: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
