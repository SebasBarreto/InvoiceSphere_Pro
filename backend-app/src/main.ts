import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Usa el filtro global para capturar todas las excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configuración de CORS
  app.enableCors({
    origin: '*',  // Cambia esto si quieres restringir el acceso a ciertos dominios
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Inicia el servidor
  await app.listen(3000);
}
bootstrap();
