import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const SOCIONA_API_KEY = process.env.SOCIONA_API_KEY;
const API_BASE = process.env.SOCIONA_API_BASE || 'https://api.sociona.com/api/v1';

if (!SOCIONA_API_KEY) {
  console.error('SOCIONA_API_KEY environment variable is required');
  process.exit(1);
}

class SocionaMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server({
      name: 'sociona-mcp-server',
      version: '1.0.0',
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'publish_post',
          description: 'Publish a social media post immediately',
          inputSchema: {
            type: 'object',
            properties: {
              platform: {
                type: 'string',
                enum: ['X', 'INSTAGRAM', 'THREADS'],
                description: 'Social media platform',
              },
              content: {
                type: 'string',
                description: 'Post content/text',
              },
              mediaUrls: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional media URLs to attach',
              },
            },
            required: ['platform', 'content'],
          },
        },
        {
          name: 'schedule_post',
          description: 'Schedule a post for future publication',
          inputSchema: {
            type: 'object',
            properties: {
              platform: {
                type: 'string',
                enum: ['X', 'INSTAGRAM', 'THREADS'],
              },
              content: {
                type: 'string',
                description: 'Post content',
              },
              scheduledFor: {
                type: 'string',
                description: 'ISO 8601 datetime (e.g., 2025-10-14T10:00:00Z)',
              },
              mediaUrls: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional media URLs to attach',
              },
            },
            required: ['platform', 'content', 'scheduledFor'],
          },
        },
        {
          name: 'get_accounts',
          description: 'Get list of connected social media accounts',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_posts',
          description: 'Get recent posts published via the API',
          inputSchema: {
            type: 'object',
            properties: {
              limit: {
                type: 'number',
                description: 'Number of posts to retrieve (max 100)',
                default: 50,
                minimum: 1,
                maximum: 100,
              },
            },
          },
        },
        {
          name: 'cancel_scheduled_post',
          description: 'Cancel a scheduled post before it publishes',
          inputSchema: {
            type: 'object',
            properties: {
              postId: {
                type: 'string',
                description: 'The ID of the scheduled post to cancel',
              },
            },
            required: ['postId'],
          },
        },
        {
          name: 'get_post_stats',
          description: 'Get statistics about your posts',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'publish_post':
            return await this.publishPost(args);
          case 'schedule_post':
            return await this.schedulePost(args);
          case 'get_accounts':
            return await this.getAccounts();
          case 'get_posts':
            return await this.getPosts(args);
          case 'get_scheduled_posts':
            return await this.getScheduledPosts(args);
          case 'cancel_scheduled_post':
            return await this.cancelScheduledPost(args);
          case 'get_post_stats':
            return await this.getPostStats();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async apiRequest(method: string, endpoint: string, body?: any) {
    const url = `${API_BASE}${endpoint}`;
    console.error(`Making ${method} request to ${url}`);

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${SOCIONA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  private async getAccounts() {
    const { accounts } = await this.apiRequest('GET', '/accounts');

    if (!accounts || accounts.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No social media accounts connected.',
          },
        ],
      };
    }

    const accountList = accounts
      .map((a: any) => `- ${a.provider}: ${a.handle} (${a.status})`)
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Connected accounts:\n${accountList}`,
        },
      ],
    };
  }

  private async publishPost(args: any) {
    const { accounts } = await this.apiRequest('GET', '/accounts');
    const account = accounts.find((a: any) => a.provider === args.platform);

    if (!account) {
      throw new Error(`No ${args.platform} account connected. Available accounts: ${accounts.map((a: any) => a.provider).join(', ')}`);
    }

    const result = await this.apiRequest('POST', '/posts', {
      accountId: account.id,
      platform: args.platform,
      content: args.content,
      mediaUrls: args.mediaUrls || [],
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Post published to ${args.platform}!\nStatus: ${result.post.status}\nPost ID: ${result.post.id}`,
        },
      ],
    };
  }

  private async schedulePost(args: any) {
    const { accounts } = await this.apiRequest('GET', '/accounts');
    const account = accounts.find((a: any) => a.provider === args.platform);

    if (!account) {
      throw new Error(`No ${args.platform} account connected. Available accounts: ${accounts.map((a: any) => a.provider).join(', ')}`);
    }

    const result = await this.apiRequest('POST', '/schedule', {
      accountId: account.id,
      platform: args.platform,
      content: args.content,
      scheduledFor: args.scheduledFor,
      mediaUrls: args.mediaUrls || [],
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Post scheduled for ${args.scheduledFor} on ${args.platform}!\nScheduled Post ID: ${result.scheduledPost.id}`,
        },
      ],
    };
  }

  private async getPosts(args: any) {
    const limit = args.limit || 50;
    const { posts } = await this.apiRequest('GET', `/posts?limit=${limit}`);

    if (!posts || posts.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No posts found.',
          },
        ],
      };
    }

    const postList = posts
      .map((p: any) => `- ${p.provider}: ${p.status} (${p.startedAt}) ${p.url ? `URL: ${p.url}` : ''}`)
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Recent posts (last ${posts.length}):\n${postList}`,
        },
      ],
    };
  }

  private async getPostStats() {
    const { stats } = await this.apiRequest('GET', '/posts/stats');

    return {
      content: [
        {
          type: 'text',
          text: `Post Statistics:\n- Total: ${stats.total}\n- Published: ${stats.published}\n- Failed: ${stats.failed}\n- Scheduled: ${stats.scheduled}`,
        },
      ],
    };
  }

  private async cancelScheduledPost(args: any) {
    const result = await this.apiRequest('DELETE', `/schedule/${args.postId}`);

    if (result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `✅ Scheduled post ${args.postId} has been canceled.`,
          },
        ],
      };
    } else {
      throw new Error(result.message || 'Failed to cancel scheduled post');
    }
  }

  private async getScheduledPosts(args: any) {
    const query = args.status ? `?status=${args.status}` : '';
    const { scheduledPosts } = await this.apiRequest('GET', `/schedule${query}`);

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No scheduled posts found.',
          },
        ],
      };
    }

    const postList = scheduledPosts
      .map((p: any) => `- ${p.provider}: ${p.status} - Scheduled for ${p.scheduledFor}\n  Content: ${p.text}`)
      .join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Scheduled posts:\n${postList}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Sociona MCP server running on stdio');
  }
}

const server = new SocionaMCPServer();
server.run().catch(console.error);