// src/main.ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Préfixe global pour toutes les routes API
  app.setGlobalPrefix('api');
  
  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Product API')
    .setDescription('API de gestion des produits')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api/swagger', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
  
  console.log('🚀 App running on http://localhost:3000');
  console.log('📚 Swagger UI: http://localhost:3000/api/swagger');
  console.log('📄 Swagger JSON: http://localhost:3000/api/swagger-json');
}
bootstrap();