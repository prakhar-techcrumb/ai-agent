/**
 * Chat routes for message handling operations
 */
const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Route to send a message to an agent
router.post('/:agentId', chatController.handleMessage);

module.exports = router;
