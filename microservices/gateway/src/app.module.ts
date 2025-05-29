import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        buildService: ({ url }) => new (require('@apollo/gateway').RemoteGraphQLDataSource)({
          url,
        }),
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'users', url: 'http://localhost:4001/graphql' },
            { name: 'products', url: 'http://localhost:4002/graphql' },
            { name: 'orders', url: 'http://localhost:4003/graphql' },
            { name: 'payments', url: 'http://localhost:4004/graphql' },
            { name: 'notifications', url: 'http://localhost:4005/graphql' },
          ],
        }),
      },
    }),
  ],
})
export class AppModule {}
