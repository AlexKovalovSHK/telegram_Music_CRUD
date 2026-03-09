# apps/frontend/Dockerfile

FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
COPY apps/frontend/package.json ./apps/frontend/

RUN bun install --frozen-lockfile

COPY apps/frontend ./apps/frontend

# VITE_API_URL не нужен — используем относительный путь /api
RUN cd apps/frontend && bun run build

# ---

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80