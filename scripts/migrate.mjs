import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import { migratePostgres, migrateSqlite } from '../server/migrations.mjs';
import { databaseDriver } from '../server/config.mjs';

const sqliteOnly = process.argv.includes('--sqlite');
const postgresOnly = process.argv.includes('--postgres');
if (sqliteOnly && postgresOnly) throw new Error('Choose --sqlite or --postgres, not both');

const usePostgres = postgresOnly || (!sqliteOnly && databaseDriver() === 'postgres');
if (usePostgres && !process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for Postgres migrations');

if (usePostgres) {
  const sql = neon(process.env.DATABASE_URL);
  await migratePostgres(sql);
  console.log('Postgres migrations applied.');
} else {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const file = process.env.DATABASE_PATH || join(root, 'data', 'numteach.sqlite');
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  try {
    migrateSqlite(db);
    console.log('SQLite migrations applied.');
  } finally {
    db.close();
  }
}
