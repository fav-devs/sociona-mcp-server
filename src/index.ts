import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { z } from 'zod';

const SOCIONA_API_KEY = process.env.SOCIONA_API_KEY;
const API_BASE = process.env.SOCIONA_API_BASE || 'https://api.sociona.app/api/v1';

if (!SOCIONA_API_KEY) {
  console.error('SOCIONA_API_KEY environment variable is required');
  process.exit(1);
}

async function apiRequest(method: string, endpoint: string, body?: unknown) {
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
      const errorData = (await response.json()) as { message?: string };
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<any>;
}

const text = (message: string) => ({
  content: [{ type: 'text' as const, text: message }],
});

async function findAccount(platform: string) {
  const { accounts } = await apiRequest('GET', '/accounts');
  const account = accounts?.find((a: any) => a.provider === platform);
  if (!account) {
    throw new Error(
      `No ${platform} account connected. Available accounts: ${(accounts ?? [])
        .map((a: any) => a.provider)
        .join(', ')}`,
    );
  }
  return account;
}

function buildServer(): McpServer {
  const server = new McpServer({
    name: 'sociona-mcp-server',
    version: '2.0.0',
  });

  server.registerTool(
    'publish_post',
    {
      description: 'Publish a social media post immediately',
      inputSchema: z.object({
        platform: z.enum(['X', 'INSTAGRAM', 'THREADS']).describe('Social media platform'),
        content: z.string().describe('Post content/text'),
        mediaUrls: z.array(z.string()).optional().describe('Optional media URLs to attach'),
      }),
    },
    async ({ platform, content, mediaUrls }) => {
      const account = await findAccount(platform);
      const result = await apiRequest('POST', '/posts', {
        accountId: account.id,
        platform,
        content,
        mediaUrls: mediaUrls || [],
      });
      return text(
        `✅ Post published to ${platform}!\nStatus: ${result.post.status}\nPost ID: ${result.post.id}`,
      );
    },
  );

  server.registerTool(
    'schedule_post',
    {
      description: 'Schedule a post for future publication',
      inputSchema: z.object({
        platform: z.enum(['X', 'INSTAGRAM', 'THREADS']).describe('Social media platform'),
        content: z.string().describe('Post content'),
        scheduledFor: z.string().describe('ISO 8601 datetime (e.g., 2026-10-14T10:00:00Z)'),
        mediaUrls: z.array(z.string()).optional().describe('Optional media URLs to attach'),
      }),
    },
    async ({ platform, content, scheduledFor, mediaUrls }) => {
      const account = await findAccount(platform);
      const result = await apiRequest('POST', '/schedule', {
        accountId: account.id,
        platform,
        content,
        scheduledFor,
        mediaUrls: mediaUrls || [],
      });
      return text(
        `✅ Post scheduled for ${scheduledFor} on ${platform}!\nScheduled Post ID: ${result.scheduledPost.id}`,
      );
    },
  );

  server.registerTool(
    'get_accounts',
    {
      description: 'Get list of connected social media accounts',
      inputSchema: z.object({}),
    },
    async () => {
      const { accounts } = await apiRequest('GET', '/accounts');
      if (!accounts || accounts.length === 0) {
        return text('No social media accounts connected.');
      }
      const accountList = accounts
        .map((a: any) => `- ${a.provider}: ${a.handle} (${a.status})`)
        .join('\n');
      return text(`Connected accounts:\n${accountList}`);
    },
  );

  server.registerTool(
    'get_posts',
    {
      description: 'Get recent posts published via the API',
      inputSchema: z.object({
        limit: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .describe('Number of posts to retrieve (max 100, default 50)'),
      }),
    },
    async ({ limit }) => {
      const { posts } = await apiRequest('GET', `/posts?limit=${limit ?? 50}`);
      if (!posts || posts.length === 0) {
        return text('No posts found.');
      }
      const postList = posts
        .map(
          (p: any) =>
            `- ${p.provider}: ${p.status} (${p.publishedAt || p.startedAt || p.scheduledFor}) ${p.providerUrl ? `URL: ${p.providerUrl}` : ''}${p.text ? `\n  ${String(p.text).slice(0, 120)}` : ''}`,
        )
        .join('\n');
      return text(`Recent posts (last ${posts.length}):\n${postList}`);
    },
  );

  server.registerTool(
    'get_scheduled_posts',
    {
      description: 'Get scheduled posts, optionally filtered by status',
      inputSchema: z.object({
        status: z
          .enum(['QUEUED', 'PROCESSING', 'PUBLISHED', 'FAILED', 'CANCELED'])
          .optional()
          .describe('Optional status filter'),
      }),
    },
    async ({ status }) => {
      const query = status ? `?status=${status}` : '';
      const { scheduledPosts } = await apiRequest('GET', `/schedule${query}`);
      if (!scheduledPosts || scheduledPosts.length === 0) {
        return text('No scheduled posts found.');
      }
      const postList = scheduledPosts
        .map(
          (p: any) =>
            `- ${p.provider}: ${p.status} - Scheduled for ${p.scheduledFor}\n  Content: ${p.text}`,
        )
        .join('\n\n');
      return text(`Scheduled posts:\n${postList}`);
    },
  );

  server.registerTool(
    'cancel_scheduled_post',
    {
      description: 'Cancel a scheduled post before it publishes',
      inputSchema: z.object({
        postId: z.string().describe('The ID of the scheduled post to cancel'),
      }),
    },
    async ({ postId }) => {
      const result = await apiRequest('DELETE', `/schedule/${postId}`);
      if (result.success) {
        return text(`✅ Scheduled post ${postId} has been canceled.`);
      }
      throw new Error(result.message || 'Failed to cancel scheduled post');
    },
  );

  server.registerTool(
    'get_post_stats',
    {
      description: 'Get statistics about your posts',
      inputSchema: z.object({}),
    },
    async () => {
      const { stats } = await apiRequest('GET', '/posts/stats');
      return text(
        `Post Statistics:\n- Total: ${stats.total}\n- Published: ${stats.published}\n- Failed: ${stats.failed}\n- Scheduled: ${stats.scheduled}`,
      );
    },
  );

  return server;
}

// serveStdio owns the era decision per connection: a 2026-07-28 client is
// served the stateless modern protocol; a legacy client opening with the
// 2025-era initialize handshake is pinned to a legacy-era instance (the
// default `legacy: 'serve'`), so existing Claude Desktop/Code installs keep
// working unchanged.
serveStdio(buildServer, {
  onerror: (error) => console.error('Sociona MCP server error:', error),
});
console.error('Sociona MCP server running on stdio');
