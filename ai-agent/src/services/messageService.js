/**
 * Message handling service for interactions with Letta agents
 */

/**
 * Handle a user message and get a response from the Letta agent
 * @param {Object} client - Letta client instance
 * @param {string} message - Message from the user
 * @param {string} agentId - Agent ID for the agent
 * @returns {Promise<Object>} Processed response from the agent
 */
async function handleUserMessage(client, message, agentId) {
  try {
    console.log(`Processing message from user using agent ID : ${agentId}`);
    
    // Send the message to the agent (just the new message since Letta is stateful)
    const response = await client.agents.messages.create(agentId, {
      messages: [{ role: "user", content: message }]
    });
    
    // Process and format the response
    return processAgentResponse(response);
  } catch (error) {
    throw new Error(`Failed to process message: ${error.message}`);
  }
}

/**
 * Process and format the agent's response
 * @param {Object} response - Raw response from the Letta agent
 * @returns {Object} Formatted response
 */
function processAgentResponse(response) {
  // Initialize response object
  const formattedResponse = {
    messages: [],
    tools: [],
    reasoning: null,
    statistics: null
  };
  
  // Process each message in the response
  if (response.messages && Array.isArray(response.messages)) {
    for (const msg of response.messages) {
      if (msg.messageType === "assistant_message") {
        // Add assistant message to the formatted response
        formattedResponse.messages.push({
          type: "text",
          content: msg.content
        });
      } else if (msg.messageType === "tool_call_message") {
        // Add tool calls to the formatted response
        formattedResponse.tools.push({
          name: msg.toolCall.name,
          arguments: msg.toolCall.arguments
        });
      } else if (msg.messageType === "reasoning_message") {
        // Add reasoning to the formatted response
        formattedResponse.reasoning = msg.reasoning;
      } else if (msg.messageType === "tool_return_message") {
        // Add tool returns to the formatted response
        formattedResponse.tools.push({
          name: "return",
          result: msg.toolReturn
        });
      } else if (msg.messageType === "usage_statistics") {
        // Add usage statistics to the formatted response
        formattedResponse.statistics = msg;
      }
    }
  }
  
  return formattedResponse;
}

module.exports = {
  handleUserMessage
};
