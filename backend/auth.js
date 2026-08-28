const jwt = require('jsonwebtoken');
const User = require('./User');

/**
 * authenticate
 * ------------
 * Verifies the JWT, then re-hydrates tenantId and role from the DATABASE
 * (not just the token payload) on every request.
 *
 * Why re-fetch instead of trusting the token blindly?
 * - If an Owner demotes a user or deactivates their account mid-session,
 *   a stale JWT would otherwise keep granting the OLD role/tenant until
 *   it expires. Re-checking `isActive` and role here closes that gap.
 * - It also protects against a forged/tampered token claiming a different
 *   tenantId than the one actually stored for that user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }

    // Pull the current, authoritative state of the user from the DB
    const user = await User.findById(decoded.id).select('name email role tenantId isActive');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Not authorized, user no longer active' });
    }

    // Attach a minimal, trusted identity object to the request.
    // Every downstream controller relies on req.user.tenantId to scope queries.
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId, // <-- the multi-tenancy anchor for this request
    };

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

/**
 * authorizeRoles
 * --------------
 * A middleware FACTORY (closure) — call it with the roles allowed to
 * access a route, and it returns a middleware function tailored to that list.
 *
 * Usage:
 *   router.delete('/:id', authenticate, authorizeRoles('Admin', 'Owner'), deleteLead);
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      // Defensive check — authenticate() should always run first
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not permitted to perform this action`,
      });
    }

    next();
  };
};

module.exports = { authenticate, authorizeRoles };
