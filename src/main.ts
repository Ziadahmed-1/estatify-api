import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { GlobalJwtAuthGuard } from './common/guards/global-jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unvalidated fields
      forbidNonWhitelisted: true, // throws if extra fields are sent
      transform: true, // auto-transform payloads to DTO classes
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // allow all domains
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  //Enable Interceptors
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Global guards
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new GlobalJwtAuthGuard(reflector));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Estatify API')
    .setDescription('The real estate API documentation')
    .setVersion('1.0')
    .addBearerAuth() // If using JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // localhost:3000/api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
