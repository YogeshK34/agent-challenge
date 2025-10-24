# syntax=docker/dockerfile:1

FROM node:lts AS build

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Disable Analytics/Telemetry
ENV DISABLE_TELEMETRY=true
ENV POSTHOG_DISABLED=true
ENV MASTRA_TELEMETRY_DISABLED=true
ENV DO_NOT_TRACK=1

WORKDIR /app

# Copy lock file first for better caching
COPY pnpm-lock.yaml ./

RUN --mount=type=cache,target=/pnpm/store \
  pnpm fetch --frozen-lockfile

# Copy package.json
COPY package.json ./

# Install all dependencies (including devDependencies for build)
RUN --mount=type=cache,target=/pnpm/store \
  pnpm install --frozen-lockfile

# Copy configuration files
COPY next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs ./

# Copy source code
COPY src ./src
COPY public ./public

# Copy environment variables (FOR BOUNTY DEMO ONLY - REMOVE FOR PRODUCTION)
COPY .env ./

# Build the application (mastra build + next build)
RUN pnpm run build

# Production stage
FROM node:lts AS runtime

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Create non-root user
RUN groupadd -g 1001 appgroup && \
  useradd -u 1001 -g appgroup -m -d /app -s /bin/false appuser

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (concurrently is needed at runtime)
RUN --mount=type=cache,target=/pnpm/store \
  pnpm install --frozen-lockfile

# Copy built application from build stage
COPY --from=build --chown=appuser:appgroup /app/.next ./.next
COPY --from=build --chown=appuser:appgroup /app/.mastra ./.mastra
COPY --from=build --chown=appuser:appgroup /app/public ./public
COPY --from=build --chown=appuser:appgroup /app/.env ./.env

# Copy necessary source files for runtime
COPY --chown=appuser:appgroup src ./src
COPY --chown=appuser:appgroup next.config.ts ./

ENV NODE_ENV=production \
  NODE_OPTIONS="--enable-source-maps"

USER appuser

# Expose ports
# 3000: Next.js UI
# 4111: Mastra Agent
EXPOSE 3000
EXPOSE 4111

# Start both agent and UI using concurrently
ENTRYPOINT ["pnpm", "start"]