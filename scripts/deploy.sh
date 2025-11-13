#!/bin/bash

# Master deployment script for DragNDrop HTML Editor
# Usage: ./scripts/deploy.sh [platform] [type]
# Platforms: vercel, netlify, github-pages, all
# Types: production, preview (default: preview)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art Banner
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗ ██████╗  █████╗  ██████╗ ███╗   ██╗██████╗ ██████╗  ║
║   ██╔══██╗██╔══██╗██╔══██╗██╔════╝ ████╗  ██║██╔══██╗██╔══██╗ ║
║   ██║  ██║██████╔╝███████║██║  ███╗██╔██╗ ██║██║  ██║██████╔╝ ║
║   ██║  ██║██╔══██╗██╔══██║██║   ██║██║╚██╗██║██║  ██║██╔══██╗ ║
║   ██████╔╝██║  ██║██║  ██║╚██████╔╝██║ ╚████║██████╔╝██║  ██║ ║
║   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝ ║
║                                                               ║
║                    HTML Editor Deployment                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Function to show usage
show_usage() {
    echo -e "${YELLOW}Usage: $0 [platform] [type]${NC}"
    echo -e "${BLUE}Platforms:${NC}"
    echo -e "  ${GREEN}vercel${NC}       - Deploy to Vercel"
    echo -e "  ${GREEN}netlify${NC}      - Deploy to Netlify"
    echo -e "  ${GREEN}github-pages${NC} - Deploy to GitHub Pages"
    echo -e "  ${GREEN}all${NC}          - Deploy to all platforms"
    echo -e "${BLUE}Types:${NC}"
    echo -e "  ${GREEN}production${NC}   - Production deployment"
    echo -e "  ${GREEN}preview${NC}      - Preview deployment (default)"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 vercel production"
    echo -e "  $0 netlify preview"
    echo -e "  $0 github-pages"
    echo -e "  $0 all production"
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found. Make sure you're in the project root directory.${NC}"
        exit 1
    fi
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed.${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        echo -e "${RED}❌ Node.js version 16 or higher is required. Current version: $(node --version)${NC}"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Function to run pre-deployment checks
pre_deployment_checks() {
    echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies...${NC}"
        npm ci
    fi
    
    # Run linting
    echo -e "${YELLOW}🔍 Running linter...${NC}"
    npm run lint || {
        echo -e "${RED}❌ Linting failed. Please fix the issues before deploying.${NC}"
        exit 1
    }
    
    # Run tests
    echo -e "${YELLOW}🧪 Running tests...${NC}"
    npm run test || {
        echo -e "${RED}❌ Tests failed. Please fix the issues before deploying.${NC}"
        exit 1
    }
    
    # Check build
    echo -e "${YELLOW}🔨 Testing build...${NC}"
    npm run build || {
        echo -e "${RED}❌ Build failed. Please fix the issues before deploying.${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
}

# Function to deploy to Vercel
deploy_vercel() {
    local deployment_type=$1
    echo -e "${PURPLE}🚀 Deploying to Vercel...${NC}"
    
    if [ -f "scripts/deploy-vercel.sh" ]; then
        chmod +x scripts/deploy-vercel.sh
        ./scripts/deploy-vercel.sh "$deployment_type"
    else
        echo -e "${RED}❌ Vercel deployment script not found.${NC}"
        return 1
    fi
}

# Function to deploy to Netlify
deploy_netlify() {
    local deployment_type=$1
    echo -e "${PURPLE}🚀 Deploying to Netlify...${NC}"
    
    if [ -f "scripts/deploy-netlify.sh" ]; then
        chmod +x scripts/deploy-netlify.sh
        ./scripts/deploy-netlify.sh "$deployment_type"
    else
        echo -e "${RED}❌ Netlify deployment script not found.${NC}"
        return 1
    fi
}

# Function to deploy to GitHub Pages
deploy_github_pages() {
    echo -e "${PURPLE}🚀 Deploying to GitHub Pages...${NC}"
    
    if [ -f "scripts/deploy-github-pages.sh" ]; then
        chmod +x scripts/deploy-github-pages.sh
        ./scripts/deploy-github-pages.sh
    else
        echo -e "${RED}❌ GitHub Pages deployment script not found.${NC}"
        return 1
    fi
}

# Function to deploy to all platforms
deploy_all() {
    local deployment_type=$1
    echo -e "${PURPLE}🚀 Deploying to all platforms...${NC}"
    
    local failed_deployments=()
    
    # Deploy to Vercel
    if ! deploy_vercel "$deployment_type"; then
        failed_deployments+=("Vercel")
    fi
    
    # Deploy to Netlify
    if ! deploy_netlify "$deployment_type"; then
        failed_deployments+=("Netlify")
    fi
    
    # Deploy to GitHub Pages (only for production)
    if [ "$deployment_type" = "production" ]; then
        if ! deploy_github_pages; then
            failed_deployments+=("GitHub Pages")
        fi
    else
        echo -e "${YELLOW}⚠️ Skipping GitHub Pages (only available for production deployments)${NC}"
    fi
    
    # Report results
    if [ ${#failed_deployments[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ All deployments completed successfully!${NC}"
    else
        echo -e "${RED}❌ Some deployments failed:${NC}"
        for platform in "${failed_deployments[@]}"; do
            echo -e "${RED}  - $platform${NC}"
        done
        exit 1
    fi
}

# Function to show deployment summary
show_summary() {
    local platform=$1
    local deployment_type=$2
    
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════"
    echo "                    DEPLOYMENT SUMMARY"
    echo "═══════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo -e "${BLUE}Platform:${NC} $platform"
    echo -e "${BLUE}Type:${NC} $deployment_type"
    echo -e "${BLUE}Time:${NC} $(date)"
    echo -e "${BLUE}Version:${NC} $(npm pkg get version | tr -d '\"')"
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "1. Check the deployment URL(s) above"
    echo -e "2. Test the deployed application"
    echo -e "3. Monitor for any issues"
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
}

# Main script logic
main() {
    local platform=${1:-}
    local deployment_type=${2:-preview}
    
    # Show usage if no platform specified
    if [ -z "$platform" ]; then
        show_usage
        exit 1
    fi
    
    # Validate deployment type
    if [ "$deployment_type" != "production" ] && [ "$deployment_type" != "preview" ]; then
        echo -e "${RED}❌ Invalid deployment type: $deployment_type${NC}"
        show_usage
        exit 1
    fi
    
    # Check prerequisites
    check_prerequisites
    
    # Run pre-deployment checks
    pre_deployment_checks
    
    # Deploy based on platform
    case $platform in
        vercel)
            deploy_vercel "$deployment_type"
            ;;
        netlify)
            deploy_netlify "$deployment_type"
            ;;
        github-pages)
            if [ "$deployment_type" = "preview" ]; then
                echo -e "${YELLOW}⚠️ GitHub Pages only supports production deployments. Switching to production...${NC}"
                deployment_type="production"
            fi
            deploy_github_pages
            ;;
        all)
            deploy_all "$deployment_type"
            ;;
        *)
            echo -e "${RED}❌ Invalid platform: $platform${NC}"
            show_usage
            exit 1
            ;;
    esac
    
    # Show summary
    show_summary "$platform" "$deployment_type"
}

# Handle script interruption
trap 'echo -e "\n${RED}❌ Deployment interrupted by user${NC}"; exit 1' INT

# Run main function with all arguments
main "$@"