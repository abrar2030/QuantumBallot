#!/bin/bash

# QuantumBallot Web Frontend - Setup Verification Script
# This script verifies that the web frontend is properly set up

echo "==============================================="
echo "QuantumBallot Web Frontend - Setup Verification"
echo "==============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}!${NC} $1"
    ((WARNINGS++))
}

echo "1. Checking Prerequisites..."
echo "-----------------------------------"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js installed: $NODE_VERSION"
    
    # Check if version is 16+
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 16 ]; then
        warning "Node.js version should be 16+, you have $NODE_VERSION"
    fi
else
    error "Node.js is not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    success "npm installed: $NPM_VERSION"
else
    error "npm is not installed"
fi

echo ""
echo "2. Checking Project Files..."
echo "-----------------------------------"

# Check essential files
FILES=(
    "package.json"
    "vite.config.ts"
    "tsconfig.json"
    "tailwind.config.js"
    ".env.example"
    "src/App.tsx"
    "src/main.tsx"
    "index.html"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        success "Found: $file"
    else
        error "Missing: $file"
    fi
done

echo ""
echo "3. Checking New Implementation Files..."
echo "-----------------------------------"

NEW_FILES=(
    "src/components/ErrorBoundary.tsx"
    "src/lib/logger.ts"
    "src/lib/validations.ts"
    "__tests__/integration/api.test.tsx"
    "__tests__/integration/ErrorBoundary.test.tsx"
    "IMPLEMENTATION_NOTES.md"
    "CHANGELOG.md"
    "CHANGES_SUMMARY.txt"
    "QUICK_START.md"
)

for file in "${NEW_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "Found: $file"
    else
        error "Missing: $file"
    fi
done

echo ""
echo "4. Checking Environment Configuration..."
echo "-----------------------------------"

if [ -f ".env.example" ]; then
    success ".env.example exists"
    
    if [ -f ".env" ]; then
        success ".env file exists"
    else
        warning ".env file not found. Run: cp .env.example .env"
    fi
else
    error ".env.example not found"
fi

echo ""
echo "5. Checking Dependencies..."
echo "-----------------------------------"

if [ -d "node_modules" ]; then
    success "node_modules directory exists"
else
    warning "node_modules not found. Run: npm install"
fi

if [ -f "package-lock.json" ]; then
    success "package-lock.json exists"
else
    warning "package-lock.json not found"
fi

echo ""
echo "6. Checking Directory Structure..."
echo "-----------------------------------"

DIRS=(
    "src"
    "src/components"
    "src/screens"
    "src/services"
    "src/lib"
    "__tests__"
    "__tests__/integration"
    "public"
)

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        success "Found: $dir/"
    else
        error "Missing: $dir/"
    fi
done

echo ""
echo "7. Verification Summary"
echo "-----------------------------------"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. npm install (if not done)"
    echo "2. cp .env.example .env (if not done)"
    echo "3. npm run dev"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup complete with warnings${NC}"
    echo "Warnings: $WARNINGS"
    echo ""
    echo "Please address the warnings above."
    echo ""
    exit 0
else
    echo -e "${RED}✗ Setup verification failed${NC}"
    echo "Errors: $ERRORS"
    echo "Warnings: $WARNINGS"
    echo ""
    echo "Please fix the errors above before proceeding."
    echo ""
    exit 1
fi
