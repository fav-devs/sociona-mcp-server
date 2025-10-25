# Releases & Packages

This document explains how releases and packages are managed for the Sociona MCP Server.

## 📦 Package Distribution

The Sociona MCP Server is distributed through multiple channels:

### 1. NPM Registry (Primary)
- **URL**: https://www.npmjs.com/package/sociona-mcp-server
- **Installation**: `npm install -g sociona-mcp-server`
- **Registry**: Public NPM registry
- **Access**: Public

### 2. GitHub Packages (Secondary)
- **URL**: https://github.com/fav-devs/sociona-mcp-server/packages
- **Installation**: `npm install @fav-devs/sociona-mcp-server`
- **Registry**: GitHub Packages
- **Access**: Public

### 3. GitHub Releases
- **URL**: https://github.com/fav-devs/sociona-mcp-server/releases
- **Download**: Source code and pre-built assets
- **Access**: Public

## 🚀 Release Process

### Automated Release Workflow

The project uses automated workflows for releases:

1. **Version Bump**: Update version in `package.json`
2. **Build**: Compile TypeScript to JavaScript
3. **Test**: Run test suite
4. **Publish**: Deploy to NPM and GitHub Packages
5. **Release**: Create GitHub release with notes

### Manual Release Commands

```bash
# Patch release (1.0.1 -> 1.0.2)
npm run release:patch

# Minor release (1.0.1 -> 1.1.0)
npm run release:minor

# Major release (1.0.1 -> 2.0.0)
npm run release:major

# Interactive release (prompts for type)
npm run release
```

### Release Script Features

The `scripts/release.js` script automatically:

- ✅ Updates version in `package.json`
- ✅ Builds the project
- ✅ Runs tests
- ✅ Creates git tag
- ✅ Pushes to GitHub
- ✅ Publishes to NPM
- ✅ Creates GitHub release
- ✅ Generates release notes

## 📋 Release Checklist

Before creating a release, ensure:

- [ ] All tests pass
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated
- [ ] Version is appropriate (patch/minor/major)
- [ ] Breaking changes are documented
- [ ] Migration guide is provided (if needed)

## 🏷️ Versioning Strategy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (2.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backward compatible
- **PATCH** (1.0.1): Bug fixes, backward compatible

### Version Examples

- `1.0.0` - Initial release
- `1.0.1` - Bug fix
- `1.1.0` - New feature
- `2.0.0` - Breaking change

## 📊 Release History

### v1.0.1 (Current)
- Initial public release
- Complete MCP server implementation
- CLI tool support
- Multi-platform support (X, Instagram, Threads)
- Comprehensive documentation

### v1.0.0 (Initial)
- Internal development version
- Basic MCP server functionality

## 🔧 Development Releases

For development and testing:

```bash
# Install from GitHub
npm install fav-devs/sociona-mcp-server

# Install specific version
npm install sociona-mcp-server@1.0.1

# Install from GitHub Packages
npm install @fav-devs/sociona-mcp-server
```

## 📈 Package Statistics

Track package usage and downloads:

- **NPM**: https://www.npmjs.com/package/sociona-mcp-server
- **GitHub**: https://github.com/fav-devs/sociona-mcp-server/network
- **Analytics**: Available in NPM and GitHub insights

## 🛠️ Troubleshooting

### Common Issues

1. **Publish Permission Denied**
   - Ensure you're logged into NPM: `npm login`
   - Check package ownership

2. **GitHub Release Failed**
   - Verify GitHub CLI is installed: `gh --version`
   - Check authentication: `gh auth status`

3. **Version Already Exists**
   - Check if version already published
   - Use different version number

### Getting Help

- [GitHub Issues](https://github.com/fav-devs/sociona-mcp-server/issues)
- [NPM Support](https://www.npmjs.com/support)
- [GitHub Packages Docs](https://docs.github.com/en/packages)

## 📝 Release Notes Template

```markdown
## 🎉 Sociona MCP Server vX.X.X

### ✨ What's New
- Feature 1
- Feature 2
- Feature 3

### 🐛 Bug Fixes
- Fix 1
- Fix 2

### 🔧 Improvements
- Improvement 1
- Improvement 2

### 📚 Documentation
- Updated installation guide
- Added usage examples

### 🔗 Links
- [NPM Package](https://www.npmjs.com/package/sociona-mcp-server)
- [GitHub Release](https://github.com/fav-devs/sociona-mcp-server/releases/tag/vX.X.X)
```

---

For more information, see the [main README](README.md) or [developer installation guide](DEVELOPER_INSTALLATION.md).
