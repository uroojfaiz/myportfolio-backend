const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Login required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extra check: even a valid token is rejected if it isn't the admin's email.
    // Protects against a stale token if ADMIN_EMAIL is ever changed.
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}

module.exports = requireAdmin;
