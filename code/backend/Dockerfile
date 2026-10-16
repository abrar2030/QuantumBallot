# Build context is the workspace root (code/), not code/backend/:
# the backend compiles together with ../blockchain and the lockfile lives in code/.
#   docker build -f backend/Dockerfile code
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY blockchain/package.json ./blockchain/

RUN npm ci

COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src
COPY blockchain/src ./blockchain/src

RUN npm run build

FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/QuantumBallot_db

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY blockchain/package.json ./blockchain/

RUN npm ci --omit=dev && npm cache clean --force

# tsc output keeps the workspace layout: dist/backend/src and dist/blockchain/src
COPY --from=builder /app/backend/dist ./backend/dist

RUN mkdir -p /app/data && chown -R node:node /app/data

WORKDIR /app/backend

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

USER node

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/backend/src/index.js"]
