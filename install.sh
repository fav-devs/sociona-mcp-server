#!/bin/bash

# Sociona MCP Server Installation Script

echo "🚀 Installing Sociona MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install the package globally
echo "📦 Installing sociona-mcp-server globally..."
npm install -g .

if [ $? -eq 0 ]; then
    echo "✅ Sociona MCP Server installed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Get your API key from https://sociona.app/developer"
    echo "2. Add this to your Claude Desktop config:"
    echo ""
    echo '   {'
    echo '     "mcpServers": {'
    echo '       "sociona": {'
    echo '         "command": "sociona-mcp",'
    echo '         "args": [],'
    echo '         "env": {'
    echo '           "SOCIONA_API_KEY": "sk_live_your_api_key_here",'
    echo '           "SOCIONA_API_BASE": "https://api.sociona.app/api/v1"'
    echo '         }'
    echo '       }'
    echo '     }'
    echo '   }'
    echo ""
    echo "3. Restart Claude Desktop"
    echo ""
    echo "🎉 You're ready to use Sociona with Claude Desktop!"
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
