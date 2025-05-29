import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { UserService } from '../../user.service';
import { UserCreatedEvent } from '../../events/user-created.event';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { email, password, firstName, lastName } = command;
    
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const userId = uuidv4();
    const user = await this.userService.create({
      id: userId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      status: 'active',
    });

    // Publish event
    this.eventBus.publish(new UserCreatedEvent(userId, email, firstName, lastName));

    return user;
  }
}
