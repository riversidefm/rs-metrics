# rs-metrics-service 🚀

> A complete NestJS GraphQL microservice with full infrastructure setup

This is a production-ready rs-metrics service built with NestJS, GraphQL, PostgreSQL, Redis, and Kafka. Everything is containerized and can be started with a single command.

## ⚡ Quick Start

**🚀 Zero setup required!** After scaffolding with Riverside CLI:

```bash
# After scaffolding, everything is ready!
cd rs-metrics-service

# Start development immediately
npm run dev

# Or run tests (already green!)
npm test
```

🎉 **That's it!** Your service is automatically running at:
- **API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql  
- **API Documentation**: http://localhost:3000/api/docs
- **Database Studio**: `npm run db:studio`

**What happened automatically:**
- ✅ Dependencies installed
- ✅ GraphQL types generated
- ✅ Environment configured
- ✅ Infrastructure started
- ✅ Database ready

## 📋 What's Included

This template provides a complete, production-ready microservice with:

### 🏗️ **Core Framework**
- **NestJS**: Modern Node.js framework with dependency injection
- **GraphQL**: Type-safe API with automatic schema generation  
- **TypeScript**: Full type safety throughout the application
- **Hot Reload**: Instant development feedback

### 🗄️ **Database & Storage**
- **PostgreSQL**: Primary database with full ACID compliance
- **Prisma**: Type-safe ORM with automatic migrations
- **Redis**: High-performance caching and session storage

### 🐳 **Infrastructure (All Containerized)**
- **Docker Compose**: Complete infrastructure setup
- **Automatic Health Checks**: Built-in service monitoring
- **Volume Management**: Persistent data storage
- **Network Isolation**: Secure container networking

### 📡 **Event Streaming**
- **Apache Kafka**: High-throughput message streaming
- **DAPR Integration**: Auto-configured event consumption via `/events/process`
- **Example Handlers**: Working Kafka consumer examples with tests
- **Zookeeper**: Distributed coordination
- **Dapr Integration**: Simplified pub/sub patterns
- **Topic Management**: Pre-configured for your topics:

### 🧪 **Testing & Quality**
- **Jest**: Unit and integration testing
- **E2E Testing**: Full application testing with test database
- **Test Containers**: Isolated test environment
- **Code Coverage**: Built-in coverage reporting
- **Linting & Formatting**: ESLint + Prettier

### 📊 **Monitoring & Observability**
- **Health Checks**: `/health` endpoint with deep checks
- **Request Logging**: Structured logging with Pino
- **API Documentation**: Auto-generated Swagger/OpenAPI docs
- **Metrics Ready**: Prometheus-compatible metrics endpoints

### 🔒 **Security & Performance**
- **Rate Limiting**: Built-in request throttling
- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Automatic request/response validation
- **Environment Configuration**: Secure secret management

## 🎯 Development Commands

### **Quick Commands** (Most Used)
```bash
npm run setup      # Complete setup: env + infrastructure + database  
npm run dev        # Start development server with all dependencies
npm start          # Same as npm run dev
npm run test       # Run all tests (unit + e2e)
npm run health     # Check if service is healthy
```

### **Setup & Infrastructure**
```bash
npm run setup:env     # Copy .env.example to .env
npm run setup:infra   # Start all Docker containers
npm run setup:db      # Generate Prisma client + run migrations
npm run setup:clean   # Clean restart (removes all data)

npm run infra:up      # Start containers
npm run infra:down    # Stop containers  
npm run infra:logs    # View all container logs
npm run infra:status  # Check container health
```

### **Database Operations**
```bash
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
npm run db:studio     # Open Prisma Studio (GUI)
npm run db:reset      # Reset database (⚠️ deletes all data)
npm run db:wait       # Wait for database to be ready
```

### **Testing**
```bash
npm run test:unit     # Unit tests only
npm run test:e2e      # End-to-end tests only  
npm run test:watch    # Unit tests in watch mode
npm run test:cov      # Tests with coverage report
```

## 🔧 Manual Setup (If Needed)

If the automatic setup doesn't work, here's the manual process:

### **1. Prerequisites**
- Node.js 18+ 
- Docker & Docker Compose
- Git

### **2. Environment Setup**
```bash
# Copy and customize environment variables
cp .env.example .env

# Edit .env file with your settings
# Key variables:
# - DATABASE_URL: PostgreSQL connection string
# - REDIS_URL: Redis connection string
# - APP_PORT: Application port (default: 3000)
```

