import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce'),
    
    // GraphQL Setup
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
    }),
    
    // CQRS and Event handling
    CqrsModule,
    EventEmitterModule.forRoot(),
    
    // Business modules
    ProductModule,
  ],
})
export class AppModule {}
