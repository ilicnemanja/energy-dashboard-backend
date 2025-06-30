import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

describe('AppService', () => {
  let service: AppService;

  const mockDataSource = {
    isInitialized: true,
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const result = service.getHello();
      expect(result).toBe('Hello World!');
    });
  });

  describe('checkDatabaseHealth', () => {
    it('should return OK status when database is connected and has tables', async () => {
      const mockTables = [
        { table_name: 'solar_measurement' },
        { table_name: 'users' },
      ];

      mockDataSource.isInitialized = true;
      mockDataSource.query.mockResolvedValue(mockTables);

      const result = await service.checkDatabaseHealth();

      expect(result.status).toBe('OK');
      expect(result.connection).toBe(true);
      expect(result.tables).toEqual(['solar_measurement', 'users']);
      expect(result.timestamp).toBeDefined();
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });

    it('should return OK status when database is connected but has no tables', async () => {
      mockDataSource.isInitialized = true;
      mockDataSource.query.mockResolvedValue([]);

      const result = await service.checkDatabaseHealth();

      expect(result.status).toBe('OK');
      expect(result.connection).toBe(true);
      expect(result.tables).toEqual([]);
      expect(result.timestamp).toBeDefined();
    });

    it('should return ERROR status when database is not initialized', async () => {
      mockDataSource.isInitialized = false;

      const result = await service.checkDatabaseHealth();

      expect(result.status).toBe('ERROR');
      expect(result.connection).toBe(false);
      expect(result.tables).toEqual([]);
      expect(result.timestamp).toBeDefined();
      expect(mockDataSource.query).not.toHaveBeenCalled();
    });

    it('should return ERROR status when database query fails', async () => {
      mockDataSource.isInitialized = true;
      mockDataSource.query.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.checkDatabaseHealth();

      expect(result.status).toBe('ERROR');
      expect(result.connection).toBe(false);
      expect(result.tables).toEqual([]);
      expect(result.timestamp).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Database health check failed:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should handle database query with different table structures', async () => {
      const mockTables = [
        { table_name: 'solar_measurement' },
        { table_name: 'energy_logs' },
        { table_name: 'system_config' },
      ];

      mockDataSource.isInitialized = true;
      mockDataSource.query.mockResolvedValue(mockTables);

      const result = await service.checkDatabaseHealth();

      expect(result.status).toBe('OK');
      expect(result.connection).toBe(true);
      expect(result.tables).toEqual([
        'solar_measurement',
        'energy_logs',
        'system_config',
      ]);
    });
  });
});
