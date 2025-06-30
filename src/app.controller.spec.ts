import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getHello: jest.fn(),
    checkDatabaseHealth: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      mockAppService.getHello.mockReturnValue('Hello World!');

      const result = appController.getHello();

      expect(result).toBe('Hello World!');
      expect(mockAppService.getHello).toHaveBeenCalled();
    });
  });

  describe('healthCheck', () => {
    it('should return health status with timestamp', () => {
      const result = appController.healthCheck();

      expect(result).toHaveProperty('status', 'OK');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('dbHealthCheck', () => {
    it('should return database health status when connection is OK', async () => {
      const mockDbHealth = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        tables: ['solar_measurement', 'users'],
        connection: true,
      };

      mockAppService.checkDatabaseHealth.mockResolvedValue(mockDbHealth);

      const result = await appController.dbHealthCheck();

      expect(result).toEqual(mockDbHealth);
      expect(mockAppService.checkDatabaseHealth).toHaveBeenCalled();
    });

    it('should return database health status when connection fails', async () => {
      const mockDbHealth = {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        tables: [],
        connection: false,
      };

      mockAppService.checkDatabaseHealth.mockResolvedValue(mockDbHealth);

      const result = await appController.dbHealthCheck();

      expect(result).toEqual(mockDbHealth);
      expect(result.connection).toBe(false);
      expect(result.tables).toEqual([]);
    });
  });
});
