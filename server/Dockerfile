# --- Stage 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# --- Stage 2: Production ---
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Only copy the built files and production-only dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies (no devDeps)
RUN npm ci --only=production

# Use a non-root user for security
USER node

EXPOSE 4000

# Start the application
CMD ["node", "dist/server.js"]
