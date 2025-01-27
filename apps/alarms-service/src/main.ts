import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AlarmsServiceModule } from './alarms-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AlarmsServiceModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'notifications-service',
        noAck: false,
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
