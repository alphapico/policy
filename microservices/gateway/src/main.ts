import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend access
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // React and Vite
    credentials: true,
  });

  await app.listen(4000);
  console.log('🚀 GraphQL Federation Gateway running on http://localhost:4000/graphql');
}
bootstrap();
