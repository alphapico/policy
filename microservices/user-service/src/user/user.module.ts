import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { GetUsersHandler } from './queries/handlers/get-users.handler';
import { UserCreatedHandler } from './events/handlers/user-created.handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CqrsModule,
  ],
  providers: [
    UserResolver,
    UserService,
    // Command Handlers
    CreateUserHandler,
    // Query Handlers
    GetUserHandler,
    GetUsersHandler,
    // Event Handlers
    UserCreatedHandler,
  ],
})
export class UserModule {}
