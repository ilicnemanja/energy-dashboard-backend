import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { SolarMeasurement } from './entities/solar-measurement.entity';

@Injectable()
export class SolarService {
  constructor(
    @InjectRepository(SolarMeasurement)
    private repo: Repository<SolarMeasurement>,
  ) {}

  async getTodayMeasurements(): Promise<SolarMeasurement[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return this.repo.find({
      where: { timestamp: MoreThan(startOfDay) },
      order: { timestamp: 'ASC' },
    });
  }
}
