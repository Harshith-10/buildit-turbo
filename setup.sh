#!/bin/bash

# BuildIt Turbo - Automated Setup Script (Unix/Linux/macOS)
# This script automates the complete setup process for the BuildIt Turbo project

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Output functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_step() {
    echo -e "\n${MAGENTA}==> $1${NC}"
}

# Banner
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════╗
║                                                   ║
║          BuildIt Turbo - Setup Script            ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Step 1: Check Prerequisites
print_step "Step 1: Checking Prerequisites"

# Check Node.js
print_info "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
    
    # Extract version number and check if >= 18
    VERSION_NUMBER=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    if [ "$VERSION_NUMBER" -lt 18 ]; then
        print_warning "Node.js version 18 or higher is recommended. You have: $NODE_VERSION"
    fi
else
    print_error "Node.js is not installed. Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

# Check pnpm
print_info "Checking pnpm installation..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    print_success "pnpm is installed: v$PNPM_VERSION"
else
    print_warning "pnpm is not installed. Installing pnpm globally..."
    npm install -g pnpm
    if [ $? -eq 0 ]; then
        print_success "pnpm installed successfully"
    else
        print_error "Failed to install pnpm. Please install it manually: npm install -g pnpm"
        exit 1
    fi
fi

# Check PostgreSQL
print_info "Checking PostgreSQL installation..."
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version)
    print_success "PostgreSQL is installed: $PG_VERSION"
else
    print_warning "PostgreSQL CLI (psql) not found in PATH."
    print_warning "Please ensure PostgreSQL is installed and running."
    print_warning "Download from: https://www.postgresql.org/download/"
    
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 2: Install Dependencies
print_step "Step 2: Installing Dependencies"
print_info "Running: pnpm install"
pnpm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed successfully"

# Step 3: Environment Configuration
print_step "Step 3: Setting Up Environment Variables"

if [ -f ".env" ]; then
    print_warning ".env file already exists"
    read -p "Do you want to reconfigure it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Keeping existing .env file"
        RECONFIGURE=false
    else
        RECONFIGURE=true
    fi
else
    RECONFIGURE=true
fi

