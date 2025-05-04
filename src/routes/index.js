const express = require('express');
const router = express.Router();

// Import individual route modules
const authRoutes = require('./authRoutes');
const chatRoutes = require('./chatRoutes');
const todoRoutes = require('./todoRoutes'); // If any

// Use them under appropriate base paths
router.use('/auth', authRoutes);         // /api/auth/...
router.use('/chat', chatRoutes);         // /api/chat/...
router.use('/todo', todoRoutes);        // /api/users/...

module.exports = router;
