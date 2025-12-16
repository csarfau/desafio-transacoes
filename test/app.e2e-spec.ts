import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../src/infrastructure/http/filters/all-exceptions.filter';

describe('Transaction API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions (POST) - should create a transaction', () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 50.0,
        timestamp: new Date().toISOString(),
      })
      .expect(201);
  });

  it('/transactions (POST) - should reject future date', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);

    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 50.0,
        timestamp: futureDate.toISOString(),
      })
      .expect(422);
  });

  it('/transactions (POST) - should reject non-JSON content type (415)', () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .set('Content-Type', 'text/plain')
      .send('amount=10&timestamp=2024-01-01')
      .expect(400);
  });

  it('/statistics (GET) - should return stats', async () => {
    await request(app.getHttpServer()).delete('/transactions').expect(200);

    await request(app.getHttpServer())
      .post('/transactions')
      .send({ amount: 100, timestamp: new Date().toISOString() })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/statistics')
      .expect(200);

    expect(response.body).toEqual({
      count: 1,
      sum: 100,
      avg: 100,
      min: 100,
      max: 100,
    });
  });

  it('/transactions (DELETE) - should empty the database', async () => {
    return request(app.getHttpServer()).delete('/transactions').expect(200);
  });
});