if [ "$RECONFIGURE" = true ]; then
    print_info "Configuring environment variables..."
    
    # Get database configuration
    echo -e "\n${YELLOW}Database Configuration:${NC}"
    read -p "Enter PostgreSQL host (default: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    
    read -p "Enter PostgreSQL port (default: 5432): " DB_PORT
    DB_PORT=${DB_PORT:-5432}
    
    read -p "Enter PostgreSQL username (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    read -sp "Enter PostgreSQL password: " DB_PASSWORD
    echo
    
    read -p "Enter database name (default: buildit_turbo): " DB_NAME
    DB_NAME=${DB_NAME:-buildit_turbo}
    
    # Generate a secure random secret
    print_info "Generating secure authentication secret..."
    AUTH_SECRET=$(openssl rand -hex 32)
    
    read -p "Enter application URL (default: http://localhost:3000): " APP_URL
    APP_URL=${APP_URL:-http://localhost:3000}
    
    # Create DATABASE_URL
    DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
    
    # Create .env file
    cat > .env << EOF
# Database Configuration
# PostgreSQL connection string
DATABASE_URL=$DATABASE_URL

# Better Auth Configuration
# Secure random secret (auto-generated)
BETTER_AUTH_SECRET=$AUTH_SECRET

# Application URL
BETTER_AUTH_URL=$APP_URL

# Node Environment
NODE_ENV=development
EOF
    
    print_success "Environment file (.env) created successfully"
fi

# Step 4: Database Setup
print_step "Step 4: Setting Up Database"

# Ask if database exists
echo -e "\n${YELLOW}Database Setup:${NC}"
read -p "Do you need to create the database? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Load .env to get database credentials
    export $(grep -v '^#' .env | xargs)
    
    # Extract database name from DATABASE_URL
    DB_NAME_FROM_URL=$(echo $DATABASE_URL | sed 's|.*/||')
    
    print_info "Creating database: $DB_NAME_FROM_URL"
    
    # Extract connection info
    DB_USER=$(echo $DATABASE_URL | sed 's|postgresql://\([^:]*\):.*|\1|')
    DB_PASS=$(echo $DATABASE_URL | sed 's|postgresql://[^:]*:\([^@]*\)@.*|\1|')
    DB_HOST=$(echo $DATABASE_URL | sed 's|.*@\([^:]*\):.*|\1|')
    DB_PORT=$(echo $DATABASE_URL | sed 's|.*:\([0-9]*\)/.*|\1|')
    
    export PGPASSWORD=$DB_PASS
    
    # Create database
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME_FROM_URL;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_success "Database created successfully"
    else
        print_warning "Database might already exist or creation failed"
        print_info "Continuing with setup..."
    fi
    
    unset PGPASSWORD
fi

# Push database schema
print_info "Pushing database schema..."
print_info "Running: pnpm db:push"
pnpm db:push

if [ $? -ne 0 ]; then
    print_error "Failed to push database schema"
    print_warning "Please check your database connection and try again"
    exit 1
fi
print_success "Database schema created successfully"

# Step 5: Seed Database
print_step "Step 5: Seeding Database (Optional)"

read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Seeding database..."
    print_info "Running: pnpm db:seed"
    pnpm db:seed
    
    if [ $? -eq 0 ]; then
        print_success "Database seeded successfully"
        echo -e "\n${YELLOW}Default Users Created:${NC}"
        echo -e "${CYAN}  Admin   - Email: admin@buildit.com   | Password: password1234${NC}"
        echo -e "${CYAN}  Faculty - Email: faculty@buildit.com | Password: password1234${NC}"
        echo -e "${CYAN}  Student - Email: student@buildit.com | Password: password1234${NC}"
        SEEDED=true
    else
        print_warning "Database seeding encountered issues"
        SEEDED=false
    fi
else
    print_info "Skipping database seeding"
    SEEDED=false
fi

# Step 6: Build Check (Optional)
print_step "Step 6: Build Verification (Optional)"

read -p "Do you want to verify the build? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Building project..."
    pnpm build
    
    if [ $? -eq 0 ]; then
        print_success "Build completed successfully"
    else
        print_warning "Build encountered issues"
    fi
fi

# Final Summary
echo -e "\n${GREEN}$(printf '═%.0s' {1..60})${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}$(printf '═%.0s' {1..60})${NC}"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "${CYAN}  1. Start the development server:${NC}"
echo -e "     ${NC}pnpm dev${NC}"
echo -e "\n${CYAN}  2. Open your browser:${NC}"
echo -e "     ${NC}http://localhost:3000${NC}"

if [ "$SEEDED" = true ]; then
    echo -e "\n${CYAN}  3. Login with default credentials:${NC}"
    echo -e "     ${NC}Admin:   admin@buildit.com / password1234${NC}"
    echo -e "     ${NC}Faculty: faculty@buildit.com / password1234${NC}"
    echo -e "     ${NC}Student: student@buildit.com / password1234${NC}"
fi

echo -e "\n${YELLOW}Useful Commands:${NC}"
echo -e "  ${NC}pnpm dev        - Start development server${NC}"
echo -e "  ${NC}pnpm build      - Build for production${NC}"
echo -e "  ${NC}pnpm start      - Start production server${NC}"
echo -e "  ${NC}pnpm lint       - Run linter${NC}"
echo -e "  ${NC}pnpm format     - Format code${NC}"
echo -e "  ${NC}pnpm db:push    - Push schema changes${NC}"
echo -e "  ${NC}pnpm db:seed    - Seed database${NC}"
echo -e "  ${NC}pnpm db:reset   - Reset database${NC}"

echo -e "\n${GREEN}$(printf '═%.0s' {1..60})${NC}"
echo -e "${CYAN}Happy Coding! 🚀${NC}"
echo -e "${GREEN}$(printf '═%.0s' {1..60})${NC}"
echo ""
