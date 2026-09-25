import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
    routeConflictPolicy: {duplicate:"error", shadow:"warn"},
    routeResolutionStrategy: 'specificity'
  });
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    transformOptions: {
      enableImplicitConversion: true, // 
    },
    whitelist: true,           // strips fields not in DTO
    forbidNonWhitelisted: true // throws error if unknown fields are sent
  }))
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') ?? 3000);
}
await bootstrap();
