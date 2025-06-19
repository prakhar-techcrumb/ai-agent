/**
 * Block management service for creating and attaching memory blocks to agents
 */

/**
 * Create a memory block
 * @param {Object} client - Letta client instance
 * @param {Object} block - Block data including label, value, and description
 * @returns {Promise<string>} Block ID
 */
async function createBlock(client, block) {
    try {
        const createdBlock = await client.blocks.create({
            label: block.label,
            value: block.value,
            description: block.description || "",
            limit: block.limit || 3000,
        });

        console.log(`Block created with ID: ${createdBlock.id}`);
        return createdBlock.id;
    } catch (error) {
        throw new Error(`Failed to create block: ${error.message}`);
    }
}

/**
 * Attach a memory block to an agent
 * @param {Object} client - Letta client instance
 * @param {string} agentId - Agent ID
 * @param {string} blockId - Block ID
 * @returns {Promise<void>}
 */
async function attachBlockToAgent(client, agentId, blockId) {
    try {
        await client.agents.blocks.attach(agentId, blockId);
        console.log(`Block ${blockId} attached to agent ${agentId}`);
    } catch (error) {
        throw new Error(`Failed to attach block to agent: ${error.message}`);
    }
}

module.exports = {
    createBlock,
    attachBlockToAgent
};
