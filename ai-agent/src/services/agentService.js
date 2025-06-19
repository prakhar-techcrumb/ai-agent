const { LettaClient } = require('@letta-ai/letta-client');
const config = require('../config');

/**
 * Setup Letta client and initialize configuration
 * @returns {LettaClient} Letta client instance
 */
function setupClient() {
  // Initialize Letta client based on configuration
  const client = new LettaClient({ baseUrl: config.letta.baseUrl, token: config.letta.apiKey });

  console.log('Letta client initialized');
  return client;
}

/**
 * Get or create an agent for a specific user
 * @param {LettaClient} client - Letta client instance
 * @returns {Promise<string>} Agent ID for the user
 */
async function createAgent(client) {
  try {
    const agent = await client.agents.create({
      // Configure memory blocks for the agent
      memoryBlocks: [
        {
          label: "persona",
          value: "I am a helpful AI assistant named Letta Agent. I'm friendly, professional, and helpful. I'll keep track of our conversation history and remember what we've discussed."
        },
        {
          label: "human",
          value: "You are a user interacting with the Letta AI agent. You can ask questions, request information, or seek assistance on various topics.",
          description: "Describes the user interacting with the agent."
        },
        {
          label: "context",
          value: "I am a stateful agent that maintains memory across conversations. Each time the user comes back, I will remember our previous interactions.",
          description: "Stores important context about the agent's capabilities and conversation history."
        }
      ],
      toolExecEnvironmentVariables: {
        TAVILY_API_KEY: config.tools.tavilyApiKey,
      },
      tools: ["web_search", "run_code"],
      model: process.env.LETTA_LLM_MODEL,
      includeBaseTools: true,
      embedding: process.env.LETTA_EMBEDDING_MODEL,
    });

    console.log(`Agent created with ID : ${agent.id}`);
    
    return agent.id;
  } catch (error) {
    throw new Error(`Failed to create agent: ${error.message}`);
  }
}

module.exports = {
  setupClient,
  createAgent
};
