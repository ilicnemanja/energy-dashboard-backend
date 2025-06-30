import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppService } from '../src/app.service';
import { SolarService } from '../src/solar/solar.service';
import { SolarMeasurement } from '../src/solar/entities/solar-measurement.entity';

/**
 * Factory for creating test modules with common mock providers
 */
export class TestModuleFactory {
  /**
   * Creates a test module for AppService with mocked dependencies
   */
  static async createAppServiceTestModule(): Promise<{
    module: TestingModule;
    service: AppService;
    mockDataSource: any;
  }> {
    const mockDataSource = {
      isInitialized: true,
      query: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    const service = module.get<AppService>(AppService);

    return { module, service, mockDataSource };
  }

  /**
   * Creates a test module for SolarService with mocked repository
   */
  static async createSolarServiceTestModule(): Promise<{
    module: TestingModule;
    service: SolarService;
    mockRepository: any;
  }> {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        SolarService,
        {
          provide: getRepositoryToken(SolarMeasurement),
          useValue: mockRepository,
        },
      ],
    }).compile();

    const service = module.get<SolarService>(SolarService);

    return { module, service, mockRepository };
  }
}

/**
 * Common Jest setup and teardown utilities
 */
export class TestSetup {
  /**
   * Sets up Jest environment for unit tests
   */
  static setupUnitTests(): void {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  }

  /**
   * Sets up Jest environment for integration tests
   */
  static setupIntegrationTests(): void {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    // Increase timeout for integration tests
    jest.setTimeout(30000);
  }

  /**
   * Mocks console methods to prevent log spam during tests
   */
  static mockConsole(): {
    consoleLog: jest.SpyInstance;
    consoleError: jest.SpyInstance;
    consoleWarn: jest.SpyInstance;
  } {
    const consoleLog = jest.spyOn(console, 'log').mockImplementation();
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

    return { consoleLog, consoleError, consoleWarn };
  }

  /**
   * Restores console methods
   */
  static restoreConsole(): void {
    jest.restoreAllMocks();
  }
}

/**
 * Database mock helpers
 */
export class DatabaseMock {
  /**
   * Creates a mock DataSource that simulates successful connection
   */
  static createMockDataSource(isInitialized = true): any {
    return {
      isInitialized,
      query: jest
        .fn()
        .mockResolvedValue([
          { table_name: 'solar_measurement' },
          { table_name: 'users' },
        ]),
      manager: {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      },
    };
  }

  /**
   * Creates a mock DataSource that simulates connection failure
   */
  static createFailingMockDataSource(): any {
    return {
      isInitialized: false,
      query: jest.fn().mockRejectedValue(new Error('Connection failed')),
      manager: {
        find: jest.fn().mockRejectedValue(new Error('Connection failed')),
        findOne: jest.fn().mockRejectedValue(new Error('Connection failed')),
        save: jest.fn().mockRejectedValue(new Error('Connection failed')),
        remove: jest.fn().mockRejectedValue(new Error('Connection failed')),
      },
    };
  }

  /**
   * Creates a mock Repository for SolarMeasurement
   */
  static createMockRepository(): any {
    return {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
      remove: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getOne: jest.fn().mockResolvedValue(null),
        getCount: jest.fn().mockResolvedValue(0),
      }),
    };
  }
}

/**
 * Error simulation helpers
 */
export class ErrorSimulator {
  /**
   * Creates a database connection error
   */
  static createDatabaseError(message = 'Database connection failed'): Error {
    return new Error(message);
  }

  /**
   * Creates a validation error
   */
  static createValidationError(message = 'Validation failed'): Error {
    const error = new Error(message);
    error.name = 'ValidationError';
    return error;
  }

  /**
   * Creates a timeout error
   */
  static createTimeoutError(message = 'Request timeout'): Error {
    const error = new Error(message);
    error.name = 'TimeoutError';
    return error;
  }
}

/**
 * Date and time testing utilities
 */
export class DateTestUtils {
  /**
   * Creates a date at a specific hour of today
   */
  static createTodayAt(hour: number, minute = 0): Date {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  }

  /**
   * Creates a date relative to today
   */
  static createRelativeDate(daysOffset: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date;
  }

  /**
   * Freezes time at a specific date for testing
   */
  static freezeTime(date: Date): jest.SpyInstance {
    return jest.spyOn(Date, 'now').mockReturnValue(date.getTime());
  }

  /**
   * Unfreezes time
   */
  static unfreezeTime(): void {
    jest.restoreAllMocks();
  }
}
