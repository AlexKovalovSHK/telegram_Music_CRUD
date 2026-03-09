# 04_PLN_implementation.md

---

## Принцип работы с документом

Каждая фаза — отдельный контекст для агента.
Перед началом фазы агенту скармливаются: этот файл + документы, указанные в колонке «Контекст».
Фаза считается завершённой, когда выполнены все задачи и проходят все проверки.

---

## Phase 1 — Scaffolding (Монорепо и скелет проекта)

**Контекст:** `01_DES_architecture.md`
**Цель:** Получить рабочую структуру папок, установленные зависимости и запускаемые dev-серверы.

| # | Задача | Файлы/команды |
|---|--------|--------------|
| 1.1 | Создать корневой `package.json` с `workspaces: ["apps/*"]` | `/package.json` |
| 1.2 | Создать `apps/frontend` через `bun create vite` с шаблоном `react-ts` | `apps/frontend/` |
| 1.3 | Создать `apps/backend` через `bun create nestjs` | `apps/backend/` |
| 1.4 | Установить зависимости фронтенда: `@tanstack/react-query`, `bootstrap`, `react-bootstrap`, `@telegram-apps/sdk-react` | `apps/frontend/package.json` |
| 1.5 | Установить зависимости бэкенда: `@nestjs/typeorm`, `typeorm`, `@libsql/client`, `class-validator`, `class-transformer` | `apps/backend/package.json` |
| 1.6 | Добавить корневые скрипты: `dev`, `build`, `test` через `bun --filter '*'` | `/package.json` |
| 1.7 | Добавить `bunfig.toml` с настройкой workspaces | `/bunfig.toml` |

**Проверка Phase 1:**
- `bun run dev` из корня поднимает оба сервера без ошибок
- Frontend доступен на `localhost:5173`, backend на `localhost:3000`

---

## Phase 2 — Backend: Database & Entity

**Контекст:** `01_DES_architecture.md`, `02_DES_data_flow.md`
**Цель:** Рабочая БД, Entity и автоматические миграции при старте.

| # | Задача | Файлы |
|---|--------|-------|
| 2.1 | Настроить `TypeOrmModule.forRoot` в `app.module.ts` с `synchronize: true` для dev | `apps/backend/src/app.module.ts` |
| 2.2 | Создать `Piece` entity по схеме из `02_DES_data_flow.md` | `apps/backend/src/pieces/piece.entity.ts` |
| 2.3 | Указать путь к БД: `apps/backend/data/db.sqlite` | `app.module.ts` |
| 2.4 | Добавить `data/db.sqlite` в `.gitignore` | `apps/backend/.gitignore` |
| 2.5 | Создать `PiecesModule` и подключить его в `AppModule` | `apps/backend/src/pieces/pieces.module.ts` |

**Проверка Phase 2:**
- При старте бэкенда файл `data/db.sqlite` создаётся автоматически
- В нём существует таблица `piece` с нужными колонками

---

## Phase 3 — Backend: CRUD API

**Контекст:** `02_DES_data_flow.md`
**Цель:** Все 5 эндпоинтов работают и возвращают корректные данные.

| # | Задача | Файлы |
|---|--------|-------|
| 3.1 | Создать `CreatePieceDto` и `UpdatePieceDto` с валидацией `class-validator` | `apps/backend/src/pieces/dto/` |
| 3.2 | Создать `PiecesService` с методами: `findAll`, `findOne`, `create`, `update`, `remove` | `apps/backend/src/pieces/pieces.service.ts` |
| 3.3 | Создать `PiecesController` с маршрутами GET/POST/PUT/DELETE | `apps/backend/src/pieces/pieces.controller.ts` |
| 3.4 | Подключить `ValidationPipe` глобально в `main.ts` | `apps/backend/src/main.ts` |
| 3.5 | Включить CORS в `main.ts` для `localhost:5173` | `apps/backend/src/main.ts` |
| 3.6 | `findOne` и `remove` бросают `NotFoundException` если запись не найдена | `pieces.service.ts` |

**Проверка Phase 3:**
```
GET    /pieces        → 200 []
POST   /pieces        → 201 { id, deNum, deName, ruNum, ruName }
GET    /pieces/1      → 200 { id, ... }
PUT    /pieces/1      → 200 { id, ... }
DELETE /pieces/1      → 200 { id: 1 }
GET    /pieces/999    → 404 { statusCode, message, error }
POST   /pieces (пустое тело) → 400
```

