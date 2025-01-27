import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsServiceController {
  private readonly logger = new Logger(NotificationsServiceController.name);

  @MessagePattern('notification.send')
  sendNotification(@Payload() data: unknown) {
    this.logger.debug(
      `Received new [notification.send] message: ${JSON.stringify(data)}`,
    );

    throw new Error('Failed to send notification');
  }
}
