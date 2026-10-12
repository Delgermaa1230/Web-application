import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { databaseDriver } from '../server/config.mjs';

test('local startup uses SQLite even if a Neon URL is present', () => {
  assert.equal(databaseDriver({ DATABASE_URL: 'postgresql://example' }), 'sqlite');
});

test('explicit Postgres and Render require a URL', () => {
  assert.equal(databaseDriver({ DATABASE_DRIVER: 'postgres', DATABASE_URL: 'postgresql://example' }), 'postgres');
  assert.equal(databaseDriver({ RENDER: 'true', DATABASE_URL: 'postgresql://example' }), 'postgres');
  assert.throws(() => databaseDriver({ DATABASE_DRIVER: 'postgres' }), /DATABASE_URL/);
  assert.throws(() => databaseDriver({ RENDER: 'true' }), /DATABASE_URL/);
  assert.throws(() => databaseDriver({ RENDER: 'true', DATABASE_DRIVER: 'sqlite' }), /Render requires/);
});
