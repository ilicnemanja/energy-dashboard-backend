import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
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

  describe('GET /', () => {
    it('should return "Hello World!"', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('GET /health', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'OK');
          expect(res.body).toHaveProperty('timestamp');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(typeof res.body?.timestamp).toBe('string');
        });
    });
  });

  describe('GET /db-health', () => {
    it('should return database health status', () => {
      return request(app.getHttpServer())
        .get('/db-health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('tables');
          expect(res.body).toHaveProperty('connection');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(Array.isArray(res.body?.tables)).toBe(true);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(typeof res.body?.connection).toBe('boolean');
        });
    });
  });
});
