#!/bin/bash

# Sociona MCP Server Railway Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "🚂 Sociona MCP Server Railway Deployment"
    echo "========================================"
    echo -e "${NC}"
}

# Check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed"
        print_info "Install it with: npm install -g @railway/cli"
        exit 1
    fi
    print_success "Railway CLI is installed"
}

# Check if user is logged in to Railway
check_railway_auth() {
    if ! railway whoami &> /dev/null; then
        print_error "Not logged in to Railway"
        print_info "Login with: railway login"
        exit 1
    fi
    print_success "Logged in to Railway as $(railway whoami)"
}

# Create Railway project
setup_railway_project() {
    print_info "Setting up Railway project..."

    if [ ! -f ".railway/project.json" ]; then
        print_info "Creating new Railway project..."
        railway init --name "sociona-mcp-server"
        print_success "Created new Railway project: sociona-mcp-server"
    else
        print_success "Using existing Railway project"
    fi
}

# Set environment variables
set_environment_variables() {
    print_info "Setting environment variables..."

    # Core variables
    railway variables --set "NODE_ENV=production"

    # Sociona API configuration
    if [ -z "$SOCIONA_API_KEY" ]; then
        print_warning "SOCIONA_API_KEY not provided"
        echo "Please set your Sociona API key:"
        echo "railway variables --set 'SOCIONA_API_KEY=sk_live_your_key_here'"
        echo ""
        read -p "Do you want to continue without setting the API key now? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        railway variables --set "SOCIONA_API_KEY=$SOCIONA_API_KEY"
        print_success "Sociona API key set"
    fi

    # Optional: Custom API base URL
    if [ -n "$SOCIONA_API_BASE" ]; then
        railway variables --set "SOCIONA_API_BASE=$SOCIONA_API_BASE"
        print_success "Custom API base URL set"
    fi

    print_success "Environment variables configured"
}

# Deploy to Railway
deploy_to_railway() {
    print_info "Deploying to Railway..."

    # Deploy using the MCP server railway.json config
    railway up --detach

    print_success "Deployment initiated!"
}

# Show deployment info
show_deployment_info() {
    print_header
    print_success "Sociona MCP Server deployment completed!"

    # Get service info
    RAILWAY_DOMAIN=$(railway domain 2>/dev/null || echo "your-mcp-server.railway.app")

    echo ""
    print_info "🌐 Service Information:"
    echo "   Railway Domain: https://$RAILWAY_DOMAIN"
    echo "   Status: Running (stdio-based MCP server)"

    echo ""
    print_info "📊 Railway Dashboard:"
    echo "   https://railway.app/dashboard"

    echo ""
    print_info "🔧 Claude Desktop Configuration:"
    echo "Add this to your Claude Desktop config (~/.continue/config.json):"
    echo ""
    echo '```json'
    echo '{'
    echo '  "mcpServers": {'
    echo '    "sociona": {'
    echo '      "command": "node",'
    echo '      "args": ["/app/dist/index.js"],'
    echo '      "env": {'
    echo '        "SOCIONA_API_KEY": "sk_live_your_key_here",'
    echo '        "SOCIONA_API_BASE": "https://api.sociona.com/api/v1"'
    echo '      }'
    echo '    }'
    echo '  }'
    echo '}'
    echo '```'

    echo ""
    print_warning "⚠️  Important Notes:"
    echo "   - MCP servers communicate via stdio, not HTTP"
    echo "   - The Railway service keeps the MCP server process running"
    echo "   - Claude Desktop connects to the MCP server locally"
    echo "   - Make sure to set SOCIONA_API_KEY in Railway variables"
}

# Main deployment flow
main() {
    print_header

    print_info "Starting Sociona MCP Server Railway deployment..."

    # Pre-flight checks
    check_railway_cli
    check_railway_auth

    # Setup project
    setup_railway_project
    set_environment_variables

    # Deploy
    deploy_to_railway

    # Show results
    show_deployment_info
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --api-key=*)
            SOCIONA_API_KEY="${1#*=}"
            shift
            ;;
        --api-base=*)
            SOCIONA_API_BASE="${1#*=}"
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Usage: $0 [--api-key=SK_LIVE_...] [--api-base=https://...]"
            exit 1
            ;;
    esac
done

# Run main function
main "$@"