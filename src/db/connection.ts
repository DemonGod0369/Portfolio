import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var _prismaClient: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var _postgresPool: Pool | undefined;
}

/**
 * Resolves the PostgreSQL connection string dynamically.
 * Supports standard connection strings as well as Google Cloud SQL Unix domain sockets.
 */
export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.SQL_HOST;
  const user = process.env.SQL_USER || 'ai_studio_app_user';
  const password = process.env.SQL_PASSWORD || '';
  const db = process.env.SQL_DB_NAME || 'cloud_sql_development_database';
  const port = process.env.SQL_PORT || 5432;

  if (host && host.startsWith('/')) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@localhost/${encodeURIComponent(db)}?host=${encodeURIComponent(host)}`;
  } else if (host) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(db)}`;
  }

  return 'postgresql://postgres:postgres@127.0.0.1:5432/postgres';
}

// Synchronize environment variable for Prisma
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = getDatabaseUrl();
}

/**
 * Creates or retrieves the singleton pg Pool connection.
 * Used for DDL execution, direct migrations, and batch seeding.
 */
export const createPool = (): Pool => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

/**
 * Singleton PrismaClient connection.
 * Avoids exhausting database connection pool during development hot reloads.
 */
export const prisma =
  global._prismaClient ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global._prismaClient = prisma;
}

export default prisma;
