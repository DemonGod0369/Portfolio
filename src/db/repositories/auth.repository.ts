import { prisma } from '../connection.ts';
import { formatRow } from './common.ts';

export async function getAuditLogs(limitCount = 100) {
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limitCount,
  });
  return rows.map(l => ({
    ...formatRow(l),
    metadata: (l.metadata as Record<string, any>) || {},
  }));
}

export async function createAuditEntry(data: {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: any;
  ipHash?: string;
  userAgent?: string;
}) {
  const created = await prisma.auditLog.create({
    data: {
      userId: data.userId ?? null,
      action: data.action,
      entityType: data.entityType ?? null,
      entityId: data.entityId ?? null,
      metadata: data.metadata ?? null,
      ipHash: data.ipHash ?? null,
      userAgent: data.userAgent ?? null,
    },
  });
  return {
    ...formatRow(created),
    metadata: (created.metadata as Record<string, any>) || {},
  };
}

export async function verifyAdminLogin(email: string, passwordAttempt: string) {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    if (email === 'gunjanstha01@gmail.com' && passwordAttempt === 'gunjan2026') {
      const created = await prisma.user.create({
        data: {
          uid: 'admin_gunjan',
          email,
          passwordHash: 'gunjan2026',
          isActive: true,
          lastLoginAt: new Date(),
        },
      });
      return { success: true, email: created.email, message: 'Authentication successful', user: created };
    }
    return { success: false, message: 'User not found.', error: 'User not found.' };
  }

  if (user.passwordHash && user.passwordHash === passwordAttempt) {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    return { success: true, email: user.email, message: 'Authentication successful', user };
  }

  return { success: false, message: 'Invalid password.', error: 'Invalid password.' };
}

export async function updateAdminCredentials(currentEmail: string, newEmail?: string, newPassword?: string) {
  const user = await prisma.user.findFirst({
    where: { email: currentEmail },
  });

  if (!user) {
    return { success: false, error: 'Admin account not found.' };
  }

  const updateData: any = { updatedAt: new Date() };
  if (newEmail) updateData.email = newEmail;
  if (newPassword) updateData.passwordHash = newPassword;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });

  return { success: true, user: updated };
}
