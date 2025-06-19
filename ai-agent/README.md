# Letta AI Agent

A simple stateful AI agent implementation using Letta.

## Overview

This project implements a stateful AI agent using Letta, where each user's context builds up over time. When a user interacts with the agent, it maintains context across conversations, allowing for more personalized and continuous interactions.

## Features

- Stateful agent that remembers previous interactions
- User-specific agents that maintain separate context for each user
- Memory block management for custom agent behavior
- Data source support for loading documents into agent's archival memory
- Built-in support for web search and code execution tools
- Simple REST API for client integration
- Well-organized modular codebase following MVC architecture

## Project Structure

```
src/
├── config/        # Configuration settings
├── services/      # Core business logic
│   ├── agentService.js    # Agent creation and management
│   ├── blockService.js    # Memory block operations
│   └── messageService.js  # Message handling logic
├── controllers/   # HTTP request handlers
├── routes/        # API route definitions
└── index.js       # Application entry point
```

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   
   Or use the setup script:
   ```
   chmod +x setup.sh
   ./setup.sh
   ```

3. Configure your environment variables by creating a `.env` file:
   ```
   # Required for Letta Cloud
   LETTA_API_KEY=your_api_key_here
   
   # Optional for self-hosted Letta server
   # LETTA_BASE_URL=http://localhost:8283
   
   # Optional for web search capability
   # TAVILY_API_KEY=your_tavily_api_key_here
   ```

4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## API Usage

### Create a New Agent

Create a new Letta AI agent with initialized memory blocks.

```
POST /agent/create
```

**Request Body:** None required

**Response:**
```json
{
  "agentId": "agent_123456789"
}
```

### Send a Message to an Agent

Send a message to an existing agent and get a response.

```
POST /chat/:agentId
```

**Parameters:**
- `agentId`: The ID of the agent to communicate with (path parameter)

**Request Body:**
```json
{
  "message": "Your message to the agent"
}
```

**Response:**
```json
{
  "messages": [
    {
      "type": "text",
      "content": "The agent's response"
    }
  ],
  "tools": [],
  "reasoning": "The agent's reasoning process",
  "statistics": {}
}
```

### Create a Memory Block

Create a new memory block that can later be attached to agents.

```
POST /block/create
```

**Request Body:**
```json
{
  "label": "custom_knowledge",
  "value": "This is information that the agent should know about.",
  "description": "Custom knowledge base for the agent",
  "limit": 3000
}
```

**Response:**
```json
{
  "blockId": "block_123456789"
}
```

### Attach a Memory Block to an Agent

Associate an existing memory block with an agent.

```
POST /block/attach
```

**Request Body:**
```json
{
  "agentId": "agent_123456789",
  "blockId": "block_123456789"
}
```

**Response:**
```json
{
  "message": "Block block_123456789 attached to agent agent_123456789"
}
```

### Create a Data Source

Create a new data source that can be used to load files into an agent's archival memory.

```
POST /data-source/create
```

**Request Body:**
```json
{
  "name": "my_knowledge_base",
  "embeddingModel": "google_ai/embedding-001"  // Optional, will use default if not specified
}
```

**Response:**
```json
{
  "dataSourceId": "source_123456789",
  "name": "my_knowledge_base",
  "embedding": "google_ai/embedding-001"
}
```

### Upload File to Data Source

Upload a file to a data source for processing and embedding.

```
POST /data-source/upload
```

**Request Body:**
Must be multipart/form-data with:
- `file`: The file to upload
- `dataSourceId`: ID of the data source

**Response:**
```json
{
  "jobId": "job_123456789",
  "status": "processing",
  "message": "File upload job started"
}
```

### List Data Sources

Get a list of all data sources.

```
GET /data-source/list
```

**Response:**
```json
{
  "sources": [
    {
      "id": "source_123456789",
      "name": "my_knowledge_base",
      "embeddingConfig": "google_ai/embedding-001"
    }
  ]
}
```

### List Files in a Data Source

Get a list of all files in a specific data source.

```
GET /data-source/:dataSourceId/files
```

**Response:**
```json
{
  "dataSourceId": "source_123456789",
  "files": [
    {
      "id": "file_123456789",
      "filename": "document.pdf",
      "status": "processed"
    }
  ]
}
```

### List Passages in a Data Source

Get a list of all passages (embedded chunks) in a specific data source.

```
GET /data-source/:dataSourceId/passages
```

**Response:**
```json
{
  "dataSourceId": "source_123456789",
  "passages": [
    {
      "id": "passage_123456789",
      "text": "This is a chunk of text from the document",
      "fileId": "file_123456789"
    }
  ]
}
```

### Attach a Data Source to an Agent

Attach a data source to an agent to add its passages to the agent's archival memory.

```
POST /data-source/attach
```

**Request Body:**
```json
{
  "agentId": "agent_123456789",
  "dataSourceId": "source_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data Source source_123456789 attached to agent agent_123456789"
}
```

### Detach a Data Source from an Agent

Detach a data source from an agent to remove its passages from the agent's archival memory.

```
POST /data-source/detach
```

**Request Body:**
```json
{
  "agentId": "agent_123456789",
  "dataSourceId": "source_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data Source source_123456789 detached from agent agent_123456789"
}
```

### Health Check

Check if the API service is running properly.

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-06-18T12:34:56.789Z"
}
```

## How It Works

1. Create an agent using the `/agent/create` endpoint
2. Send messages to the agent using the `/chat/:agentId` endpoint
3. Create custom memory blocks with the `/block/create` endpoint if needed
4. Attach memory blocks to agents with `/block/attach` for specialized behavior
5. The agent processes messages, maintaining context across interactions
6. Responses are formatted and returned to the client

## Project Structure

```
ai-agent/
├── package.json         # Project dependencies and scripts
├── README.md            # Documentation (this file)
├── setup.sh             # Setup script for easy installation
├── uploads/             # Temporary directory for file uploads
└── src/
    ├── config/          # Application configuration
    │   └── index.js     # Config settings and environment variables
    ├── controllers/     # HTTP request handlers
    │   ├── agentController.js     # Agent-related endpoints
    │   ├── blockController.js     # Block memory management
    │   ├── chatController.js      # Message handling
    │   └── dataSourceController.js # Data source management
    ├── routes/          # API route definitions
    │   ├── agentRoutes.js         # Agent-related routes
    │   ├── blockRoutes.js         # Block memory routes
    │   ├── chatRoutes.js          # Chat routes
    │   └── dataSourceRoutes.js    # Data source routes
    ├── services/        # Business logic
    │   ├── agentService.js        # Agent creation and management
    │   ├── blockService.js        # Block creation and management
    │   ├── dataSourceService.js   # Data source management
    │   └── messageService.js      # Message processing logic
    └── index.js         # Main application entry point
```

## Notes

- Each agent has its own memory and context
- The agent's memory persists between sessions
- Memory blocks can be shared across agents when needed
- Only new messages need to be sent, as Letta maintains conversation history

## License

ISC
