import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

export async function getServices(publishedOnly = false) {
  const rows = await prisma.service.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(formatRow);
}

export async function createService(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  const created = await prisma.service.create({
    data: {
      title: createData.title || '',
      slug: createData.slug || '',
      shortDescription: createData.shortDescription ?? null,
      description: createData.description ?? null,
      icon: createData.icon ?? null,
      displayOrder: createData.displayOrder ?? 0,
      featured: createData.featured ?? false,
      published: createData.published ?? true,
    },
  });
  return formatRow(created);
}

export async function updateService(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
  const updated = await prisma.service.update({
    where: { id: numericId },
    data: updateData,
  });
  return formatRow(updated);
}

export async function deleteService(id: string | number) {
  const numericId = parseId(id);
  const deleted = await prisma.service.delete({
    where: { id: numericId },
  });
  return formatRow(deleted);
}
