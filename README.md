# Sociona MCP Server

[![npm version](https://badge.fury.io/js/sociona-mcp-server.svg)](https://badge.fury.io/js/sociona-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/fav-devs/sociona-mcp-server.svg)](https://github.com/fav-devs/sociona-mcp-server/releases)

An MCP (Model Context Protocol) server that provides AI assistants and MCP-compatible tools with access to the Sociona social media API. Speaks the stateless MCP 2026-07-28 protocol and still serves clients using the older initialize handshake.

> **Prefer the remote server?** Sociona also hosts MCP at `https://api.sociona.app/api/v1/mcp` (OAuth sign-in or the same API key as Bearer) with the full ~50-tool surface — agents, Studio carousels, discovery, analytics, engagement. This stdio package covers the publishing core and is handy for fully local setups.

<a href="https://glama.ai/mcp/servers/@fav-devs/sociona-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@fav-devs/sociona-mcp-server/badge" alt="Sociona Server MCP server" />
</a>

## Claude skill

The repo ships a Claude skill that teaches agents the Sociona workflows
(carousel pipeline, research-to-schedule, async jobs, engagement safety).
Install it next to the MCP server:

```bash
# project-level (recommended)
mkdir -p .claude/skills && cp -r node_modules/sociona-mcp-server/skills/sociona .claude/skills/

# or user-level
mkdir -p ~/.claude/skills && cp -r node_modules/sociona-mcp-server/skills/sociona ~/.claude/skills/
```

Cloned the repo instead? Copy from `skills/sociona` directly.

## 🚀 Features

- **Publish Posts**: Immediately publish content to social media platforms
- **Schedule Posts**: Schedule posts for future publication
- **Cancel Scheduled Posts**: Cancel posts before they publish
- **List Accounts**: View connected social media accounts
- **Post History**: Retrieve recent post history with filtering
- **Analytics**: Get statistics about your posts
- **Multi-Platform Support**: X (Twitter), Instagram, and Threads

## 📦 Installation

### Quick Install
```bash
npm install -g sociona-mcp-server
```

### Alternative Installation
```bash
# Using the installation script
curl -sSL https://raw.githubusercontent.com/fav-devs/sociona-mcp-server/main/install.sh | bash
```

## ⚙️ Configuration

### 1. Get Your API Key
1. Sign in to [Sociona](https://app.sociona.app) → Settings → Developer (or the Developer dashboard)
2. Generate an API key — omit scopes to get the full catalog, or restrict to:
   - `account:read` / `account:write`
   - `posts:read` / `posts:write` (publishing AND scheduling)
   - `ideas:read` / `ideas:write`
   - `insights:read`
   - `engagements:read` / `engagements:write`

### 2. Configure Your MCP Client

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

### 3. Restart Your MCP Client
Restart your MCP client to load the new MCP server configuration.

## 💬 Usage

Once configured, you can use natural language commands with your MCP client:

```
"Post to Twitter: Just launched our new feature! 🚀 #TechNews"

"Schedule a post for Instagram tomorrow at 10 AM about our weekly roundup"

"Show me my connected social accounts"

"Get my last 10 posts from X"

"Cancel the scheduled post with ID sched-123"

"What's my posting statistics?"
```

## 🛠️ Available Tools

The Sociona MCP Server exposes the following tools:

- **`publish_post`**: Publish a social media post immediately
- **`schedule_post`**: Schedule a social media post for future publication
- **`get_accounts`**: List all connected social media accounts
- **`get_posts`**: Retrieve recent post history
- **`get_scheduled_posts`**: View scheduled posts (optional status filter)
- **`cancel_scheduled_post`**: Cancel a scheduled post before it publishes
- **`get_post_stats`**: Get statistics about your posts

The hosted remote server (`/api/v1/mcp`) additionally exposes the agents,
Studio, discovery, ideas, analytics, engagement, media, workflow, and
webhook tools — see the [Sociona docs](https://docs.sociona.app) for the
full list.

## 🔧 Development

### Prerequisites
- Node.js 18 or higher
- npm or pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/fav-devs/sociona-mcp-server.git
cd sociona-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Scripts
- `npm run build` - Build the TypeScript code
- `npm run dev` - Run in development mode
- `npm start` - Start the MCP server
- `npm test` - Run tests

## 📚 Documentation

- [Developer Installation Guide](DEVELOPER_INSTALLATION.md) - Detailed setup instructions
- [Local Setup Guide](LOCAL_SETUP.md) - For local development
- [Architecture Overview](ARCHITECTURE.md) - Technical architecture details
- [Railway Deployment](RAILWAY_DEPLOYMENT.md) - Cloud deployment guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/sociona-mcp-server)
- [Sociona API Documentation](https://docs.sociona.app)
- [Model Context Protocol](https://modelcontextprotocol.io)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/fav-devs/sociona-mcp-server/issues) page
2. Create a new issue if your problem isn't already reported
3. Join our community discussions

---

Made with ❤️ by the Sociona team