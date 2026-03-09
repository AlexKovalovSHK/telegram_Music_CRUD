# 02_DES_data_flow.md

---

## 1. REST API — эндпоинты

Base URL (dev): `http://localhost:3000`
Base URL (prod): задаётся переменной окружения `VITE_API_URL` на фронтенде.

| Метод | Путь | Описание | Request Body | Response |
|-------|------|----------|-------------|----------|
| GET | `/pieces` | Список всех произведений | — | `Piece[]` |
| GET | `/pieces/:id` | Одно произведение | — | `Piece` |
| POST | `/pieces` | Создать произведение | `CreatePieceDto` | `Piece` |
| PUT | `/pieces/:id` | Обновить произведение | `UpdatePieceDto` | `Piece` |
| DELETE | `/pieces/:id` | Удалить произведение | — | `{ id: number }` |

---

## 2. Схема базы данных

Таблица: `piece`

| Колонка | Тип SQLite | TypeORM декоратор | Nullable |
|---------|-----------|-------------------|----------|
| `id` | INTEGER | `@PrimaryGeneratedColumn()` | false |
| `de_num` | TEXT | `@Column()` | false |
| `de_name` | TEXT | `@Column()` | false |
| `ru_num` | TEXT | `@Column()` | false |
| `ru_name` | TEXT | `@Column()` | false |

> Именование колонок: snake_case в БД, camelCase в TypeScript (TypeORM маппит автоматически).

```typescript
// piece.entity.ts
@Entity('piece')
export class Piece {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deNum: string;

  @Column()
  deName: string;

  @Column()
  ruNum: string;

  @Column()
  ruName: string;
}
```

---

## 3. DTO

```typescript
// create-piece.dto.ts
export class CreatePieceDto {
  deNum: string;
  deName: string;
  ruNum: string;
  ruName: string;
}

// update-piece.dto.ts
// Все поля опциональны — частичное обновление
export class UpdatePieceDto {
  deNum?: string;
  deName?: string;
  ruNum?: string;
  ruName?: string;
}
```

> Валидация через `class-validator`: каждое поле помечается `@IsString()` и `@IsNotEmpty()` в `CreatePieceDto`, `@IsOptional()` + `@IsString()` в `UpdatePieceDto`.

---

## 4. Тип на фронтенде

```typescript
// frontend/src/types/piece.ts
export interface Piece {
  id: number;
  deNum: string;
  deName: string;
  ruNum: string;
  ruName: string;
}

export type CreatePiecePayload = Omit<Piece, 'id'>;
export type UpdatePiecePayload = Partial<CreatePiecePayload>;
```

---

## 5. API-функции (queryFn / mutationFn)

```typescript
// frontend/src/api/pieces.ts
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const fetchPieces = (): Promise<Piece[]> =>
  fetch(`${BASE}/pieces`).then(r => r.json());

export const fetchPiece = (id: number): Promise<Piece> =>
  fetch(`${BASE}/pieces/${id}`).then(r => r.json());

export const createPiece = (body: CreatePiecePayload): Promise<Piece> =>
  fetch(`${BASE}/pieces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());

export const updatePiece = (id: number, body: UpdatePiecePayload): Promise<Piece> =>
  fetch(`${BASE}/pieces/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());

export const deletePiece = (id: number): Promise<{ id: number }> =>
  fetch(`${BASE}/pieces/${id}`, { method: 'DELETE' }).then(r => r.json());
```

---

## 6. TanStack Query — ключи и хуки

```typescript
// frontend/src/hooks/usePieces.ts
export const pieceKeys = {
  all: ['pieces'] as const,
  detail: (id: number) => ['pieces', id] as const,
};

export const usePieces = () =>
  useQuery({ queryKey: pieceKeys.all, queryFn: fetchPieces });

export const usePiece = (id: number) =>
  useQuery({ queryKey: pieceKeys.detail(id), queryFn: () => fetchPiece(id) });

export const useCreatePiece = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPiece,
    onSuccess: () => qc.invalidateQueries({ queryKey: pieceKeys.all }),
  });
};

export const useUpdatePiece = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & UpdatePiecePayload) =>
      updatePiece(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pieceKeys.all });
      qc.invalidateQueries({ queryKey: pieceKeys.detail(id) });
    },
  });
};

export const useDeletePiece = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePiece,
    onSuccess: () => qc.invalidateQueries({ queryKey: pieceKeys.all }),
  });
};
```

---

## 7. Формат ошибок

Все ошибки бэкенда возвращают стандартный NestJS-формат:

```json
{
  "statusCode": 404,
  "message": "Piece with id 42 not found",
  "error": "Not Found"
}
```

На фронтенде ошибки обрабатываются в `onError` колбэке мутации или через `error`-поле `useQuery`. Глобальный обработчик не требуется — каждый хук управляет своим состоянием ошибки.