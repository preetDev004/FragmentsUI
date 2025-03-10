# ================================================================================================
# Stage 0: Dependency Installation (Layer Caching Optimization)
# ================================================================================================
FROM node:22.5.1-alpine3.20@sha256:9fcc1a6da2b9eee38638df75c5f826e06e9c79f6a0f97f16ed98fe0ebb0725c0 AS dependencies

# Set working directory to isolate application files
WORKDIR /app

# Copy dependency management files first to leverage Docker's layer caching. This ensures dependencies are only reinstalled when package files change.
COPY package.json package-lock.json tsconfig.json next.config.mjs ./

# Install ALL dependencies (including devDependencies) using clean-install for reproducibility
RUN npm ci

# ================================================================================================
# Stage 1: Application Build (Transient Build Environment)
# ================================================================================================
# Reuse the same base image version to ensure build environment consistency
FROM node:22.5.1-alpine3.20@sha256:9fcc1a6da2b9eee38638df75c5f826e06e9c79f6a0f97f16ed98fe0ebb0725c0 AS build

WORKDIR /app

# Copy installed dependencies from previous stage to avoid reinstallation
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code. This is done after dependency installation to optimize caching
COPY . .

# Next.js telemetry is enabled by default, disable it
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

# Compile TypeScript code to JavaScript. This requires devDependencies from previous stage
RUN npm run build

##################################################################################################
# Stage 2 - Serve the build app (production)
##################################################################################################
FROM node:22.5.1-alpine3.20@sha256:9fcc1a6da2b9eee38638df75c5f826e06e9c79f6a0f97f16ed98fe0ebb0725c0 AS deploy

ARG COMMIT_SHA="development"
ARG BUILD_DATE="unknown"

LABEL version="${COMMIT_SHA}" \
      build-date="${BUILD_DATE}" \
      maintainer="Preet Patel <pdpatel51@myseneca.ca>" \
      description="Fragments UI NextJS Front-End"

WORKDIR /app

RUN apk add --no-cache tini

RUN addgroup -g 1001 -S nextjs && \
    adduser -S -u 1001 -G nextjs nextjs

# Copy built application and only required dependencies
COPY --from=build --chown=nextjs:nextjs /app/package.json /app/package-lock.json ./
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static

# Ensure proper permissions
RUN chmod -R 755 /app && \
    chown -R nextjs:nextjs /app

USER nextjs

EXPOSE 3000

# Use Tini as PID 1 for proper signal handling and zombie process reaping
ENTRYPOINT ["/sbin/tini", "--"]

# Use node directly instead of npm for better signal handling
CMD ["node", "server.js"]