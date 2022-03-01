import { Get, Controller, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AlertGateway } from 'src/alert.gateway';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(private alertWS: AlertGateway) {}
  @Get('alive')
  @HttpCode(200)
  alive(): string {
    this.alertWS.sendToAll('ALIVE');
    return 'OK';
  }

  @Get('dead')
  @HttpCode(500)
  dead(): string {
    this.alertWS.sendToAll('DEAD');
    return 'DEAD';
  }
}
