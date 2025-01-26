import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AlarmsClassifierServiceModule } from './alarms-classifier-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AlarmsClassifierServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: process.env.NATS_URL,
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  app.startAllMicroservices();

  await app.listen(3003);
}
bootstrap();
