/**
 * Block controller for handling block-related HTTP requests
 */
const blockService = require('../services/blockService');

/**
 * Create a new memory block
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createBlock(req, res) {
  try {
    const blockId = await blockService.createBlock(
      req.app.locals.lettaClient, 
      req.body
    );
    return res.json({ blockId });
  } catch (error) {
    console.error('Error creating block:', error);
    return res.status(500).json({ error: 'Failed to create block' });
  }
}

/**
 * Attach a block to an agent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function attachBlockToAgent(req, res) {
  try {
    const { agentId, blockId } = req.body;

    if (!blockId) {
      return res.status(400).json({ error: 'Block ID is required' });
    }

    await blockService.attachBlockToAgent(
      req.app.locals.lettaClient,
      agentId,
      blockId
    );
    return res.json({ message: `Block ${blockId} attached to agent ${agentId}` });
  } catch (error) {
    console.error('Error attaching block to agent:', error);
    return res.status(500).json({ error: 'Failed to attach block to agent' });
  }
}

module.exports = {
  createBlock,
  attachBlockToAgent
};
