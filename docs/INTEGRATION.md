# Frontend Integration Guide

This guide shows how to connect a frontend (React/Vue/Angular) to this NestJS backend: auth, REST endpoints, file uploads, and WebSockets.

- Base URL: `http://localhost:${PORT}` (default `http://localhost:3000`)
- Static files:
  - Profile pics: `GET http://localhost:3000/uploads/profile-pics/{filename}`
  - Property media: `GET http://localhost:3000/uploads/property-media/{filename}`
- WebSocket endpoint: same origin (socket.io), e.g. `io('http://localhost:3000')`
- CORS: enabled globally; set `FRONTEND_URL` in `.env` and tighten origin in production.

## Auth

### Local email/password
- Signup: `POST /auth/signup`
  - Body: `{ firstName, lastName, email, password, country, terms }`
  - Response: `{ message, token }`
- Login: `POST /auth/login`
  - Body: `{ email, password }`
  - Response: `{ message, token }`
- Attach token: `Authorization: Bearer <token>` to access protected routes.

### Google OAuth
- Start: `GET /auth/google` → Google consent → callback to your frontend with `?token=...`
- Configure env:
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_CALLBACK_URL` (server) and `FRONTEND_URL` (client redirect target)
- After login, backend redirects: `${FRONTEND_URL}/auth/google/callback?token=...`

### Password reset flow (OTP)
- Request: `POST /auth/request-password-reset` with `{ email }`
- Verify OTP: `POST /auth/verify-otp` with `{ email, otp }` → returns `{ resetToken }` (10 minutes)
- Change password (authorized user): `POST /auth/change-password` with `Authorization: Bearer <token>` and body `{ newPassword }`
- Update password (with current password): `POST /auth/update-password` with body `{ currentPassword, newPassword }`

## Example: axios setup
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

### Signup/Login
```ts
// Signup
await api.post('/auth/signup', {
  firstName, lastName, email, password, country, terms: true,
});

// Login
const { data } = await api.post('/auth/login', { email, password });
setAuthToken(data.token);
```

### Get current profile
```ts
const { data: me } = await api.get('/profile');
```

## File uploads

### Update user profile with avatar
- Endpoint: `PATCH /userprofile`
- FormData fields:
  - `profilePic`: file (optional)
  - plus any JSON string fields from `UpdateUserProfileDto`

```ts
const form = new FormData();
form.append('profilePic', file);
form.append('firstName', firstName);
form.append('lastName', lastName);
await api.patch('/userprofile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
```

### Property media upload
- Endpoint: `POST /property-media` (protected)
- FormData fields:
  - `propertyId`: UUID
  - `images`: one or more files
  - `pdfs`: one or more files
  - optional text fields: `videoUrl`, `virtualTour`, `images[]` (string URLs), `pdfs[]` (string URLs)

```ts
const form = new FormData();
form.append('propertyId', propertyId);
images.forEach((f) => form.append('images', f));
pdfs.forEach((f) => form.append('pdfs', f));
if (videoUrl) form.append('videoUrl', videoUrl);
if (virtualTour) form.append('virtualTour', virtualTour);
await api.post('/property-media', form, { headers: { 'Content-Type': 'multipart/form-data' } });
```

## Core REST endpoints (selected)

- Profile
  - `GET /profile` – current user
- User Profile
  - `GET /userprofile` – my profile data
  - `POST /userprofile` – create
  - `PATCH /userprofile` – update with optional `profilePic` file
- Company
  - `GET /company` – my company
  - `PATCH /company` – create or update my company
  - `POST /company` – create my company
  - `POST /company/:companyId/members` – add member `{ email, role }`
  - `GET /company/:companyId/members` – list members
  - `DELETE /company/:companyId/members/:userId` – remove member
- Partners (JWT required)
  - `GET /partners` – list my partners (paged)
  - `GET /partners/suggestions` – suggestions for me
  - `GET /partners/requests/received` – received partner requests (paged)
  - `POST /partners/requests/:receiverId` – send request with body `SendPartnerRequestDto`
  - `POST /partners/requests/:requestId/accept` – accept received request
  - `POST /partners/requests/:requestId/reject` – reject received request
  - `DELETE /partners/:partnerId` – remove partner
- Opportunities
  - `GET /opportunities` – feed (paged)
  - `GET /opportunities/me` – my items (JWT)
  - `POST /opportunities` – create (JWT)
  - `PUT /opportunities/:id` – update (JWT)
  - `DELETE /opportunities/:id` – delete (JWT)
- Properties
  - `GET /properties` – public list (paged)
  - `GET /properties/my` – my properties (JWT)
  - `POST /properties` – create (JWT)
  - `PUT /properties/:id` – update (JWT)
  - `DELETE /properties/:id` – delete (JWT)
- Property Media
  - `GET /property-media` – list all
  - `GET /property-media/:id` – get by id
  - `POST /property-media` – upload files/URLs (JWT)
  - `PUT /property-media/:id` – update (JWT)
  - `DELETE /property-media/:id` – remove (JWT)

## WebSocket usage (socket.io)

```ts
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  transports: ['websocket'],
});

// After you know the logged-in user's id
socket.emit('register', myUserId);

socket.on('partnerRequestNotification', (payload) => {
  console.log('Partner request:', payload);
});

socket.on('notification', (payload) => {
  console.log('General notification:', payload);
});

socket.on('connect', () => console.log('WS connected', socket.id));
```

## Error handling from frontend
- Validation errors: expect 400 with `{ message: string | string[] }`
- Auth errors: 401 with `{ message: 'Unauthorized' }`
- Conflict (e.g., email exists, OTP throttle): 409
- Show user-friendly messages based on response data

## Environment
Frontends typically use env vars:
- `VITE_API_URL=http://localhost:3000`
- Store JWT token in memory or secure cookie; add `Authorization` header on each call.
- For Google login, implement a catch route at `/auth/google/callback` that reads `token` query param, stores it, and redirects to app.
