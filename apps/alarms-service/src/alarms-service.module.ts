import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AlarmsServiceController } from './alarms-service.controller';
import { AlarmsServiceService } from './alarms-service.service';
import { NATS_MESSAGE_BROKER, NOTIFICATIONS_SERVICE } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/alarms-service/.env',
    }),
    ClientsModule.register([
      {
        name: NATS_MESSAGE_BROKER,
        transport: Transport.NATS,
        options: { servers: process.env.NATS_URL },
      },
      {
        name: NOTIFICATIONS_SERVICE,
        transport: Transport.RMQ,
        options: { urls: [process.env.RABBITMQ_URL] },
      },
    ]),
  ],
  controllers: [AlarmsServiceController],
  providers: [AlarmsServiceService],
})
export class AlarmsServiceModule {}
