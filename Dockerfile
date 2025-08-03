# syntax=docker/dockerfile:1.4

# ----- BASE STAGE -----
FROM --platform=$BUILDPLATFORM node:24 AS base
WORKDIR /app

# ----- DEPENDENCIES -----
FROM --platform=$BUILDPLATFORM node:24 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


# ----- BUILD STAGE ------
FROM --platform=$BUILDPLATFORM node:24 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ----- FINAL STAGE ------
FROM --platform=$TARGETPLATFORM node:24 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built app and dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy generated Prisma client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/generated/prisma /app/prisma/generated/prisma

# Create cache directory and set permissions
RUN mkdir -p .next/cache/images && chown -R nextjs:nodejs .next

USER nextjs

# No hardcoded Prisma binary — let Prisma detect automatically
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
