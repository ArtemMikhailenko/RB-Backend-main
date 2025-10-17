# Подключение фронтенда — Гайд

Этот документ показывает, как подключить frontend (React/Vue/Angular) к данному NestJS backend: авторизация, REST, загрузка файлов и WebSocket.

- Базовый URL: `http://localhost:${PORT}` (по умолчанию `http://localhost:3000`)
- Статические файлы:
  - Аватары: `GET http://localhost:3000/uploads/profile-pics/{filename}`
  - Медиа объектов: `GET http://localhost:3000/uploads/property-media/{filename}`
- WebSocket (socket.io): тот же origin, например `io('http://localhost:3000')`
- CORS включён; задайте `FRONTEND_URL` в `.env` и ограничьте origin в проде.

## Авторизация

### Email/Пароль
- Регистрация: `POST /auth/signup`
  - Тело: `{ firstName, lastName, email, password, country, terms }`
  - Ответ: `{ message, token }`
- Логин: `POST /auth/login`
  - Тело: `{ email, password }`
  - Ответ: `{ message, token }`
- Для защищённых маршрутов добавляйте заголовок: `Authorization: Bearer <token>`

### Google OAuth
- Старт: `GET /auth/google` → согласие Google → редирект на фронт с `?token=...`
- Настроить env:
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_CALLBACK_URL` (сервер) и `FRONTEND_URL` (куда редиректить фронт)
- После логина бэкенд редиректит: `${FRONTEND_URL}/auth/google/callback?token=...`

### Сброс пароля (OTP)
- Запросить код: `POST /auth/request-password-reset` с `{ email }`
- Проверить OTP: `POST /auth/verify-otp` с `{ email, otp }` → `{ resetToken }` (10 минут)
- Сменить пароль (для авторизованного): `POST /auth/change-password` с `Authorization: Bearer <token>` и `{ newPassword }`
- Обновить пароль (зная текущий): `POST /auth/update-password` с `{ currentPassword, newPassword }`

## Пример: настройка axios
```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
```

### Регистрация/Логин
```ts
await api.post('/auth/signup', { firstName, lastName, email, password, country, terms: true });
const { data } = await api.post('/auth/login', { email, password });
setAuthToken(data.token);
```

### Текущий профиль
```ts
const { data: me } = await api.get('/profile');
```

## Загрузка файлов

### Профиль пользователя (аватар)
- Endpoint: `PATCH /userprofile`
- FormData поля:
  - `profilePic`: файл (опционально)
  - прочие поля из `UpdateUserProfileDto`

```ts
const form = new FormData();
form.append('profilePic', file);
form.append('firstName', firstName);
form.append('lastName', lastName);
await api.patch('/userprofile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
```

### Медиа объекта недвижимости
- Endpoint: `POST /property-media` (защищённый)
- FormData поля:
  - `propertyId`: UUID
  - `images`: один или много файлов
  - `pdfs`: один или много файлов
  - опционально: `videoUrl`, `virtualTour`, `images[]` (строки-URL), `pdfs[]` (строки-URL)

```ts
const form = new FormData();
form.append('propertyId', propertyId);
images.forEach((f) => form.append('images', f));
pdfs.forEach((f) => form.append('pdfs', f));
if (videoUrl) form.append('videoUrl', videoUrl);
if (virtualTour) form.append('virtualTour', virtualTour);
await api.post('/property-media', form, { headers: { 'Content-Type': 'multipart/form-data' } });
```

## Основные REST-эндпоинты (выборочно)
- Профиль
  - `GET /profile` — текущий пользователь
- Профиль пользователя
  - `GET /userprofile`
  - `POST /userprofile`
  - `PATCH /userprofile` — с `profilePic`
- Компания
  - `GET /company`
  - `PATCH /company` / `POST /company`
  - `POST /company/:companyId/members` — добавить участника `{ email, role }`
  - `GET /company/:companyId/members` — список
  - `DELETE /company/:companyId/members/:userId` — удалить участника
- Партнёры (JWT)
  - `GET /partners` — мои партнёры (пагинация)
  - `GET /partners/suggestions` — рекомендации
  - `GET /partners/requests/received` — входящие заявки (пагинация)
  - `POST /partners/requests/:receiverId` — отправить заявку (тело `SendPartnerRequestDto`)
  - `POST /partners/requests/:requestId/accept` — принять
  - `POST /partners/requests/:requestId/reject` — отклонить
  - `DELETE /partners/:partnerId` — удалить партнёра
- Вакансии/возможности (Opportunities)
  - `GET /opportunities` — лента (пагинация)
  - `GET /opportunities/me` — мои (JWT)
  - `POST /opportunities` — создать (JWT)
  - `PUT /opportunities/:id` — обновить (JWT)
  - `DELETE /opportunities/:id` — удалить (JWT)
- Объекты недвижимости
  - `GET /properties` — список (пагинация)
  - `GET /properties/my` — мои (JWT)
  - `POST /properties` — создать (JWT)
  - `PUT /properties/:id` — обновить (JWT)
  - `DELETE /properties/:id` — удалить (JWT)
- Медиа объектов
  - `GET /property-media`
  - `GET /property-media/:id`
  - `POST /property-media` (JWT)
  - `PUT /property-media/:id` (JWT)
  - `DELETE /property-media/:id` (JWT)

## WebSocket (socket.io)
```ts
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  transports: ['websocket'],
});

socket.emit('register', myUserId);

socket.on('partnerRequestNotification', (payload) => {
  console.log('Заявка в партнёры:', payload);
});

socket.on('notification', (payload) => {
  console.log('Общее уведомление:', payload);
});
```

## Ошибки
- 400 — ошибки валидации (`message` — строка или массив)
- 401 — неавторизовано (JWT отсутствует/неверен)
- 409 — конфликт (email занят, лимит OTP)

## Окружение фронтенда
- `VITE_API_URL=http://localhost:3000`
- Храните JWT в памяти/secure cookie, добавляйте `Authorization` на запросы
- Для Google входа реализуйте маршрут `/auth/google/callback`, заберите `token` из query, сохраните его, редирект в приложение