---

## Phase 4 — Frontend: API-слой и хуки

**Контекст:** `02_DES_data_flow.md`
**Цель:** Все API-функции и TanStack Query хуки готовы и типизированы.

| # | Задача | Файлы |
|---|--------|-------|
| 4.1 | Создать `src/types/piece.ts` с интерфейсами `Piece`, `CreatePiecePayload`, `UpdatePiecePayload` | `apps/frontend/src/types/piece.ts` |
| 4.2 | Создать `src/api/pieces.ts` с функциями `fetchPieces`, `fetchPiece`, `createPiece`, `updatePiece`, `deletePiece` | `apps/frontend/src/api/pieces.ts` |
| 4.3 | Добавить `VITE_API_URL` в `.env.development` со значением `http://localhost:3000` | `apps/frontend/.env.development` |
| 4.4 | Создать `src/hooks/usePieces.ts` с хуками: `usePieces`, `usePiece`, `useCreatePiece`, `useUpdatePiece`, `useDeletePiece` | `apps/frontend/src/hooks/usePieces.ts` |
| 4.5 | Обернуть `App` в `QueryClientProvider` в `main.tsx` | `apps/frontend/src/main.tsx` |
| 4.6 | Подключить Bootstrap в `main.tsx`: `import 'bootstrap/dist/css/bootstrap.min.css'` | `apps/frontend/src/main.tsx` |

**Проверка Phase 4:**
- `usePieces()` возвращает массив из БД без ошибок TypeScript
- После `useCreatePiece().mutate(...)` список обновляется автоматически (invalidateQueries)

---

## Phase 5 — Frontend: UI-компоненты

**Контекст:** `03_DES_ui_ux.md`
**Цель:** Полностью рабочий интерфейс — список, поиск, сортировка, форма.

| # | Задача | Файлы |
|---|--------|-------|
| 5.1 | Создать `PieceItem` — карточка с данными и кнопками ✏️ 🗑️ | `src/components/PieceItem.tsx` |
| 5.2 | Создать `PieceForm` — модальное окно с формой (create + edit) | `src/components/PieceForm.tsx` |
| 5.3 | Создать `PieceList` — экран со списком, поиском, сортировкой | `src/components/PieceList.tsx` |
| 5.4 | Подключить Telegram-тему в `App.tsx` через `useLaunchParams` | `src/App.tsx` |
| 5.5 | Рендерить `PieceList` как корневой компонент в `App.tsx` | `src/App.tsx` |

**Порядок разработки компонентов:** `PieceItem` → `PieceForm` → `PieceList` → `App`
(каждый следующий зависит от предыдущего)

**Проверка Phase 5:**
- Список произведений отображается карточками
- Поиск фильтрует карточки в реальном времени по `ruName`
- Сортировка А→Я и Я→А работает корректно для кириллицы
- Создание произведения через форму добавляет карточку без перезагрузки
- Редактирование открывает форму с заполненными полями
- Удаление с подтверждением убирает карточку

---

## Phase 6 — CI/CD

**Контекст:** `01_DES_architecture.md`
**Цель:** Единый GitHub Actions пайплайн для монорепо.

| # | Задача | Файлы |
|---|--------|-------|
| 6.1 | Создать `.github/workflows/ci.yml` | `.github/workflows/ci.yml` |
| 6.2 | Пайплайн: `bun install` → `bun run build` для обоих приложений | `ci.yml` |
| 6.3 | Триггер: `push` и `pull_request` на ветку `main` | `ci.yml` |

**Проверка Phase 6:**
- CI проходит на чистом окружении без кэша
- Артефакты `apps/frontend/dist` и `apps/backend/dist` создаются успешно

---

## Сводная таблица фаз

| Фаза | Название | Контекст | Результат |
|------|----------|----------|-----------|
| 1 | Scaffolding | `01_DES` | Монорепо запускается |
| 2 | Database & Entity | `01_DES`, `02_DES` | SQLite + таблица |
| 3 | CRUD API | `02_DES` | 5 эндпоинтов работают |
| 4 | API-слой фронтенда | `02_DES` | Хуки типизированы |
| 5 | UI-компоненты | `03_DES` | Полный интерфейс |
| 6 | CI/CD | `01_DES` | Пайплайн зелёный |