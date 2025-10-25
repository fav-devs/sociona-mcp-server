#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const versionType = process.argv[2] || 'patch'; // patch, minor, major

if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('❌ Invalid version type. Use: patch, minor, or major');
  process.exit(1);
}

console.log(`🚀 Creating ${versionType} release...`);

try {
  // 1. Update version in package.json
  console.log('📦 Updating version...');
  execSync(`npm version ${versionType}`, { stdio: 'inherit' });
  
  // 2. Build the project
  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 3. Run tests
  console.log('🧪 Running tests...');
  execSync('npm test', { stdio: 'inherit' });
  
  // 4. Get the new version
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const newVersion = packageJson.version;
  
  // 5. Create git tag
  console.log(`🏷️  Creating git tag v${newVersion}...`);
  execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
  
  // 6. Push changes and tags
  console.log('📤 Pushing changes and tags...');
  execSync('git push', { stdio: 'inherit' });
  execSync('git push --tags', { stdio: 'inherit' });
  
  // 7. Publish to NPM (using GitHub Actions)
  console.log('📦 Publishing to NPM via GitHub Actions...');
  console.log('   Note: Publishing will be handled by the automated workflow');
  
  // 8. Create GitHub release
  console.log('🎉 Creating GitHub release...');
  const releaseNotes = generateReleaseNotes(newVersion, versionType);
  execSync(`gh release create v${newVersion} --title "Sociona MCP Server v${newVersion}" --notes "${releaseNotes}"`, { stdio: 'inherit' });
  
  console.log(`✅ Successfully released v${newVersion}!`);
  console.log(`📦 NPM: https://www.npmjs.com/package/sociona-mcp-server`);
  console.log(`🐙 GitHub: https://github.com/fav-devs/sociona-mcp-server/releases/tag/v${newVersion}`);
  
} catch (error) {
  console.error('❌ Release failed:', error.message);
  process.exit(1);
}

function generateReleaseNotes(version, type) {
  const features = [
    'Complete MCP server implementation for Sociona social media API',
    'Support for X (Twitter), Instagram, and Threads',
    'CLI tool for easy execution (`sociona-mcp`)',
    'Comprehensive documentation and installation guides'
  ];
  
  const changes = {
    major: '🚀 Major release with breaking changes and new features',
    minor: '✨ New features and improvements',
    patch: '🐛 Bug fixes and minor improvements'
  };
  
  return `## ${changes[type]}

### Features
${features.map(f => `- ${f}`).join('\n')}

### Installation
\`\`\`bash
npm install -g sociona-mcp-server
\`\`\`

### What's New
- ✅ Publish posts immediately
- ✅ Schedule posts for future publication  
- ✅ Cancel scheduled posts
- ✅ List connected social accounts
- ✅ Retrieve post history and analytics
- ✅ Multi-platform support (X, Instagram, Threads)
- ✅ CLI tool for easy execution
- ✅ Comprehensive documentation

### Documentation
- [Installation Guide](https://github.com/fav-devs/sociona-mcp-server#installation)
- [Usage Examples](https://github.com/fav-devs/sociona-mcp-server#usage)
- [Developer Setup](https://github.com/fav-devs/sociona-mcp-server/blob/main/DEVELOPER_INSTALLATION.md)

### Links
- [NPM Package](https://www.npmjs.com/package/sociona-mcp-server)
- [GitHub Repository](https://github.com/fav-devs/sociona-mcp-server)`;
}
