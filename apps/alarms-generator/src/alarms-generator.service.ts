import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Interval } from '@nestjs/schedule';
import { ALARMS_SERVICE } from './constants';

@Injectable()
export class AlarmsGeneratorService {
  constructor(
    @Inject(ALARMS_SERVICE) private readonly alarmsService: ClientProxy,
  ) {}

  @Interval(2000)
  dispatchAlarm() {
    console.log('Generating alarm...');
    this.alarmsService.emit('alarm.created', {
      name: 'ALARM',
      src: AlarmsGeneratorService.name,
      ts: new Date().getTime(),
    });
  }
}
