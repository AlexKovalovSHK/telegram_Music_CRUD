# Telegram Music CRUD

Мини-приложение для Telegram для управления списком музыкальных произведений. Поддерживает поиск, сортировку и полноценный CRM (Create, Read, Update, Delete).

## Технологический стек

- **Монорепозиторий**: Bun Workspaces
- **Frontend**: React + TypeScript + Vite
- **UI**: React-Bootstrap + Telegram Mini Apps SDK
- **Backend**: NestJS + TypeORM
- **БАЗА ДАННЫХ**: SQLite (@libsql/client)
- **State Management**: TanStack Query (React Query)

## Структура проекта

- `apps/frontend`: Клиентское React-приложение.
- `apps/backend`: Серверное NestJS-приложение с API и базой данных.
- `01_DES`, `02_DES`, `03_DES`: Архитектурная документация.

## Быстрый старт

### Требования
- [Bun](https://bun.sh) (v1.x)

### Установка
```bash
bun install
```

### Запуск в режиме разработки
```bash
bun run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

### Сборка
```bash
bun run build
```

## Telegram Integration
Приложение использует `@telegram-apps/sdk-react` для получения параметров темы пользователя. Цвета темы (фон, текст, кнопки) автоматически пробрасываются в CSS-переменные Bootstrap.

## Лицензия
MIT
