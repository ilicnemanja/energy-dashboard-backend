import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('SolarController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /energy/today', () => {
    it("should return today's energy measurements", () => {
      return request(app.getHttpServer())
        .get('/energy/today')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // If there are measurements, check the structure
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (res.body.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const measurement = res.body[0];
            expect(measurement).toHaveProperty('id');
            expect(measurement).toHaveProperty('timestamp');
            expect(measurement).toHaveProperty('production_kWh');
            expect(measurement).toHaveProperty('battery_percent');
            expect(measurement).toHaveProperty('grid_export_kWh');
          }
        });
    });

    it('should return measurements in ascending timestamp order', () => {
      return request(app.getHttpServer())
        .get('/energy/today')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // If there are multiple measurements, check ordering
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (res.body.length > 1) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            for (let i = 1; i < res.body.length; i++) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
              const prevTimestamp = new Date(res.body[i - 1].timestamp);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
              const currentTimestamp = new Date(res.body[i].timestamp);
              expect(currentTimestamp.getTime()).toBeGreaterThanOrEqual(
                prevTimestamp.getTime(),
              );
            }
          }
        });
    });

    it('should handle empty results gracefully', () => {
      return request(app.getHttpServer())
        .get('/energy/today')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // This might be empty if no data exists for today
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.length).toBeGreaterThanOrEqual(0);
        });
    });
  });

  describe('GET /energy/invalid-endpoint', () => {
    it('should return 404 for non-existent endpoints', () => {
      return request(app.getHttpServer())
        .get('/energy/invalid-endpoint')
        .expect(404);
    });
  });
});
