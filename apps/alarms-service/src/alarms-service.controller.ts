import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { AlarmsServiceService } from './alarms-service.service';
import { NATS_MESSAGE_BROKER, NOTIFICATIONS_SERVICE } from './constants';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AlarmsServiceController {
  private readonly logger = new Logger(AlarmsServiceController.name);
  constructor(
    private readonly alarmsServiceService: AlarmsServiceService,
    @Inject(NATS_MESSAGE_BROKER)
    private readonly natsMessageBroker: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  @EventPattern('alarm.created')
  async create(@Payload() data: { name: string }) {
    // Orchestration
    console.log('Alarm captured...');

    const alarmClassify = await lastValueFrom(
      this.natsMessageBroker.send('alarm.classify', data),
    );

    console.log(alarmClassify);

    this.logger.debug(
      `Alarm: [${data.name}]. Classification: [${alarmClassify.category}]`,
    );

    const notify$ = this.notificationsService.emit('notification.send', {
      alarm: data,
      category: alarmClassify.category,
    });

    this.logger.debug(`Dispatched [notification.send]`);
  }
}
