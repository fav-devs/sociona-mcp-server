# Local MCP Server Setup Guide

## Overview
The Sociona MCP Server should run **locally** on each user's machine, not on Railway. MCP servers communicate via stdio (standard input/output), not HTTP.

## Quick Setup

### 1. Install Dependencies
```bash
cd packages/sociona-mcp-server
pnpm install
pnpm build
```

### 2. Get Your Sociona API Key
1. Go to [Sociona Developer Portal](https://sociona.app/developer)
2. Generate an API key with appropriate scopes:
   - `posts:write` - for publishing posts
   - `posts:read` - for reading posts
   - `schedule:write` - for scheduling posts
   - `schedule:read` - for reading scheduled posts

### 3. Configure Claude Desktop

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sociona": {
      "command": "node",
      "args": ["/absolute/path/to/postpal1/packages/sociona-mcp-server/dist/index.js"],
      "env": {
        "SOCIONA_API_KEY": "sk_live_your_actual_api_key_here",
        "SOCIONA_API_BASE": "https://api.sociona.app/api/v1"
      }
    }
  }
}
```

### 4. Restart Claude Desktop
Restart Claude Desktop to load the new MCP server configuration.

## Usage
Once configured, you can use natural language commands in Claude:

```
"Post to Twitter: Just launched our new feature! 🚀 #TechNews"

"Schedule a post for Instagram tomorrow at 10 AM about our weekly roundup"

"Show me my connected social accounts"

"Get my last 10 posts"

"Cancel the scheduled post with ID sched-123"

"What's my posting statistics?"
```

## Troubleshooting

### Common Issues:
1. **"SOCIONA_API_KEY environment variable is required"**
   - Ensure your API key is set in the Claude Desktop config

2. **"No X account connected"**
   - Connect your social media accounts in Sociona first

3. **Rate limit exceeded**
   - Check your API key's rate limits in the developer portal

4. **MCP server not loading**
   - Verify the path to `dist/index.js` is absolute and correct
   - Check Claude Desktop logs for errors

### Logs
The MCP server logs to stderr. Check Claude Desktop's logs for debugging information.

## Development
For local development:
1. Make changes to `src/index.ts`
2. Run `pnpm build` to compile TypeScript
3. Update your Claude Desktop config to point to the rebuilt `dist/index.js`
4. Test the changes through Claude Desktop
