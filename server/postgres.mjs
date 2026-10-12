import { neon } from '@neondatabase/serverless';
import { assertPostgresMigrated } from './migrations.mjs';

export function postgresAdapter(client) {
  return {
    prepare(sql) {
      let index = 0;
      const query = sql.replace(/\?/g, () => `$${++index}`);
      return {
        async get(...values) { return (await client.query(query, values))[0] ?? null; },
        async all(...values) { return client.query(query, values); },
        async run(...values) { return client.query(query, values); },
      };
    },
    async close() {},
  };
}

export async function openPostgres(connectionString) {
  if (!connectionString) throw new Error('DATABASE_URL is required');
  const sql = neon(connectionString);
  await sql.query('SELECT 1');
  await assertPostgresMigrated(sql);
  await sql.query(`SELECT setval(pg_get_serial_sequence('tutors', 'teacher_id'),
      GREATEST((SELECT COALESCE(MAX(teacher_id), 1) FROM tutors), 1),
      EXISTS(SELECT 1 FROM tutors))`);
  return postgresAdapter(sql);
}
