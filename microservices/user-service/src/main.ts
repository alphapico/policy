import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:4000', 
      'http://localhost:3000',
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ], // Allow gateway and frontend access
    credentials: true,
  });

  await app.listen(4001, '0.0.0.0'); // Use port 4001 for User Service
  console.log('🚀 User Service running on http://localhost:4001/api/graphql');
}
bootstrap();
