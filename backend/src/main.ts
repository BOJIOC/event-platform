import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RolesGuard } from './auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Разрешаем запросы с фронта
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Все маршруты под префиксом /api
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Event Platform API')
    .setDescription('API для платформы совместных мероприятий')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Глобальный guard ролей
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  await app.listen(3000);
}
bootstrap();
