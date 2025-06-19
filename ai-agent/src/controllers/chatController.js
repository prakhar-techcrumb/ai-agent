/**
 * Chat controller for handling message-related HTTP requests
 */
const messageService = require('../services/messageService');

/**
 * Handle a chat message to an agent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleMessage(req, res) {
  try {
    const { agentId } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await messageService.handleUserMessage(
      req.app.locals.lettaClient, 
      message, 
      agentId
    );
    
    return res.json(response);
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ error: 'Failed to process message' });
  }
}

module.exports = {
  handleMessage
};
