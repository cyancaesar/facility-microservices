import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WorkflowsServiceModule } from './workflows-service.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkflowsServiceModule);
  app.useGlobalPipes(new ValidationPipe());

  // Create a hybrid app, and HTTP and a Microservice application.
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'workflows_queue',
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  app.startAllMicroservices();

  await app.listen(3001);
}
bootstrap();
