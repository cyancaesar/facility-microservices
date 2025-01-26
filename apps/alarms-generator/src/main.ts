import { NestFactory } from '@nestjs/core';
import { AlarmsGeneratorModule } from './alarms-generator.module';

/**
 * Standalone Nest application
 */
async function bootstrap() {
  await NestFactory.createApplicationContext(AlarmsGeneratorModule);
}
bootstrap();
