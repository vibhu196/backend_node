const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send', authMiddleware, chatController.sendMessage);
router.get('/messages/:roomId', authMiddleware, chatController.getMessagesByRoom);
router.get('/inbox',authMiddleware,  chatController.getInbox);

module.exports = router;
