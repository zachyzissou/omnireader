FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Development image
FROM base AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Production image
FROM base AS runner
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api
USER api

EXPOSE 4000

ENV NODE_ENV=production

CMD ["npm", "start"]