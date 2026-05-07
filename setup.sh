#!/usr/bin/env bash

# Team Task Manager - Setup Script
# This script sets up the entire project

set -e

echo "🚀 Team Task Manager - Setup Script"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js is installed: $(node --version)"
echo ""

# Check if MongoDB is installed or suggest MongoDB Atlas
echo -e "${BLUE}📦 MongoDB Setup${NC}"
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally"
    echo "Choose one:"
    echo "1. Install MongoDB Community: https://www.mongodb.com/try/download/community"
    echo "2. Use MongoDB Atlas (Cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
fi

echo ""
echo -e "${BLUE}📁 Setting up Backend...${NC}"
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${GREEN}✓${NC} Backend dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env with default values..."
    echo "Please update with your actual values:"
    echo ""
    cat .env
    echo ""
else
    echo -e "${GREEN}✓${NC} .env file exists"
fi

cd ..

echo ""
echo -e "${BLUE}📁 Setting up Frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${GREEN}✓${NC} Frontend dependencies already installed"
fi

cd ..

echo ""
echo "===================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "===================================="
echo ""
echo "Next steps:"
echo ""
echo -e "${BLUE}1. Configure Backend${NC}"
echo "   - Edit backend/.env with your values"
echo "   - Make sure MongoDB is running"
echo ""
echo -e "${BLUE}2. Start Backend${NC}"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo -e "${BLUE}3. Start Frontend (in new terminal)${NC}"
echo "   cd frontend"
echo "   npm start"
echo ""
echo -e "${BLUE}4. Open Browser${NC}"
echo "   http://localhost:3000"
echo ""
echo -e "${BLUE}5. Login with Demo Credentials${NC}"
echo "   Admin: admin@example.com / password"
echo "   Member: member@example.com / password"
echo ""
echo "For more information, see QUICK_START.md"
