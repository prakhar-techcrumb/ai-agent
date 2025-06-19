#!/bin/bash

# Letta AI Agent Setup Script

echo "Setting up Letta AI Agent..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
  echo "Please edit the .env file and add your Letta API key."
else
  echo ".env file already exists."
fi

echo "Setup complete! You can now run the agent with 'npm start' or 'npm run dev' for development mode."
