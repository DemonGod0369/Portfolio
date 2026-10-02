import 'dotenv/config';

export { prisma, createPool, getDatabaseUrl, default } from './connection.ts';
export * from './queries.ts';
