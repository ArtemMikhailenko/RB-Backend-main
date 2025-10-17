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

  // ✅ Enable CORS for frontend
  app.enableCors({
    origin: '*',
    credentials: true,
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
