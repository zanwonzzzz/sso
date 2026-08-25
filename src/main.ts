import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.getHttpAdapter().getInstance().set('trust proxy', true);
  // CORS: permitir que tu Vue (5173) le pegue al IdP (3000)
  app.enableCors({
    origin:  process.env.FRONT_URL ?? 'http://192.168.1.12:5173', 
    credentials: true,                  // para que viajen las cookies
  });

  app.use(cookieParser());
  app.use('/oidc/interaction', urlencoded({ extended: true }));
  app.use('/oidc/interaction', json());

  await app.listen(process.env.PORT ?? 3000,process.env.HOST ?? '192.168.1.12');
}
bootstrap();