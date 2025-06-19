/**
 * Main application entry point
 */
const express = require('express');
const config = require('./config');
const { setupClient } = require('./services/agentService');

// Import route handlers
const agentRoutes = require('./routes/agentRoutes');
const blockRoutes = require('./routes/blockRoutes');
const dataSourceRoutes = require('./routes/dataSourceRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Initialize Letta client
const lettaClient = setupClient();
app.locals.lettaClient = lettaClient;

// Set up routes
app.use('/agent', agentRoutes);
app.use('/block', blockRoutes);
app.use('/data-source', dataSourceRoutes);
app.use('/chat', chatRoutes);

// Root route for API info
app.get('/', (req, res) => {
  res.json({
    name: 'Letta AI Agent API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      agent: '/agent',
      block: '/block',
      dataSource: '/data-source',
      chat: '/chat',
      health: '/agent/health'
    }
  });
});

// Start the server
app.listen(config.port, () => {
  console.log(`Letta AI agent server running on port ${config.port}`);
});

module.exports = app; // Export for testing
