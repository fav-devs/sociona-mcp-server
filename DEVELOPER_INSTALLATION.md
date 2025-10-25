# Sociona MCP Server - Developer Installation

## Overview
The Sociona MCP Server allows developers to interact with the Sociona social media API through AI assistants and MCP-compatible tools using natural language commands.

## Installation

### 1. Install the MCP Server
```bash
# Install globally (recommended)
npm install -g sociona-mcp-server

# Or install locally in your project
npm install sociona-mcp-server
```

### 2. Get Your Sociona API Key
1. Sign up at [Sociona Developer Portal](https://sociona.app/developer)
2. Create a new application
3. Generate an API key with required scopes:
   - `posts:write` - for publishing posts
   - `posts:read` - for reading posts
   - `schedule:write` - for scheduling posts
   - `schedule:read` - for reading scheduled posts

### 3. Configure Your MCP Client

#### For Claude Desktop
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

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

#### For Other MCP Clients
Configure your MCP client to use the `sociona-mcp` command with the required environment variables.

### 4. Restart Your MCP Client
Restart your MCP client to load the new MCP server configuration.

## Available Tools

Once configured, you can use these natural language commands with your MCP client:

### Publishing Posts
```
"Post to Twitter: Just launched our new feature! 🚀 #TechNews"
"Publish to Instagram: Check out our latest product update"
"Post to Threads: Excited to share our company milestone"
```

### Scheduling Posts
```
"Schedule a post for Twitter tomorrow at 10 AM about our weekly roundup"
"Schedule an Instagram post for next Friday at 2 PM with this image"
"Schedule a Threads post for next Monday morning"
```

### Managing Accounts
```
"Show me my connected social media accounts"
"List all my connected platforms"
```

### Viewing Posts
```
"Get my last 10 posts"
"Show me my recent Twitter posts"
"Get my Instagram post history"
```

### Managing Scheduled Posts
```
"Show me my scheduled posts"
"Get my upcoming scheduled posts"
"Cancel the scheduled post with ID sched-123"
```

### Analytics
```
"What's my posting statistics?"
"Show me my social media analytics"
"Get my posting stats for this month"
```

## API Integration

The MCP server makes HTTP requests to the Sociona API:

- **Base URL**: `https://api.sociona.app/api/v1`
- **Authentication**: Bearer token using your API key
- **Endpoints Used**:
  - `GET /accounts` - List connected accounts
  - `POST /posts` - Publish posts
  - `POST /posts/schedule` - Schedule posts
  - `GET /posts` - Get post history
  - `GET /posts/scheduled` - Get scheduled posts
  - `DELETE /posts/scheduled/{id}` - Cancel scheduled posts
  - `GET /posts/stats` - Get posting statistics

## Development

### Local Development
1. Make changes to `src/index.ts`
2. Run `npm run build` to compile TypeScript
3. Update your Claude Desktop config to point to the rebuilt `dist/index.js`
4. Test the changes through Claude Desktop

### Adding New Tools
To add new tools to the MCP server:

1. Add the tool definition in the `ListToolsRequestSchema` handler
2. Add the tool implementation in the `CallToolRequestSchema` handler
3. Create a private method to handle the API call
4. Rebuild and test

## Troubleshooting

### Common Issues

1. **"SOCIONA_API_KEY environment variable is required"**
   - Ensure your API key is set in the Claude Desktop config

2. **"No accounts connected"**
   - Connect your social media accounts in the Sociona dashboard first

3. **Rate limit exceeded**
   - Check your API key's rate limits in the developer portal

4. **MCP server not loading**
   - Verify the path to `dist/index.js` is absolute and correct
   - Check Claude Desktop logs for errors

5. **API request failed**
   - Verify your API key is valid
   - Check that the Sociona API is accessible
   - Ensure you have the required scopes

### Logs
The MCP server logs to stderr. Check Claude Desktop's logs for debugging information.

## Support

- **Documentation**: [Sociona API Docs](https://docs.sociona.app)
- **Developer Portal**: [Sociona Developer Portal](https://sociona.app/developer)
- **Issues**: Report issues in the GitHub repository
