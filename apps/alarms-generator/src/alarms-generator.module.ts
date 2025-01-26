import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { AlarmsGeneratorService } from './alarms-generator.service';
import { ALARMS_SERVICE } from './constants';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: 'apps/alarms-generator/.env',
    }),
    ClientsModule.register([
      {
        name: ALARMS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
  ],
  providers: [AlarmsGeneratorService],
})
export class AlarmsGeneratorModule {}
