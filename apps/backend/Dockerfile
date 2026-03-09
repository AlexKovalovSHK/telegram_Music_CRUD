# apps/backend/Dockerfile

FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
COPY apps/backend/package.json ./apps/backend/

RUN bun install --frozen-lockfile

COPY apps/backend ./apps/backend

RUN cd apps/backend && bun run build

# ---

FROM oven/bun:1 AS runner

WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Папка для SQLite — будет смонтирована как volume
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["bun", "run", "dist/main.js"]