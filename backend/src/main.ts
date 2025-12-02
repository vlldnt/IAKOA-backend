import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerConfig } from './swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Exception filter global pour logger les erreurs
  app.useGlobalFilters(new HttpExceptionFilter());

  // Activer la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Activer CORS
  app.enableCors();

  // Configuration Swagger (uniquement en développement)
  if (SwaggerConfig.shouldEnable()) {
    SwaggerConfig.setup(app, 'swagger');
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Swagger UI disponible sur: http://localhost:${port}/swagger`);
}
bootstrap();
