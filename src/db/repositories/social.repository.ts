import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

export async function getSocialLinks(publishedOnly = false) {
  const rows = await prisma.socialLink.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(formatRow);
}

export async function createSocialLink(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  const created = await prisma.socialLink.create({
    data: {
      platform: createData.platform || '',
      label: createData.label || '',
      url: createData.url || '',
      icon: createData.icon ?? null,
      displayOrder: createData.displayOrder ?? 0,
      published: createData.published ?? true,
    },
  });
  return formatRow(created);
}

export async function updateSocialLink(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
  const updated = await prisma.socialLink.update({
    where: { id: numericId },
    data: updateData,
  });
  return formatRow(updated);
}

export async function deleteSocialLink(id: string | number) {
  const numericId = parseId(id);
  const deleted = await prisma.socialLink.delete({
    where: { id: numericId },
  });
  return formatRow(deleted);
}
