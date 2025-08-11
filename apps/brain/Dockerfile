FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json ./
RUN pnpm install --frozen-lockfile --production

# Development image
FROM base AS dev
WORKDIR /app
COPY package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 5000
CMD ["pnpm", "run", "dev"]

# Production image
FROM base AS runner
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client with fallback
RUN pnpm run db:generate:safe

# Build the application
RUN pnpm run build

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 brain
USER brain

EXPOSE 5000

ENV NODE_ENV=production

CMD ["pnpm", "start"]