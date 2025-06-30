import { Test, TestingModule } from '@nestjs/testing';
import { SolarController } from './solar.controller';
import { SolarService } from './solar.service';
import { SolarMeasurement } from './entities/solar-measurement.entity';

describe('SolarController', () => {
  let controller: SolarController;

  const mockSolarService = {
    getTodayMeasurements: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolarController],
      providers: [
        {
          provide: SolarService,
          useValue: mockSolarService,
        },
      ],
    }).compile();

    controller = module.get<SolarController>(SolarController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getToday', () => {
    it("should return today's solar measurements", async () => {
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

      mockSolarService.getTodayMeasurements.mockResolvedValue(mockMeasurements);

      const result = await controller.getToday();

      expect(result).toEqual(mockMeasurements);
      expect(mockSolarService.getTodayMeasurements).toHaveBeenCalled();
    });

    it('should return empty array when no measurements for today', async () => {
      mockSolarService.getTodayMeasurements.mockResolvedValue([]);

      const result = await controller.getToday();

      expect(result).toEqual([]);
      expect(mockSolarService.getTodayMeasurements).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockSolarService.getTodayMeasurements.mockRejectedValue(error);

      await expect(controller.getToday()).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockSolarService.getTodayMeasurements).toHaveBeenCalled();
    });
  });
});
