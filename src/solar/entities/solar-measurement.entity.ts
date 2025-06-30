import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SolarMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column('float')
  production_kWh: number;

  @Column('float')
  battery_percent: number;

  @Column('float')
  grid_export_kWh: number;
}
