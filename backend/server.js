const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const connectDB = require('./db');
const leadRoutes = require('./leadRoutes');
// const authRoutes = require('./routes/authRoutes'); // login/register — not shown, same pattern

const app = express();

connectDB();

// --- Security middleware stack ---
app.use(helmet()); // sets safe HTTP headers
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' })); // body size cap to reduce payload-based abuse

// Strips out any keys starting with '$' or containing '.' from
// req.body / req.query / req.params — this is the primary defense
// against NoSQL injection operator payloads (e.g. { "$gt": "" }).
app.use(mongoSanitize());

// Basic global rate limiting — tune per-route (e.g. stricter on /auth/login)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// --- Routes ---
const authRoutes = require('./authRoutes');
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/auth', authRoutes);

// Centralized error handler (catches anything thrown/passed to next())
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
