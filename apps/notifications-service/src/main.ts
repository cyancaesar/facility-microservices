import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationsServiceModule } from './notifications-service.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        /**
         * [Receiver]
         * Subscribe to any messages/events that is in `notifications_queue` queue.
         */
        queue: 'notifications_queue',
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  app.startAllMicroservices();

  await app.listen(3004);
}
bootstrap();
