import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { openDatabase } from './server/database.mjs';
import { openPostgres } from './server/postgres.mjs';
import { databaseDriver } from './server/config.mjs';
import { createApp } from './server/webapp.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const databasePath = process.env.DATABASE_PATH || join(root, 'data', 'numteach.sqlite');
const driver = databaseDriver();
const db = driver === 'postgres'
  ? await openPostgres(process.env.DATABASE_URL)
  : openDatabase(databasePath, { demoData: process.env.NODE_ENV !== 'production' });
const app = createApp(db);
const port = Number(process.env.PORT) || 3100;

app.listen(port, () => console.log(`Numteach (${driver}): http://localhost:${port}`));
