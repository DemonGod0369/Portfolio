import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const config = process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          host: process.env.SQL_HOST || 'localhost',
          port: Number(process.env.SQL_PORT) || 5432,
          user: process.env.SQL_USER || 'postgres',
          password: process.env.SQL_PASSWORD || '',
          database: process.env.SQL_DB_NAME || 'portfolio_db',
        };

    global._postgresPool = new Pool({
      ...config,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
