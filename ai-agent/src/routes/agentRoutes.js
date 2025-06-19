/**
 * Agent routes for agent-related operations
 */
const express = require('express');
const agentController = require('../controllers/agentController');

const router = express.Router();

// Route to create a new agent
router.post('/create', agentController.createAgent);

// Health check endpoint
router.get('/health', agentController.getHealth);

module.exports = router;
