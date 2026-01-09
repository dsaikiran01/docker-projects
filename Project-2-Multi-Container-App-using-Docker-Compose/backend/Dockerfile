# ---------- Stage 1: Dependencies ----------
FROM node:18-alpine AS deps

WORKDIR /app

# Set production environment early
ENV NODE_ENV=production

# Copy dependency files first (better caching)
COPY package*.json ./

# Install only production dependencies, no scripts
RUN npm ci --only=production --ignore-scripts \
    && npm cache clean --force


# ---------- Stage 2: Runtime ----------
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user and group
RUN addgroup -S app && adduser -S app -G app

# Copy dependencies and app source with correct ownership
COPY --from=deps --chown=app:app /app/node_modules ./node_modules
COPY --chown=app:app . .

# Drop root privileges
USER app

# Expose application port
EXPOSE 3000

# Use exec form for proper signal handling
CMD ["npm", "start"]