### **3. Infrastructure**
```bash
# Start all services (PostgreSQL, Redis, Kafka)
docker compose up -d

# Check everything is running
docker compose ps
```

### **4. Database**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations to create tables
npm run db:migrate

```

### **5. Start Development**
```bash
npm run start:dev
```

## 🏗️ Project Structure

```
rs-metrics-service/
├── 📁 src/
│   ├── 📁 modules/
│   │   └── 📁 rs/     # Main feature module
│   │       ├── rs.module.ts
│   │       ├── rs.service.ts
│   │       ├── rs.service.spec.ts  # Unit tests
│   │       ├── rs.resolver.ts
│   │       └── rs.resolver.spec.ts # Unit tests
│   ├── 📁 config/              # Configuration files
│   ├── 📁 events/              # Kafka event handlers (examples included)
│   │       ├── events.handler.service.ts
│   │       └── events.handler.service.spec.ts                     # Unit tests
│   └── main.ts                 # Clean application entry point
├── 📁 prisma/
│   └── 📁 schema/              # Database schema
├── 📁 scripts/                 # Utility scripts
├── 🐳 docker-compose.yml      # Infrastructure setup
├── 📋 .env.example             # Environment template
└── 📖 README.md               # This file
```

## 🌐 API Endpoints

Once running, your service exposes:

### **GraphQL** (Primary API)
- **Playground**: http://localhost:3000/graphql
- **Schema**: Auto-generated from resolvers

### **REST** (Health & Docs)  
- **Health Check**: http://localhost:3000/health
- **API Documentation**: http://localhost:3000/api/docs
- **Metrics**: http://localhost:3000/metrics

### **Development Tools**
- **Database Studio**: `npm run db:studio` → http://localhost:5555
- **Container Logs**: `npm run infra:logs`

## 🔍 Sample GraphQL Queries

```graphql
# Get all rss with pagination
query GetRss {
  rss(limit: 10) {
    id
    name
    createdAt
    updatedAt
  }
}

# Create a new rs
mutation CreateRs {
  createRs(data: {
    name: "My New rs"
  }) {
    id
    name
    createdAt
  }
}

# Get a specific rs
query GetRs($id: String!) {
  rs(id: $id) {
    id
    name
    createdAt
    updatedAt
  }
}
```

## 🧪 Testing

**✅ Tests work immediately after scaffolding!**

### **Run Tests**
```bash
npm test              # All unit tests
npm run test:watch    # Watch mode
npm run test:cov      # With coverage
```


### **Test Structure**
- **Unit Tests**: `src/**/*.spec.ts` - Tests alongside source code
- **Focused & Simple**: Only essential unit tests, no complex E2E infrastructure

### **Testing Philosophy**
Unit tests verify core business logic without complex setup. For integration testing, use the development environment with `npm run dev`.

## 🚀 Production Deployment

### **Environment Variables**
Update `.env` for production:
```bash
NODE_ENV=production
DATABASE_URL=your-production-db-url
REDIS_URL=your-production-redis-url
JWT_SECRET=your-secure-jwt-secret
```

### **Build & Run**
```bash
npm run build        # Build for production
npm run start:prod   # Start production server
```

### **Docker**
```bash
docker build -t rs-metrics-service .
docker run -p 3000:3000 rs-metrics-service
```

## 🔧 Troubleshooting

### **Common Issues**

**❓ Service won't start**
```bash
# Check container status
npm run infra:status

# View logs
npm run infra:logs

# Clean restart
npm run setup:clean
```

**❓ Database connection issues**
```bash
# Wait for database to be ready
npm run db:wait

# Check database container
docker logs rs-metrics-service-postgres

# Verify connection string in .env
```

**❓ Port already in use**
```bash
# Change ports in .env file:
APP_PORT=3001
POSTGRES_PORT=5435
REDIS_PORT=6380
```

**❓ Permission issues with scripts**
```bash
chmod +x scripts/*.sh
chmod +x scripts/*.js
```

### **Reset Everything**
```bash
# Nuclear option: clean slate
npm run setup:clean
```

### **Get Help**
- Check container logs: `npm run infra:logs`
- View service health: `npm run health`  
- Database GUI: `npm run db:studio`
- API docs: http://localhost:3000/api/docs

---

## 🏢 RiversideAM Template

This service was generated using the [RiversideAM CLI](https://github.com/riversidefm/riversideam):

```bash
# Generate another service like this one:
riversideam scaffold-backend --name my-service --exposed
```

Built with ❤️ by the Platform Team
