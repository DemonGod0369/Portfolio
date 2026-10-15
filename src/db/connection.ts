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
 * Factory for creating a PrismaClient instance.
 */
export function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

/**
 * Closes and releases any existing PostgreSQL pool instance.
 */
export async function resetPool(): Promise<void> {
  if (global._postgresPool) {
    const stalePool = global._postgresPool;
    global._postgresPool = undefined;
    try {
      await stalePool.end();
    } catch {
      // Discard pool teardown error
    }
  }
}

/**
 * Reconnects Prisma when a Cloud SQL socket has closed due to inactivity or scale-to-zero.
 */
export async function reconnectPrisma(): Promise<PrismaClient> {
  const stale = global._prismaClient;
  global._prismaClient = undefined;
  if (stale) {
    try {
      await Promise.race([
        stale.$disconnect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('disconnect timeout')), 2000)),
      ]);
    } catch {
      // Discard socket disconnect errors
    }
  }

  const fresh = createPrismaClient();
  global._prismaClient = fresh;
  try {
    await Promise.race([
      fresh.$connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('connect timeout')), 6000)),
    ]);
  } catch {
    // Next query will connect automatically
  }
  return fresh;
}

/**
 * Creates or retrieves the pg Pool connection with auto-eviction on idle client errors.
 */
export const createPool = (forceFresh = false): Pool => {
  if (forceFresh && global._postgresPool) {
    try {
      global._postgresPool.end().catch(() => {});
    } catch {
      // Discard error
    }
    global._postgresPool = undefined;
  }

  if (!global._postgresPool) {
    const host = process.env.SQL_HOST;
    const isSocket = host && host.startsWith('/');

    global._postgresPool = new Pool(
      isSocket
        ? {
            host,
            user: process.env.SQL_USER || 'ai_studio_app_user',
            password: process.env.SQL_PASSWORD || '',
            database: process.env.SQL_DB_NAME || 'cloud_sql_development_database',
            max: 5,
            idleTimeoutMillis: 5000,
            connectionTimeoutMillis: 15000,
            keepAlive: true,
            keepAliveInitialDelayMillis: 2000,
          }
        : {
            connectionString: getDatabaseUrl(),
            max: 5,
            idleTimeoutMillis: 5000,
            connectionTimeoutMillis: 15000,
            keepAlive: true,
            keepAliveInitialDelayMillis: 2000,
          }
    );

    global._postgresPool.on('error', (err) => {
      console.warn('[SQL Pool Client Error] Discarding stale pool after idle disconnect:', err.message);
      try {
        global._postgresPool?.end().catch(() => {});
      } catch {
        // Discard cleanup errors
      }
      global._postgresPool = undefined;
    });
  }
  return global._postgresPool;
};

// Initialize singleton if not already present
if (!global._prismaClient) {
  global._prismaClient = createPrismaClient();
}

/**
 * Resilient Prisma proxy that dynamically routes calls to the active PrismaClient instance.
 * Allows transparent re-instantiation and reconnection without breaking existing imports.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    if (!global._prismaClient) {
      global._prismaClient = createPrismaClient();
    }
    const client = global._prismaClient as unknown as Record<string | symbol, unknown>;
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
});

export default prisma;
