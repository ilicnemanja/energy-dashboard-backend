// NestJS Essential
import { Module } from '@nestjs/common';

// Controllers
import { SolarController } from './solar.controller';

// Services
import { SolarService } from './solar.service';

// ORM Module
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { SolarMeasurement } from './entities/solar-measurement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SolarMeasurement])],
  providers: [SolarService],
  controllers: [SolarController],
})
export class SolarModule {}
