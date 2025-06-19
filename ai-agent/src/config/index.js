/**
 * Application configuration settings
 */
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  letta: {
    apiKey: process.env.LETTA_API_KEY,
    baseUrl: process.env.LETTA_BASE_URL || null,
  },
  tools: {
    tavilyApiKey: process.env.TAVILY_API_KEY || "",
  }
};
