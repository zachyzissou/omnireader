import request from 'supertest';
import { beforeAll, afterAll, beforeEach, describe, expect, it } from '@jest/globals';

let app;
let db;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.DB_CLIENT = 'sqlite3';
  process.env.DB_FILENAME = ':memory:';

  const dbModule = await import('../db.js');
  db = dbModule.default;
  await db.migrate.latest();
  const { createApp } = await import('../app.js');
  ({ app } = await createApp());
});

beforeEach(async () => {
  await db('filters').del();
  await db('settings').del();
});

afterAll(async () => {
  await db.destroy();
});

describe('Smart Filters API', () => {
  it('returns empty list when no filters exist', async () => {
    const response = await request(app).get('/api/filters');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('creates, updates, and deletes a filter', async () => {
    const createResponse = await request(app)
      .post('/api/filters')
      .send({ field: 'type', operator: 'equals', value: 'music' });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({ field: 'type', operator: 'equals', value: 'music' });
    const filterId = createResponse.body.id;
    expect(filterId).toBeDefined();

    const listResponse = await request(app).get('/api/filters');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const updateResponse = await request(app)
      .put(`/api/filters/${filterId}`)
      .send({ field: 'type', operator: 'contains', value: 'mix' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({ field: 'type', operator: 'contains', value: 'mix' });

    const deleteResponse = await request(app).delete(`/api/filters/${filterId}`);
    expect(deleteResponse.status).toBe(204);

    const afterDelete = await request(app).get('/api/filters');
    expect(afterDelete.status).toBe(200);
    expect(afterDelete.body).toEqual([]);
  });

  it('validates payloads', async () => {
    const badResponse = await request(app)
      .post('/api/filters')
      .send({ field: '', operator: 'invalid', value: 42 });

    expect(badResponse.status).toBe(400);
    expect(badResponse.body).toHaveProperty('message');
  });

  it('persists onboarding settings', async () => {
    const setResponse = await request(app)
      .put('/api/settings/onboarding')
      .send({ value: { completed: true, steps: { accounts: ['spotify'] } } });

    expect(setResponse.status).toBe(200);
    expect(setResponse.body).toMatchObject({
      key: 'onboarding',
      value: {
        completed: true,
        steps: {
          accounts: ['spotify'],
        },
      },
    });

    const getResponse = await request(app).get('/api/settings/onboarding');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.value.completed).toBe(true);
  });

  it('returns feed snapshot with expected keys', async () => {
    const response = await request(app).get('/api/feeds');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('music');
    expect(Array.isArray(response.body.music)).toBe(true);

    const musicFeed = await request(app).get('/api/feeds/music');
    expect(musicFeed.status).toBe(200);
    expect(musicFeed.body).toMatchObject({ feed: 'music' });
    expect(Array.isArray(musicFeed.body.items)).toBe(true);
  });
});
