import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable strict CORS for frontend (supports multiple origins via FRONTEND_URL="https://a.com,https://b.com")
  const rawOrigins = process.env.FRONTEND_URL || '';
  const allowList = rawOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  // Helpful locals for dev
  const devOrigins = ['http://localhost:5173', 'http://localhost:3000'];
  for (const o of devOrigins) if (!allowList.includes(o)) allowList.push(o);

  app.enableCors({
    origin: (origin, callback) => {
      // allow non-browser or same-origin requests (e.g., curl/Postman where origin is undefined)
      if (!origin) return callback(null, true);
      if (allowList.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept, X-Requested-With',
    credentials: true,
    optionsSuccessStatus: 204,
  });

  // ✅ Serve static files (uploads, email-assets)
  app.use(
    '/uploads/profile-pics',
    express.static(join(process.cwd(), 'uploads/profile-pics')),
  );
// Serve property-media folder
app.use(
  '/uploads/property-media',
  express.static(join(process.cwd(), 'uploads/property-media')),
);

  app.use(
    '/email-assets',
    express.static(join(__dirname, '..', 'public', 'email-assets')),
  );

  // ✅ Global validation & serialization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ✅ Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
