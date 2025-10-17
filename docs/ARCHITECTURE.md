# Real Estate Backend – Architecture

This project is a NestJS + TypeORM backend for a real estate/partners platform. It provides REST APIs, file uploads, email delivery, and real-time notifications via WebSockets.

## Tech stack
- Runtime: Node.js + TypeScript
- Framework: NestJS (modular architecture)
- Database: MySQL (TypeORM)
- Auth: JWT (local) + Google OAuth 2.0
- Mail: Nodemailer (Gmail or SMTP)
- WebSockets: socket.io via NestJS gateway
- File uploads: Multer to local storage (served as static)

## App entry and core config
- `src/main.ts`
  - CORS enabled with credentials (currently origin: `*` – configure per environment for production)
  - Serves static files:
    - `/uploads/profile-pics` → `uploads/profile-pics`
    - `/uploads/property-media` → `uploads/property-media`
    - `/email-assets` → `public/email-assets`
  - Global pipes: `ValidationPipe` (whitelist/transform)
  - Global interceptor: `ClassSerializerInterceptor`
  - Starts on `PORT` (default 3000)

- `src/app.module.ts`
  - `ConfigModule.forRoot({ isGlobal: true })` loads env vars
  - `TypeOrmModule.forRoot({ ... })` uses MySQL from env and `autoLoadEntities: true`
  - `synchronize: true` for developer convenience. Set to `false` in production and manage migrations explicitly.
  - Imports feature modules (auth, profile, company, partners, opportunities, real estate submodules, notifications)

## Modules overview
- Auth (`src/auth`)
  - Local signup/login with JWT
  - Google OAuth 2.0 (Passport Strategy)
  - Password reset via OTP (email), short-lived JWT reset token
  - JWT Strategy returns sanitized user into `req.user`
- Profile (`src/profile`)
  - `GET /profile` returns current authenticated user
- Settings (`src/setting/*`)
  - User profile CRUD with avatar upload (`/userprofile`)
  - Company details and members (`/company`)
  - Payment method, Tax information, Notification preferences
- Partners (`src/partners`)
  - Partner requests, accept/reject, list partners & suggestions (REST)
  - Real-time notifications through `PartnerGateway` (socket.io)
- Opportunities (`src/opportunities`)
  - CRUD + pagination for opportunities feed
- Real estate (`src/Realestate/*`)
  - Properties, types, location, media
  - Property media supports file uploads (images, PDFs) and URLs
- Notifications (`src/notifications`)
  - Placeholder controller for future expansion

## Persistence & entities
- ORM: TypeORM with `autoLoadEntities: true`
- MySQL connection via env.
- Entities live in each module’s `entities/` directory (e.g., `auth/entities/user.entity.ts`).
- Development uses `synchronize: true` (turn off in prod!).

## File storage & static assets
- Uploads written to `uploads/` via Multer:
  - Profile pics: `uploads/profile-pics`
  - Property media: `uploads/property-media`
- Publicly served paths:
  - `GET /uploads/profile-pics/{filename}`
  - `GET /uploads/property-media/{filename}`
- Email assets are served from `public/email-assets` at `/email-assets/*`.

## Email delivery
- `src/mailer/mailer.service.ts` uses Nodemailer with Gmail or SMTP credentials (`MAIL_USER`, `MAIL_PASS`).
- HTML templates are loaded from `src/mailer/assets/templates/*.html` if present.
- Provided helpers (examples): `sendResetCode`, `sendWelcomeEmail`, etc.

## WebSockets
- `src/partners/partner.gateway.ts` exposes a socket.io gateway with CORS (`origin: FRONTEND_URL or *`).
- Clients connect to the same origin as REST (default `http://localhost:3000`).
- After connect, client should emit `register` with their numeric userId to receive targeted notifications.
- Server emits:
  - `partnerRequestNotification`
  - `notification` (generic channel)

## Validation & error handling
- DTOs use `class-validator` and `class-transformer`.
- Common errors:
  - 400 validation errors
  - 401 unauthorized (missing/invalid JWT)
  - 403 forbidden (future role checks)
  - 409 conflict (e.g., duplicate email, OTP throttle)

## Environment variables
See `.env.example` for a complete list.
- Server
  - `PORT=3000`
  - `APP_BASE_URL=http://localhost:3000` (used in emails)
  - `FRONTEND_URL=http://localhost:5173` (OAuth callback and CORS for WS)
- Database (MySQL)
  - `DB_HOST=localhost`
  - `DB_PORT=3306`
  - `DB_USERNAME=root`
  - `DB_PASSWORD=...`
  - `DB_NAME=real_estate`
- Auth
  - `JWT_SECRET=supersecret`
  - Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- Mail
  - `MAIL_USER=your@gmail.com`
  - `MAIL_PASS=app-password-or-smtp-pass`

## Scripts
- `npm run start:dev` – development with watch
- `npm run build` – compile + copy mailer assets
- `npm run start:prod` – run built app (`dist/main.js`)

## Security notes
- Replace CORS `origin: '*'` with explicit domains in production.
- Set `synchronize: false` and use migrations.
- Keep secrets in env vars or a secret manager; never commit them.
