const express = require('express');
const router = express.Router();
const { loginUser } = require('./authController');

// This must be exactly '/' or '/login' — do NOT include '/api/auth' here
router.post('/login', loginUser);

module.exports = router;
