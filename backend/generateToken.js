const jwt = require('jsonwebtoken');

/**
 * Signs a short-lived access token. Keep the payload minimal —
 * we only need enough to look the user up; authenticate() re-fetches
 * the authoritative role/tenantId from the DB on every request anyway.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

module.exports = generateToken;
