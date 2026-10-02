import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

export async function getContactMessages() {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(formatRow);
}

export async function submitContactMessage(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  const created = await prisma.contactMessage.create({
    data: {
      name: createData.name || '',
      email: createData.email || '',
      subject: createData.subject || '',
      message: createData.message || '',
      status: createData.status || 'NEW',
      ipHash: createData.ipHash ?? null,
      userAgent: createData.userAgent ?? null,
    },
  });
  return formatRow(created);
}

export async function updateContactMessageStatus(id: string | number, status: string) {
  const numericId = parseId(id);
  const updated = await prisma.contactMessage.update({
    where: { id: numericId },
    data: { status },
  });
  return formatRow(updated);
}

export async function deleteContactMessage(id: string | number) {
  const numericId = parseId(id);
  const deleted = await prisma.contactMessage.delete({
    where: { id: numericId },
  });
  return formatRow(deleted);
}
