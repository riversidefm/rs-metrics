# rs-metrics-service Production Dockerfile
# Multi-stage build for optimal image size and security

# Stage 1: Build application
FROM node:22.16-alpine AS build

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install all dependencies (including dev)
RUN --mount=type=secret,id=NPM_TOKEN,env=NPM_TOKEN npm i

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run db:generate
# Generate graphql types
RUN npm run gql:generate:types
# Build application
RUN npm run build

# Stage 2: Production image
FROM node:22.16-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create app directory
WORKDIR /usr/src/app

# Copy built application and dependencies
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/package*.json ./

RUN mkdir -p ./src/schema
COPY --chown=node:node --from=build /usr/src/app/src/schema/schema.graphql ./src/schema/schema.graphql


# Start the application
CMD ["node", "dist/src/main"]
