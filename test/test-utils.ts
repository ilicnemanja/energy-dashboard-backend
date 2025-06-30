import { SolarMeasurement } from '../src/solar/entities/solar-measurement.entity';

/**
 * Test utilities for creating mock data and common test helpers
 */
export class TestUtils {
  /**
   * Creates a mock SolarMeasurement with default or provided values
   */
  static createMockSolarMeasurement(
    overrides: Partial<SolarMeasurement> = {},
  ): SolarMeasurement {
    const measurement = new SolarMeasurement();

    measurement.id = overrides.id ?? 1;
    measurement.timestamp =
      overrides.timestamp ?? new Date('2024-01-01T12:00:00Z');
    measurement.production_kWh = overrides.production_kWh ?? 5.0;
    measurement.battery_percent = overrides.battery_percent ?? 85.0;
    measurement.grid_export_kWh = overrides.grid_export_kWh ?? 2.0;

    return measurement;
  }

  /**
   * Creates multiple mock SolarMeasurement instances for testing
   */
  static createMockSolarMeasurements(count: number): SolarMeasurement[] {
    const measurements: SolarMeasurement[] = [];
    const baseDate = new Date('2024-01-01T08:00:00Z');

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(baseDate.getTime() + i * 60 * 60 * 1000); // Hour intervals
      measurements.push(
        this.createMockSolarMeasurement({
          id: i + 1,
          timestamp,
          production_kWh: Math.random() * 10,
          battery_percent: 50 + Math.random() * 50, // 50-100%
          grid_export_kWh: Math.random() * 5,
        }),
      );
    }

    return measurements;
  }

  /**
   * Creates mock measurements for a specific day
   */
  static createMockMeasurementsForDay(date: Date): SolarMeasurement[] {
    const measurements: SolarMeasurement[] = [];
    const startOfDay = new Date(date);
    startOfDay.setHours(6, 0, 0, 0); // Start at 6 AM

    // Create measurements every 2 hours from 6 AM to 8 PM
    for (let hour = 6; hour <= 20; hour += 2) {
      const timestamp = new Date(startOfDay);
      timestamp.setHours(hour);

      // Simulate solar production curve (higher in middle of day)
      const hourFactor = Math.sin(((hour - 6) / 14) * Math.PI);
      const production = hourFactor * 8; // Max 8 kWh
      const batteryPercent = 50 + hourFactor * 40; // 50-90%
      const gridExport = production > 3 ? production - 3 : 0;

      measurements.push(
        this.createMockSolarMeasurement({
          id: measurements.length + 1,
          timestamp,
          production_kWh: Math.round(production * 100) / 100,
          battery_percent: Math.round(batteryPercent * 100) / 100,
          grid_export_kWh: Math.round(gridExport * 100) / 100,
        }),
      );
    }

    return measurements;
  }

  /**
   * Creates mock database health response
   */
  static createMockDbHealthResponse(
    status: 'OK' | 'ERROR' = 'OK',
    connection = true,
  ) {
    return {
      status,
      timestamp: new Date().toISOString(),
      tables: connection ? ['solar_measurement', 'users'] : [],
      connection,
    };
  }

  /**
   * Helper to create date at start of today
   */
  static getStartOfToday(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  /**
   * Helper to create date at end of today
   */
  static getEndOfToday(): Date {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return now;
  }

  /**
   * Helper to wait for a specified number of milliseconds
   */
  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Helper to generate random float between min and max
   */
  static randomFloat(min: number, max: number, decimals = 2): number {
    const value = Math.random() * (max - min) + min;
    return Math.round(value * 10 ** decimals) / 10 ** decimals;
  }
}

/**
 * Common test constants
 */
export const TEST_CONSTANTS = {
  MOCK_DATES: {
    PAST_DATE: new Date('2023-12-01T12:00:00Z'),
    TODAY: new Date(),
    FUTURE_DATE: new Date('2025-01-01T12:00:00Z'),
  },
  MOCK_VALUES: {
    MAX_PRODUCTION: 12.0,
    MIN_PRODUCTION: 0.0,
    MAX_BATTERY: 100.0,
    MIN_BATTERY: 0.0,
    MAX_EXPORT: 8.0,
    MIN_EXPORT: 0.0,
  },
} as const;
