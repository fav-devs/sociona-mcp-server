# Sociona MCP Server Architecture

## Overview
The Sociona MCP Server is designed to run **locally** on each developer's machine, not on a remote server. It acts as a bridge between Claude Desktop and the Sociona API.

## Architecture Diagram

```
Developer's Machine:
├── Claude Desktop (local)
│   └── Spawns MCP Server Process
└── sociona-mcp-server (local)
    └── HTTP Requests → api.sociona.app (your backend)
```

## Components

### 1. MCP Server (Local)
- **Location**: Developer's machine
- **Installation**: `npm install -g sociona-mcp-server`
- **Transport**: stdio (standard input/output)
- **Communication**: Direct process communication with Claude Desktop
- **Purpose**: Translates MCP protocol to HTTP API calls

### 2. Sociona Backend API (Remote)
- **Location**: Railway/Cloud (api.sociona.app)
- **Purpose**: Handles actual social media API calls
- **Features**: Authentication, data storage, account management
- **Access**: Public API endpoints

## Why No Remote MCP Server?

### MCP Servers Are Local by Design
- **stdio transport**: Communicates via stdin/stdout, not HTTP
- **Process spawning**: Claude Desktop spawns the MCP server as a child process
- **No web interface**: MCP servers don't serve web pages or REST APIs
- **User-specific**: Each user needs their own instance with their API keys

### Benefits of Local MCP Server
- ✅ **Privacy**: API keys stay on user's machine
- ✅ **Performance**: No network latency for MCP communication
- ✅ **Reliability**: No dependency on external MCP server
- ✅ **Simplicity**: Standard MCP pattern, easy to install and use

## What We Actually Need on Railway

### Sociona Backend API (api.sociona.app)
- ✅ **User authentication** - Handle API keys and user accounts
- ✅ **Social media integration** - Connect to Twitter, Instagram, Threads APIs
- ✅ **Data storage** - Store posts, schedules, analytics
- ✅ **Rate limiting** - Manage API quotas and limits
- ✅ **Webhooks** - Handle social media platform callbacks

### NOT Needed on Railway
- ❌ **MCP Server** - Runs locally on each developer's machine
- ❌ **Web interface for MCP** - MCP servers don't have web UIs
- ❌ **MCP-specific domains** - MCP uses stdio, not HTTP

## Developer Experience

### Installation
```bash
npm install -g sociona-mcp-server
```

### Configuration
```json
{
  "mcpServers": {
    "sociona": {
      "command": "sociona-mcp",
      "args": [],
      "env": {
        "SOCIONA_API_KEY": "sk_live_your_api_key_here",
        "SOCIONA_API_BASE": "https://api.sociona.app/api/v1"
      }
    }
  }
}
```

### Usage
```
"Post to Twitter: Hello world!"
"Show me my connected accounts"
"Schedule a post for tomorrow"
```

## Summary

- **MCP Server**: Local installation, stdio transport
- **Backend API**: Remote (Railway), HTTP transport
- **No Railway MCP deployment needed** - MCP servers run locally
- **Focus on backend API** - That's what needs to be robust and scalable
