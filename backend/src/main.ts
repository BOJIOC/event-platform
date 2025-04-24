import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RolesGuard } from './auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  // 👇 ВАЖНО! Это говорит Nest, что все API начинаются с /api
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Event Platform API')
    .setDescription('API для платформы совместных мероприятий')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.useGlobalGuards(new RolesGuard(new Reflector()))

  await app.listen(3000)
}
bootstrap()

