require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const projectRoutes = require('./routes/projects');
const categoryRoutes = require('./routes/categories');
const languageRoutes = require('./routes/languages');
const certificateRoutes = require('./routes/certificates');
const contactRoutes = require('./routes/contact');
const contentRoutes = require('./routes/content');
const experienceRoutes = require('./routes/experiences');
const testimonialRoutes = require('./routes/testimonials');

const app = express();

app.use(cors()); // if you want to restrict later: cors({ origin: 'https://yourportfolio.vercel.app' })
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Login is rate-limited separately — protects the admin account from brute-force attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again later.' },
});
app.use('/api/auth/login', loginLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/testimonials', testimonialRoutes);

const PORT = process.env.PORT || 5000;

// Local dev: start a normal server.
// On Vercel: the exported app is used directly as a serverless function.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
