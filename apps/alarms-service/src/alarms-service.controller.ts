import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AlarmsServiceService } from './alarms-service.service';

@Controller()
export class AlarmsServiceController {
  private readonly logger = new Logger(AlarmsServiceController.name);
  constructor(private readonly alarmsServiceService: AlarmsServiceService) {}

  @EventPattern('alarm.created')
  create(@Payload() data: unknown) {
    this.logger.debug(`[alarm.created] EVENT: ${JSON.stringify(data)}`);
  }
}
