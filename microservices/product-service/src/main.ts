import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:3000'], // Allow gateway and frontend access
    credentials: true,
  });

  await app.listen(4002);
  console.log('🚀 Product Service running on http://localhost:4002/graphql');
}
bootstrap();
