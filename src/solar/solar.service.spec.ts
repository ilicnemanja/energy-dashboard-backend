import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SolarService } from './solar.service';
import { SolarMeasurement } from './entities/solar-measurement.entity';

describe('SolarService', () => {
  let service: SolarService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolarService,
        {
          provide: getRepositoryToken(SolarMeasurement),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SolarService>(SolarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTodayMeasurements', () => {
    it('should return measurements for today', async () => {
      const mockMeasurements: SolarMeasurement[] = [
        {
          id: 1,
          timestamp: new Date('2024-01-01T08:00:00Z'),
          production_kWh: 2.5,
          battery_percent: 85.0,
          grid_export_kWh: 1.2,
        },
        {
          id: 2,
          timestamp: new Date('2024-01-01T12:00:00Z'),
          production_kWh: 5.8,
          battery_percent: 92.0,
          grid_export_kWh: 3.1,
        },
      ];

      mockRepository.find.mockResolvedValue(mockMeasurements);

      const result = await service.getTodayMeasurements();

      expect(result).toEqual(mockMeasurements);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { timestamp: 'ASC' },
        }),
      );
    });

    it('should return empty array when no measurements exist for today', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getTodayMeasurements();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.find.mockRejectedValue(error);

      await expect(service.getTodayMeasurements()).rejects.toThrow(
        'Database error',
      );
    });

    it('should call repository find method with correct ordering', async () => {
      const mockMeasurements: SolarMeasurement[] = [
        {
          id: 1,
          timestamp: new Date('2024-01-01T00:30:00Z'),
          production_kWh: 0.1,
          battery_percent: 75.0,
          grid_export_kWh: 0.0,
        },
      ];

      mockRepository.find.mockResolvedValue(mockMeasurements);

      const result = await service.getTodayMeasurements();

      expect(result).toEqual(mockMeasurements);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { timestamp: 'ASC' },
        }),
      );
    });
  });
});
