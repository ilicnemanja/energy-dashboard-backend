import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('db-health')
  async dbHealthCheck(): Promise<{
    status: string;
    timestamp: string;
    tables: string[];
    connection: boolean;
  }> {
    return await this.appService.checkDatabaseHealth();
  }
}
