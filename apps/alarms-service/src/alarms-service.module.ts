import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AlarmsServiceController } from './alarms-service.controller';
import { AlarmsServiceService } from './alarms-service.service';
import { MESSAGE_BROKER } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/alarms-service/.env',
    }),
    ClientsModule.register([
      {
        name: MESSAGE_BROKER,
        transport: Transport.NATS,
        options: { servers: process.env.NATS_URL },
      },
    ]),
  ],
  controllers: [AlarmsServiceController],
  providers: [AlarmsServiceService],
})
export class AlarmsServiceModule {}
