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

  await app.listen(8001, '0.0.0.0'); // Use port 8001 to match the backend configuration
  console.log('🚀 User Service running on http://localhost:8001/api/graphql');
}
bootstrap();
