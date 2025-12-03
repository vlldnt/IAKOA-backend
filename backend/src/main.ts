import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerConfig } from './swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Logging de toutes les requêtes HTTP
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Exception filter global pour logger les erreurs
  app.useGlobalFilters(new HttpExceptionFilter());

  // Activer la validation globale avec messages d'erreur personnalisés
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés non autorisées
    transform: true, // Transforme automatiquement les types
    transformOptions: {
      enableImplicitConversion: true, // Convertit automatiquement les types primitifs
    },
    disableErrorMessages: false, // Affiche les messages d'erreur
    validationError: {
      target: false, // Ne pas exposer l'objet cible dans les erreurs
      value: false, // Ne pas exposer les valeurs dans les erreurs
    },
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
