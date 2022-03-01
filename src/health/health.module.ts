import { Module } from '@nestjs/common';
import { AlertGateway } from 'src/alert.gateway';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [AlertGateway],
})
export class HealthModule {}
