import { Module } from '@nestjs/common';
import { AlarmsServiceController } from './alarms-service.controller';
import { AlarmsServiceService } from './alarms-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/alarms-service/.env',
    }),
  ],
  controllers: [AlarmsServiceController],
  providers: [AlarmsServiceService],
})
export class AlarmsServiceModule {}
