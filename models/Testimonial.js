const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    role: { type: String, default: '', maxlength: 80 },
    org: { type: String, default: '', maxlength: 80 },
    quote: { type: String, required: true, maxlength: 600 },
    avatar: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
