# Чат API (приватные диалоги)

Этот документ описывает минимальные REST и Socket.IO контракты для чата «пользователь‑пользователь», реализованные в этом репозитории.

Бэкенд: NestJS 11 + TypeORM. Модуль: `src/chat/*`.

## Аутентификация

- REST: заголовок `Authorization: Bearer <JWT>`.
- Socket.IO: передавайте токен при подключении, например:
  - в `auth`: `{ token: '<JWT>' }`
  - или `Authorization: Bearer <JWT>` в заголовке запроса сокета

Сервер извлекает `userId` из токена (`sub`) и автоматически мапит `userId -> socket.id[]` (поддержка нескольких вкладок). Онлайн‑статус хранится в памяти.

Переменные окружения:

- `FRONTEND_URL` — домен фронтенда для CORS/Socket.IO (например, `http://localhost:5173` или прод‑домен)
- `APP_BASE_URL` — базовый URL бэкенда (для генерации ссылок на аватары)
- `JWT_SECRET` — секрет JWT

## REST эндпоинты

Все эндпоинты защищены `JwtAuthGuard`.

### GET /chat/users

Возвращает список потенциальных собеседников (без текущего пользователя).

Элемент списка:

```
{
  id: number,
  name: string,           // "Имя Фамилия"
  email: string,
  avatarUrl: string|null, // абсолютный URL или null
  online: boolean,        // true, если есть активные сокет‑сессии
  lastMessage: null | {   // последнее сообщение между мной и этим пользователем
    id: string,
    fromUserId: number,
    toUserId: number,
    text: string,
    ts: string,           // ISO timestamp
    read: boolean
  }
}
```

Примечание: `lastMessage` может иметь дополнительные поля — фронт может игнорировать лишнее.

### GET /chat/history?peerId=:id&offset=0&limit=50

История сообщений между текущим пользователем и `peerId`.

Ответ:

```
{
  items: Array<{
    id: string,
    fromUserId: number,
    toUserId: number,
    text: string,
    ts: string,   // ISO
    read: boolean
  }>
}
```

Порядок: по возрастанию времени (`ASC`) — от старых к новым.

Параметры:
- `offset` (number, >=0) — смещение
- `limit` (number, >=1) — размер страницы, по умолчанию 50

### POST /chat/mark-read

Тело:

```
{
  peerId: number,
  upTo?: string // ISO‑время, опционально: отметить прочитанными до указанного момента
}
```

Ответ:

```
{ updated: number } // количество обновлённых записей
```

### (Опционально, не реализовано) GET /chat/conversations

Список диалогов с последним сообщением и счётчиками непрочитанных. Можно реализовать отдельно (при необходимости — откройте задачу).

## Сокет‑события (Socket.IO)

Подключение клиента (пример):

```ts
import { io } from 'socket.io-client';
const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  transports: ['websocket'],
  auth: { token: localStorage.getItem('token') },
  withCredentials: true,
});
```

### chat:message

- Клиент → Сервер (отправка):

```
{ toUserId: number, text: string, clientId?: string }
```

- Сервер сохраняет сообщение: `id (uuid), fromUserId, toUserId, text, ts, read=false`.
- Сервер → обоим участникам:

```
{ id, fromUserId, toUserId, text, ts, read }
```

### chat:typing

- Клиент → Сервер:

```
{ toUserId: number }
```

- Сервер → собеседнику:

```
{ fromUserId: number }
```

### chat:read

- Клиент → Сервер:

```
{ peerId: number, upTo?: string /* ISO */ }
```

- Сервер помечает входящие сообщения от `peerId` как прочитанные (опционально до `upTo`).
- Сервер → собеседнику (уведомление):

```
{ fromUserId: number, toUserId: number, upTo?: string }
```

## Схема БД

Таблица `messages` (PostgreSQL):

- `id uuid pk`
- `fromUserId int` (FK `users.id`)
- `toUserId int` (FK `users.id`)
- `text text`
- `ts timestamptz default now()`
- `read boolean default false`

Индексы:
- `(fromUserId, toUserId, ts)`
- `(toUserId, read)`

## Производительность и масштабирование

- В продакшене ограничьте CORS `origin` до точного `FRONTEND_URL`.
- Для горизонтального масштабирования используйте Redis‑адаптер для Socket.IO и внешнее хранилище присутствия.
- `synchronize: true` включён для dev. На проде рекомендуется миграции.

## Проверка интеграции

1. Получите JWT после логина и сохраните в `localStorage.token`.
2. Подключитесь по сокету с `auth.token`.
3. Вызовите `GET /chat/users` — должен вернуться список, онлайн‑флаги будут зависеть от активных сессий.
4. Откройте вторую вкладку под другим пользователем — отправьте `chat:message` и убедитесь, что событие пришло обоим.
5. При фокусе окна отправьте `POST /chat/mark-read` и/или событие `chat:read`.
