#!/bin/bash

# rs-metrics-service Setup Script
# This script sets up the complete development environment

set -e  # Exit on any error

echo "🚀 Setting up rs-metrics-service development environment..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
print_status "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi
print_success "Docker is running"

# Check if Docker Compose is available
print_status "Checking Docker Compose..."
if ! docker compose version > /dev/null 2>&1; then
    print_error "Docker Compose is not available. Please install Docker Compose."
    exit 1
fi
print_success "Docker Compose is available"

# Check if Node.js is installed
print_status "Checking Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v) is available"

# Step 1: Install dependencies
print_status "Installing Node.js dependencies..."
if npm ci; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Setup environment variables
print_status "Setting up environment variables..."
if [ ! -f .env ]; then
    if cp .env.example .env; then
        print_success "Environment file created (.env)"
        print_warning "Please review and update .env file with your settings"
    else
        print_error "Failed to create .env file"
        exit 1
    fi
else
    print_warning ".env file already exists, skipping..."
fi

# Step 3: Start infrastructure
print_status "Starting infrastructure services..."
if docker compose up -d; then
    print_success "Infrastructure services started"
else
    print_error "Failed to start infrastructure services"
    exit 1
fi

# Step 4: Wait for database
print_status "Waiting for database to be ready..."
if npm run db:wait; then
    print_success "Database is ready"
else
    print_error "Database failed to start"
    exit 1
fi

# Step 5: Generate Prisma client
print_status "Generating Prisma client..."
if npm run db:generate; then
    print_success "Prisma client generated"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Step 6: Run database migrations
print_status "Running database migrations..."
if npm run db:migrate; then
    print_success "Database migrations completed"
else
    print_error "Database migrations failed"
    exit 1
fi

# Step 7: Check if everything is working
print_status "Verifying setup..."

# Check if containers are running
CONTAINERS_RUNNING=$(docker compose ps --services --filter "status=running" | wc -l)
TOTAL_CONTAINERS=$(docker compose ps --services | wc -l)

if [ "$CONTAINERS_RUNNING" -eq "$TOTAL_CONTAINERS" ]; then
    print_success "All containers are running"
else
    print_warning "Some containers might not be running properly"
    docker compose ps
fi

echo ""
echo "🎉 Setup completed successfully!"
echo "================================================"
echo ""
echo "📋 Next steps:"
echo "  1. Start the development server:"
echo "     ${GREEN}npm run dev${NC}"
echo ""
echo "  2. Open your browser and visit:"
echo "     • API: ${BLUE}http://localhost:3000${NC}"
echo "     • GraphQL Playground: ${BLUE}http://localhost:3000/graphql${NC}"
echo "     • API Docs: ${BLUE}http://localhost:3000/api/docs${NC}"
echo ""
echo "  3. Access database tools:"
echo "     • Prisma Studio: ${GREEN}npm run db:studio${NC}"
echo ""
echo "📊 Container status:"
docker compose ps

echo ""
echo "🛠️  Useful commands:"
echo "  ${BLUE}npm run dev${NC}          # Start development server"
echo "  ${BLUE}npm run test${NC}         # Run tests"
echo "  ${BLUE}npm run infra:logs${NC}   # View container logs"
echo "  ${BLUE}npm run infra:status${NC} # Check container status"
echo "  ${BLUE}npm run db:studio${NC}    # Open Prisma Studio"
echo "  ${BLUE}npm run health${NC}       # Check service health"
echo ""

# Optional: Run health check
print_status "Running initial health check in 5 seconds..."
sleep 5

if npm run health 2>/dev/null; then
    print_success "Service is healthy!"
else
    print_warning "Service health check failed - this is normal if the app isn't started yet"
fi

echo ""
print_success "rs-metrics-service is ready for development! 🎉"