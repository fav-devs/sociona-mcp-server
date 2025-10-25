# Railway Deployment for Sociona MCP Server

## Overview

The Sociona MCP Server can be deployed as a separate Railway service that provides AI tools for Claude Desktop integration.

## Prerequisites

1. **Railway CLI installed**: `npm install -g @railway/cli`
2. **Logged into Railway**: `railway login`
3. **Sociona API Key**: Get from your Sociona Developer Portal

## Deployment Steps

### Step 1: Create Railway Project

```bash
# Create new project for MCP server
railway init --name "sociona-mcp-server"
```

### Step 2: Set Environment Variables

```bash
# Set required environment variables
railway variables set NODE_ENV=production
railway variables set SOCIONA_API_KEY="sk_live_your_api_key_here"
railway variables set SOCIONA_API_BASE="https://api.sociona.com/api/v1"
```

### Step 3: Deploy

```bash
# Deploy the MCP server
railway up --detach
```

### Step 4: Get Service URL

```bash
# Get the Railway domain for your MCP server
railway domain
```

## Alternative: Add to Existing Project

If you want to add the MCP server to your existing PostPal project:

```bash
# Link to existing project
railway link

# Add as new service
railway add --name "mcp-server"

# Set environment variables for the MCP service
railway variables set --service mcp-server SOCIONA_API_KEY="sk_live_your_key_here"
railway variables set --service mcp-server SOCIONA_API_BASE="https://api.sociona.com/api/v1"
railway variables set --service mcp-server NODE_ENV=production

# Deploy
railway up --service mcp-server --detach
```

## Configuration for Claude Desktop

Once deployed, use the Railway domain in your Claude Desktop config:

```json
{
  "mcpServers": {
    "sociona": {
      "command": "node",
      "args": ["/app/dist/index.js"],
      "env": {
        "SOCIONA_API_KEY": "sk_live_your_key_here",
        "SOCIONA_API_BASE": "https://api.sociona.com/api/v1"
      }
    }
  }
}
```

**Note**: MCP servers communicate via stdio, not HTTP. The Railway service runs the MCP server process, and Claude Desktop connects to it locally.

## Health Check

The MCP server doesn't expose HTTP endpoints, but you can verify it's running by checking the Railway logs:

```bash
railway logs --service mcp-server
```

You should see: `"Sociona MCP server running on stdio"`

## Troubleshooting

### Common Issues

1. **"SOCIONA_API_KEY environment variable is required"**
   - Ensure the API key is set in Railway variables

2. **Connection timeout**
   - MCP servers need to stay running; check Railway service status

3. **Permission denied errors**
   - Verify your Sociona API key has the required scopes

### Logs and Monitoring

```bash
# View recent logs
railway logs --service mcp-server --lines 50

# View real-time logs
railway logs --service mcp-server --follow
```

## Cost Optimization

MCP servers are lightweight and don't need:
- PostgreSQL database
- Redis cache
- High memory allocation

Use Railway's smallest instance size for cost efficiency.