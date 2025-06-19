/**
 * Block routes for memory block operations
 */
const express = require('express');
const blockController = require('../controllers/blockController');

const router = express.Router();

// Route to create a new block
router.post('/create', blockController.createBlock);

// Route to attach a block to an agent
router.post('/attach', blockController.attachBlockToAgent);

module.exports = router;
