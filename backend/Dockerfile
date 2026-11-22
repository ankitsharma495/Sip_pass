# Multi-stage production Dockerfile for SipClub NestJS API

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma engine on Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --cache /tmp/.npm-cache

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runner
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl curl

ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary artifacts from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Use non-root user
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/src/main.js"]
