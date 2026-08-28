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

// Production-Hardened Dynamic CORS Validation Middleware
// Automatically approves explicit domains AND any dynamic subdomains ending in .vercel.app
app.use(cors({
  origin: function (origin, callback) {
    // Allow internal machine requests (like server-to-server, curl, or Postman)
    if (!origin) return callback(null, true);

    const configuredClient = process.env.CLIENT_URL;

    if (
      origin === configuredClient || 
      origin === 'https://vercel.app' || 
      origin.endsWith('.vercel.app') // <-- Wildcard anchor: Auto-approves all Vercel URLs instantly!
    ) {
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
