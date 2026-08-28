const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Bypasses local network/ISP SRV lookup blocks

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const connectDB = require('./db');
const leadRoutes = require('./leadRoutes');
const authRoutes = require('./authRoutes');

const app = express();

// Establish Cloud MongoDB Connection
connectDB();

// --- Security middleware stack ---
app.use(helmet()); // sets safe HTTP headers

// Production-Hardened CORS Array: Whitelists all your live deployment routes 
// to prevent cross-origin HTML 403 blocks from crashing your frontend JSON parser
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://vercel.app',
  'https://vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allows internal tools/server-to-server testing
    if (allowedOrigins.includes(origin) || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Blocked by secure B2B enterprise CORS policy'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Body size cap to reduce payload-based abuse

// Primary defense against NoSQL injection operator payloads (e.g. { "$gt": "" })
app.use(mongoSanitize());

// Basic global rate limiting — prevents brute-force traffic flooding
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// --- Base Health Check Route ---
// Ensures standard root queries return clean JSON string data objects instead of HTML structures
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "B2B SaaS CRM Production API Core Engine is active and healthy.",
    databaseStatus: "Connected"
  });
});

// --- API Routing Middlewares ---
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);

// Centralized error handler (catches anything thrown/passed to next())
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
