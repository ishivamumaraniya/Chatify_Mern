# # Multi-stage build for optimization
# FROM node:18-alpine AS builder

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm ci --only=production

# # Copy source code
# COPY . .

# # Production stage
# FROM node:18-alpine

# WORKDIR /app

# # Copy from builder
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app .

# # Create non-root user for security
# RUN addgroup -g 1001 -S nodejs && \
#     adduser -S nodejs -u 1001 && \
#     chown -R nodejs:nodejs /app

# USER nodejs

# EXPOSE 3000

# # Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
#   CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# CMD ["node", "src/server.js"]

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "src/server.js"]
