#!/bin/bash

echo "🚀 MAVI Puzzle - Production Build Script"
echo "========================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if frontend/.env exists
if [ ! -f "frontend/.env" ]; then
    echo -e "${RED}❌ Error: frontend/.env not found${NC}"
    echo -e "${YELLOW}📝 Please create frontend/.env with:${NC}"
    echo "REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com"
    exit 1
fi

# Build Frontend
echo ""
echo -e "${YELLOW}📦 Building Frontend...${NC}"
cd frontend

# Install dependencies
echo "Installing dependencies..."
npm install

# Build
echo "Creating production build..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful!${NC}"
    echo ""
    echo -e "${YELLOW}📂 Build output: frontend/build/${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Upload frontend/build/* to Hostinger public_html/"
    echo "2. Copy frontend/.htaccess to public_html/"
    echo "3. Deploy backend to Render"
    echo ""
    echo -e "${GREEN}📖 See DEPLOYMENT_GUIDE.md for details${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
