# 03_DES_ui_ux.md

---

## 1. UI-фреймворк

| Пакет | Версия | Назначение |
|-------|--------|-----------|
| `bootstrap` | 5.x | CSS-переменные, сетка, утилиты |
| `react-bootstrap` | 2.x | React-компоненты: Modal, Form, Card, Button, Spinner, Alert |

Подключение в `main.tsx`:
```typescript
import 'bootstrap/dist/css/bootstrap.min.css';
```

> **Запрещено:** Tailwind, inline-стили, написание собственного CSS кроме минимальных переопределений Telegram-темы.

---

## 2. Telegram-тема

`@telegram-apps/sdk` предоставляет цвета темы пользователя (`bg_color`, `text_color`, `button_color` и др.).
Их нужно пробросить в CSS-переменные Bootstrap в `App.tsx`:

```typescript
import { useLaunchParams } from '@telegram-apps/sdk-react';

const { themeParams } = useLaunchParams();

document.documentElement.style.setProperty('--bs-body-bg', themeParams.bgColor);
document.documentElement.style.setProperty('--bs-body-color', themeParams.textColor);
document.documentElement.style.setProperty('--bs-primary', themeParams.buttonColor);
```

---

## 3. Экраны и компоненты

Приложение состоит из **одного экрана** со списком и **модального окна** для создания/редактирования.
Таблица не используется — только карточки (`Card`), так как приложение работает на мобильных устройствах.

### 3.1 Экран: список произведений (`PieceList`)

```
┌─────────────────────────────────────┐
│  Музыкальные произведения [+Добавить]│
├─────────────────────────────────────┤
│  🔍 [Поиск по названию (RU)...    ] │
│     [А-Я ▼]                         │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 1. Соната             1. Sonate │ │
│ │                      [✏️] [🗑️] │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 2. Фуга              2. Fuge    │ │
│ │                      [✏️] [🗑️] │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Компонент:** `<PieceList>`
**Bootstrap-компоненты:** `Card`, `Button`, `Form.Control`, `Form.Select`, `Spinner`, `Alert`

#### Поиск и сортировка — только на фронтенде (client-side)

Поиск и сортировка не делают новых запросов к API. Они фильтруют и сортируют данные,
уже полученные через `usePieces()`.

```typescript
const [search, setSearch] = useState('');
const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

const { data: pieces } = usePieces();

const filtered = useMemo(() => {
  return (pieces ?? [])
    .filter(p => p.ruName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortDir === 'asc'
        ? a.ruName.localeCompare(b.ruName, 'ru')
        : b.ruName.localeCompare(a.ruName, 'ru')
    );
}, [pieces, search, sortDir]);
```

#### Контролы поиска и сортировки

| Элемент | Bootstrap-компонент | Поведение |
|---------|-------------------|-----------|
| Строка поиска | `Form.Control type="search"` | `onChange` обновляет `search` |
| Сортировка | `Form.Select` | Значения: `asc` (А→Я) / `desc` (Я→А) |

#### Состояния экрана

| Состояние | Отображение |
|-----------|-------------|
| Загрузка | `<Spinner animation="border" />` по центру |
| Ошибка | `<Alert variant="danger">Не удалось загрузить список</Alert>` |
| Пустой список / нет результатов поиска | `<Alert variant="info">Ничего не найдено</Alert>` |
| Данные есть | Список `<PieceItem>` карточек |

---

### 3.2 Карточка произведения (`PieceItem`)

```
┌───────────────────────────────────────┐
│  ruNum. ruName          deNum. deName  │
│                              [✏️][🗑️] │
└───────────────────────────────────────┘
```

**Компонент:** `<PieceItem piece onEdit onDelete>`
**Bootstrap-компоненты:** `Card`, `Card.Body`, `Button`

- Левая часть: `ruNum. ruName` — основной язык, обычный вес
- Правая часть: `deNum. deName` — `text-muted`, меньший размер
- Кнопки: `✏️` — `variant="outline-secondary" size="sm"`, `🗑️` — `variant="outline-danger" size="sm"`
- Подтверждение удаления — нативный `window.confirm('Удалить произведение?')`

---

### 3.3 Модальное окно: форма (`PieceForm`)

Используется и для **создания**, и для **редактирования** — управляется пропом `piece?: Piece`.

```
┌─────────────────────────────────────┐
│  Добавить произведение          [✕] │
├─────────────────────────────────────┤
│  Номер (RU)    [________________]   │
│  Название (RU) [________________]   │
│  Номер (DE)    [________________]   │
│  Название (DE) [________________]   │
├─────────────────────────────────────┤
│              [Отмена] [Сохранить]   │
└─────────────────────────────────────┘
```

**Компонент:** `<PieceForm piece? onSuccess onClose>`
**Bootstrap-компоненты:** `Modal`, `Form`, `Form.Group`, `Form.Label`, `Form.Control`, `Button`

| Поле | `Form.Control` name | Placeholder |
|------|-------------------|-------------|
| ruNum | `ruNum` | `Номер (RU)` |
| ruName | `ruName` | `Название (RU)` |
| deNum | `deNum` | `Номер (DE)` |
| deName | `deName` | `Название (DE)` |

> RU-поля идут первыми — они основные для пользователя.

Кнопка «Сохранить» показывает `<Spinner size="sm">` пока мутация `isPending`.

---

## 4. Компонентное дерево

```
App
└── PieceList
    ├── Spinner / Alert              ← состояния загрузки и ошибки
    ├── Form.Control (search)        ← локальный useState
    ├── Form.Select (sortDir)        ← локальный useState
    ├── PieceItem (×N)               ← карточка: данные + кнопки ✏️ 🗑️
    └── PieceForm (Modal)            ← create или edit, управляется локальным useState
```

---

## 5. Управление локальным стейтом в `PieceList`

```typescript
// Модальное окно
const [modal, setModal] = useState<{ open: boolean; piece?: Piece }>({ open: false });

// Поиск и сортировка
const [search, setSearch] = useState('');
const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
```

> Эти четыре значения — единственный локальный `useState` в приложении.
> Все серверные данные — только через TanStack Query.