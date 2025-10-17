# Real Estate Backend — Архитектура

Бэкенд на NestJS + TypeORM для платформы недвижимости и партнёрств. Предоставляет REST API, загрузку файлов, отправку писем, и уведомления в реальном времени через WebSocket (socket.io).

## Технологии
- Node.js + TypeScript
- NestJS (модульная архитектура)
- MySQL (TypeORM)
- Аутентификация: JWT (локальная) + Google OAuth 2.0
- Почта: Nodemailer (Gmail или SMTP)
- WebSockets: socket.io (NestJS Gateway)
- Загрузка файлов: Multer в локальное хранилище (отдаётся как статика)

## Точка входа и базовые настройки
- `src/main.ts`
  - Включён CORS (сейчас `origin: '*'`, в проде настроить домены явно)
  - Отдача статических файлов:
    - `/uploads/profile-pics` → `uploads/profile-pics`
    - `/uploads/property-media` → `uploads/property-media`
    - `/email-assets` → `public/email-assets`
  - Глобальные пайпы: `ValidationPipe` (whitelist/transform)
  - Глобальный интерцептор: `ClassSerializerInterceptor`
  - Порт: `PORT` (по умолчанию 3000)

- `src/app.module.ts`
  - `ConfigModule.forRoot({ isGlobal: true })` — env переменные
  - `TypeOrmModule.forRoot(...)` — MySQL из env, `autoLoadEntities: true`
  - `synchronize: true` — удобно в dev, в проде выключить и использовать миграции
  - Подключены модули: auth, profile, company, partners, opportunities, блоки недвижимости и notifications

## Обзор модулей
- Auth (`src/auth`)
  - Регистрация/логин по email+пароль, JWT
  - Google OAuth 2.0 (Passport Strategy)
  - Сброс пароля через OTP (email), короткоживущий reset JWT
  - JWT Strategy возвращает "очищённого" пользователя в `req.user`
- Profile (`src/profile`)
  - `GET /profile` — текущий авторизованный пользователь
- Settings (`src/setting/*`)
  - Профиль пользователя с аватаром (`/userprofile`)
  - Данные компании и участники (`/company`)
  - Платёжные данные, налоговая информация, настройки уведомлений
- Partners (`src/partners`)
  - Заявки в партнёры, принятие/отклонение, список партнёров, рекомендации (REST)
  - Уведомления в реальном времени через `PartnerGateway`
- Opportunities (`src/opportunities`)
  - CRUD + пагинация ленты
- Real estate (`src/Realestate/*`)
  - Объекты, типы, локации, медиа
  - Медиа: загрузка изображений/PDF и ссылки
- Notifications (`src/notifications`)
  - Заготовка под будущую логику

## Персистентность и сущности
- ORM: TypeORM, `autoLoadEntities: true`
- Подключение к MySQL через env
- Сущности в `entities/` внутри модулей (например, `auth/entities/user.entity.ts`)
- В dev `synchronize: true` (в проде выключить)

## Файлы и статика
- Загрузки пишутся в `uploads/` через Multer:
  - Аватары: `uploads/profile-pics`
  - Медиа объектов: `uploads/property-media`
- Публичные пути:
  - `GET /uploads/profile-pics/{filename}`
  - `GET /uploads/property-media/{filename}`
- Почтовые ассеты — `public/email-assets` по пути `/email-assets/*`

## Почта
- `src/mailer/mailer.service.ts` — Nodemailer
- Шаблоны HTML: `src/mailer/assets/templates/*.html` (если есть)
- Примеры методов: `sendResetCode`, `sendWelcomeEmail`, ...

## WebSocket
- `src/partners/partner.gateway.ts` — socket.io с CORS (`origin: FRONTEND_URL или *`)
- Подключение по тому же origin, что и REST (по умолчанию `http://localhost:3000`)
- После подключения клиент должен отправить `register` с числовым `userId`
- Сервер шлёт события:
  - `partnerRequestNotification`
  - `notification` (общий канал)

## Валидация и ошибки
- DTO через `class-validator` / `class-transformer`
- Типичные коды ошибок:
  - 400 — валидация
  - 401 — неавторизован (нет/неверный JWT)
  - 409 — конфликт (например, email уже занят, лимит на OTP)

## Переменные окружения
См. `.env.example`.
- Сервер
  - `PORT=3000`
  - `APP_BASE_URL=http://localhost:3000`
  - `FRONTEND_URL=http://localhost:5173`
- База (MySQL)
  - На облачных провайдерах используйте `DATABASE_URL` (mysql://user:pass@host:3306/dbname)
  - Либо поля: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
  - Если требуется TLS/SSL — `DB_SSL=true` (включит ssl c `rejectUnauthorized: false`)
- Auth
  - `JWT_SECRET`
  - Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- Почта
  - `MAIL_USER`, `MAIL_PASS`

## Скрипты
- `npm run start:dev` — dev с перезапуском
- `npm run build` — сборка + копирование ассетов почты
- `npm run start:prod` — запуск из `dist/main.js`

## Безопасность
- В проде укажите конкретные домены в CORS, не `*`
- Отключите `synchronize` и используйте миграции
- Секреты хранить в env/секрет-менеджере, не коммитить
