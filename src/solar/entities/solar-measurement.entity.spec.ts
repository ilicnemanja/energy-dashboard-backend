import { SolarMeasurement } from './solar-measurement.entity';

describe('SolarMeasurement Entity', () => {
  it('should create a solar measurement instance', () => {
    const measurement = new SolarMeasurement();

    measurement.id = 1;
    measurement.timestamp = new Date('2024-01-01T12:00:00Z');
    measurement.production_kWh = 5.5;
    measurement.battery_percent = 85.0;
    measurement.grid_export_kWh = 2.3;

    expect(measurement).toBeInstanceOf(SolarMeasurement);
    expect(measurement.id).toBe(1);
    expect(measurement.timestamp).toEqual(new Date('2024-01-01T12:00:00Z'));
    expect(measurement.production_kWh).toBe(5.5);
    expect(measurement.battery_percent).toBe(85.0);
    expect(measurement.grid_export_kWh).toBe(2.3);
  });

  it('should handle zero values correctly', () => {
    const measurement = new SolarMeasurement();

    measurement.id = 2;
    measurement.timestamp = new Date('2024-01-01T00:00:00Z');
    measurement.production_kWh = 0.0;
    measurement.battery_percent = 0.0;
    measurement.grid_export_kWh = 0.0;

    expect(measurement.production_kWh).toBe(0.0);
    expect(measurement.battery_percent).toBe(0.0);
    expect(measurement.grid_export_kWh).toBe(0.0);
  });

  it('should handle high values correctly', () => {
    const measurement = new SolarMeasurement();

    measurement.id = 3;
    measurement.timestamp = new Date('2024-06-21T13:00:00Z'); // Summer solstice
    measurement.production_kWh = 15.8; // High production
    measurement.battery_percent = 100.0; // Full battery
    measurement.grid_export_kWh = 10.2; // High export

    expect(measurement.production_kWh).toBe(15.8);
    expect(measurement.battery_percent).toBe(100.0);
    expect(measurement.grid_export_kWh).toBe(10.2);
  });

  it('should handle decimal precision correctly', () => {
    const measurement = new SolarMeasurement();

    measurement.id = 4;
    measurement.timestamp = new Date();
    measurement.production_kWh = 3.14159;
    measurement.battery_percent = 87.654;
    measurement.grid_export_kWh = 1.23456;

    expect(measurement.production_kWh).toBe(3.14159);
    expect(measurement.battery_percent).toBe(87.654);
    expect(measurement.grid_export_kWh).toBe(1.23456);
  });
});
