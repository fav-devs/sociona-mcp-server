#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the path to the main index.js file
const indexPath = join(__dirname, 'index.js');

// Spawn the MCP server
const child = spawn('node', [indexPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Ensure environment variables are passed through
    SOCIONA_API_KEY: process.env.SOCIONA_API_KEY,
    SOCIONA_API_BASE: process.env.SOCIONA_API_BASE || 'https://api.sociona.app/api/v1',
  }
});

// Handle process termination
process.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit(0);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
