import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

declare global {
  var _prismaClient: PrismaClient | undefined;
  var _postgresPool: Pool | undefined;
}

/**
 * Resolves the PostgreSQL connection string dynamically.
 * Supports standard connection strings as well as Google Cloud SQL Unix domain sockets.
 */
export function getDatabaseUrl(): string {
  const host = process.env.SQL_HOST;
  const user = process.env.SQL_USER || 'ai_studio_app_user';
  const password = process.env.SQL_PASSWORD || '';
  const db = process.env.SQL_DB_NAME || 'cloud_sql_development_database';
  const port = process.env.SQL_PORT || 5432;

  let url: string;
  if (process.env.DATABASE_URL) {
    url = process.env.DATABASE_URL;
  } else if (host && host.startsWith('/')) {
    url = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@localhost/${encodeURIComponent(db)}?host=${encodeURIComponent(host)}`;
  } else if (host) {
    url = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(db)}`;
  } else {
    url = 'postgresql://postgres:postgres@127.0.0.1:5432/postgres';
  }

  // Ensure production connection timeouts for Cloud SQL scale-to-zero recovery
  if (!url.includes('connect_timeout=')) {
    url += (url.includes('?') ? '&' : '?') + 'connect_timeout=30';
  }
  if (!url.includes('pool_timeout=')) {
    url += '&pool_timeout=30';
  }
  if (!url.includes('connection_limit=')) {
    url += '&connection_limit=15';
  }

  return url;
}

// Synchronize environment variable for Prisma
process.env.DATABASE_URL = getDatabaseUrl();

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
