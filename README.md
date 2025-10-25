# Sociona MCP Server

An MCP (Model Context Protocol) server that provides AI assistants and MCP-compatible tools with access to the Sociona social media API.

## Features

- **Publish Posts**: Immediately publish content to social media platforms
- **Schedule Posts**: Schedule posts for future publication
- **Cancel Scheduled Posts**: Cancel posts before they publish
- **List Accounts**: View connected social media accounts
- **Get Posts**: Retrieve recent post history
- **Get Scheduled Posts**: View upcoming scheduled posts
- **Get Post Statistics**: View aggregate posting statistics

## Supported Platforms

- X (Twitter)
- Instagram
- Threads

## Quick Start

### 1. Install
```bash
# Install globally (recommended)
npm install -g sociona-mcp-server

# Or run the installation script
curl -sSL https://raw.githubusercontent.com/your-repo/sociona-mcp-server/main/install.sh | bash
```

### 2. Configure Your MCP Client

#### For Claude Desktop
Add to your Claude Desktop configuration file:

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

### 4. Get Your API Key

1. Sign up at [Sociona Developer Portal](https://sociona.app/developer)
2. Create a new application
3. Generate an API key with required scopes

### 5. Restart Claude Desktop

Restart Claude Desktop to load the new MCP server configuration.

## Usage

Once configured, you can use natural language commands with your MCP client:

```
"Post to Twitter: Just launched our new feature! 🚀 #TechNews"

"Schedule a post for Instagram tomorrow at 10 AM about our weekly roundup"

"Show me my connected social accounts"

"Get my last 10 posts"

"Cancel the scheduled post with ID sched-123"

"What's my posting statistics?"
```

## API Reference

This MCP server wraps the [Sociona Developer API](https://docs.sociona.app). See the API documentation for detailed endpoint information.

## Troubleshooting

### Common Issues

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
2. Run `npm run build` to compile TypeScript
3. Update your Claude Desktop config to point to the rebuilt `dist/index.js`
4. Test the changes through Claude Desktop

**Note:** The MCP server cannot be run standalone - it must be invoked by an MCP client like Claude Desktop.

## License

MIT