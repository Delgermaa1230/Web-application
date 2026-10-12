export function databaseDriver(env = process.env) {
  const driver = env.DATABASE_DRIVER || (env.RENDER ? 'postgres' : 'sqlite');
  if (driver !== 'sqlite' && driver !== 'postgres') {
    throw new Error('DATABASE_DRIVER must be sqlite or postgres');
  }
  if (env.RENDER && driver !== 'postgres') {
    throw new Error('Render requires DATABASE_DRIVER=postgres');
  }
  if (driver === 'postgres' && !env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set for Postgres');
  }
  return driver;
}
