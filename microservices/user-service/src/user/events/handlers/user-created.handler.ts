import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  handle(event: UserCreatedEvent) {
    console.log(`🎉 User Created Event: ${event.email} (${event.firstName} ${event.lastName})`);
    
    // Here you would typically:
    // 1. Send welcome email via Notification Service
    // 2. Create user profile in other services
    // 3. Publish to external message queue (Kafka)
    
    // For now, we'll just log it and potentially send to other services
    this.publishToNotificationService(event);
  }

  private publishToNotificationService(event: UserCreatedEvent) {
    // This would be replaced with actual message queue publishing
    console.log(`📧 Publishing to Notification Service: Welcome email for ${event.email}`);
  }
}
