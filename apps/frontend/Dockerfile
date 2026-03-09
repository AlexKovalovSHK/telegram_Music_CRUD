# apps/frontend/Dockerfile

FROM oven/bun:1 AS builder

WORKDIR /app

# Копируем корневой package.json и lockfile для workspaces
COPY package.json bun.lockb* ./
COPY apps/frontend/package.json ./apps/frontend/

RUN bun install --frozen-lockfile

COPY apps/frontend ./apps/frontend

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN cd apps/frontend && bun run build

# ---

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80