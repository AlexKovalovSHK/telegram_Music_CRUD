# apps/backend/Dockerfile

FROM oven/bun:1

WORKDIR /app

# Копируем workspace конфиги
COPY package.json bun.lockb* ./
COPY apps/backend/package.json ./apps/backend/

# Устанавливаем зависимости
RUN bun install --frozen-lockfile

# Копируем исходники бэкенда
COPY apps/backend ./apps/backend

# Папка для SQLite
RUN mkdir -p /app/data

EXPOSE 3000

# Запускаем исходники напрямую — без компиляции
CMD ["bun", "run", "--cwd", "apps/backend", "src/main.ts"]