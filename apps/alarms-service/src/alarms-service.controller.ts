import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { AlarmsServiceService } from './alarms-service.service';
import { MESSAGE_BROKER } from './constants';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AlarmsServiceController {
  private readonly logger = new Logger(AlarmsServiceController.name);
  constructor(
    private readonly alarmsServiceService: AlarmsServiceService,
    @Inject(MESSAGE_BROKER) private readonly messageBroker: ClientProxy,
  ) {}

  @EventPattern('alarm.created')
  async create(@Payload() data: { name: string }) {
    // Orchestration

    const alarmClassify = await lastValueFrom(
      this.messageBroker.send('alarm.classify', data),
    );

    console.log(alarmClassify);

    this.logger.debug(
      `Alarm: [${data.name}]. Classification: [${alarmClassify.category}]`,
    );

    const notify$ = this.messageBroker.emit('notification.send', {
      alarm: data,
      category: alarmClassify.category,
    });

    this.logger.debug(`Dispatched [notification.send]`);
  }
}
