# ================================================================================================
# Stage 0: Dependency Installation (Layer Caching Optimization)
# ================================================================================================
FROM node:22.5.1-alpine3.20@sha256:9fcc1a6da2b9eee38638df75c5f826e06e9c79f6a0f97f16ed98fe0ebb0725c0 AS deps

# Install dependencies needed for certain builds
RUN apk add --no-cache libc6-compat

# Set working directory to isolate application files
WORKDIR /app

# Copy dependency management files first to leverage Docker's layer caching
COPY package.json package-lock.json tsconfig.json next.config.mjs ./

# Install dependencies using npm ci for reproducible builds
RUN npm ci

# ================================================================================================
# Stage 1: Application Build (Transient Build Environment)
# ================================================================================================
FROM node:22.5.1-alpine3.20@sha256:9fcc1a6da2b9eee38638df75c5f826e06e9c79f6a0f97f16ed98fe0ebb0725c0 AS builder

WORKDIR /app

# Copy installed dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Set build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AWS_COGNITO_AUTHORITY
ARG NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID
ARG NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL
ARG NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL
ARG NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN

# Set environment variables
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_AWS_COGNITO_AUTHORITY=${NEXT_PUBLIC_AWS_COGNITO_AUTHORITY}
ENV NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=${NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID}
ENV NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL=${NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL}
ENV NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL=${NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL}
ENV NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN=${NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN}

# Build the application
RUN npm run build

# ================================================================================================
# Stage 2: Production Runtime (Minimal Footprint)
# ================================================================================================
FROM node:22.5.1-alpine3.20@sha256:9fcc1a6da2b9eee38638df75c5f826e06e9c79f6a0f97f16ed98fe0ebb0725c0 AS runner

ARG COMMIT_SHA="development"
ARG BUILD_DATE="unknown"

LABEL version="${COMMIT_SHA}" \
    build-date="${BUILD_DATE}" \
    maintainer="Preet Patel <pdpatel51@myseneca.ca>" \
    description="Fragments UI NextJS Front-End"

WORKDIR /app

ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add tini for proper signal handling
RUN apk add --no-cache tini=0.19.0-r3

# Create a non-root user
RUN addgroup -g 1001 -S nextjs && \
    adduser -S -u 1001 -G nextjs nextjs

# Copy only the necessary files from the builder stage
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# Ensure proper permissions
RUN chmod -R 755 /app && \
    chown -R nextjs:nextjs /app

USER nextjs

# Set port and hostname
EXPOSE ${PORT}

# Use Tini as PID 1 for proper signal handling and zombie process reaping
ENTRYPOINT ["/sbin/tini", "--"]

# Use node directly to run the application
CMD ["node", "server.js"]