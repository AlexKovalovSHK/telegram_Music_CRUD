# apps/backend/Dockerfile

FROM oven/bun:1-debian

WORKDIR /app

# Устанавливаем build tools для компиляции better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Копируем workspace конфиги
COPY package.json bun.lockb* ./
COPY apps/backend/package.json ./apps/backend/

# Устанавливаем зависимости (better-sqlite3 скомпилируется здесь)
RUN bun install --frozen-lockfile

# Копируем исходники бэкенда
COPY apps/backend ./apps/backend

# Папка для SQLite
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["bun", "run", "--cwd", "apps/backend", "src/main.ts"]