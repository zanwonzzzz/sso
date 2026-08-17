import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // CORS: permitir que tu Vue (5173) le pegue al IdP (3000)
  app.enableCors({
    origin: 'http://localhost:5173',   // la URL de tu Vue
    credentials: true,                  // para que viajen las cookies
  });

  app.use(cookieParser());
  app.use('/oidc/interaction', urlencoded({ extended: true }));
  app.use('/oidc/interaction', json());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();