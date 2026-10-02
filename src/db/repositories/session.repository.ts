import { prisma } from '../connection.ts';
import { formatRow } from './common.ts';

export async function getAdminSessions() {
  const rows = await prisma.adminSession.findMany({
    orderBy: { lastActiveAt: 'desc' },
  });
  return rows.map(formatRow);
}

export async function upsertAdminSession(session: {
  id: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress?: string;
  location?: string;
  screenResolution?: string;
}) {
  const result = await prisma.adminSession.upsert({
    where: { id: session.id },
    create: {
      id: session.id,
      deviceType: session.deviceType,
      browser: session.browser,
      os: session.os,
      ipAddress: session.ipAddress ?? null,
      location: session.location ?? null,
      screenResolution: session.screenResolution ?? null,
      lastActiveAt: new Date(),
    },
    update: {
      lastActiveAt: new Date(),
      location: session.location ?? null,
      screenResolution: session.screenResolution ?? null,
    },
  });
  return formatRow(result);
}

export async function deleteAdminSession(id: string) {
  await prisma.adminSession.delete({
    where: { id },
  });
  return { success: true };
}

export async function deleteAllAdminSessions() {
  await prisma.adminSession.deleteMany({});
  return { success: true };
}
