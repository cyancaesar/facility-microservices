import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AlarmsClassifierServiceController {
  private readonly logger = new Logger(AlarmsClassifierServiceController.name);

  @MessagePattern('alarm.classify')
  classifyAlarm(@Payload() data: unknown) {
    this.logger.debug(
      `Received new [alarm.classify] message: ${JSON.stringify(data)}`,
    );

    const categories = ['critical', 'non-critical', 'false-alarm'];

    // Return randomly selected category
    return {
      category: this.randomSelection(categories),
    };
  }

  private randomSelection<T>(arr: Array<T>) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
