import { Controller, Get } from '@nestjs/common';
import { SolarService } from './solar.service';

@Controller('energy')
export class SolarController {
  constructor(private readonly service: SolarService) {}

  @Get('today')
  getToday() {
    return this.service.getTodayMeasurements();
  }
}
