/**
 * Agent controller for handling agent-related HTTP requests
 */
const agentService = require('../services/agentService');

/**
 * Create a new agent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createAgent(req, res) {
  try {
    const agentId = await agentService.createAgent(req.app.locals.lettaClient);
    return res.json({ agentId });
  } catch (error) {
    console.error('Error creating agent:', error);
    return res.status(500).json({ error: 'Failed to create agent' });
  }
}

/**
 * Get health status of the API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getHealth(req, res) {
  res.json({ status: 'ok', timestamp: new Date() });
}

module.exports = {
  createAgent,
  getHealth
};
