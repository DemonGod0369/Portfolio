import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

export async function getContentCategories() {
  const rows = await prisma.contentCategory.findMany({
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(formatRow);
}

export async function createContentCategory(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  const created = await prisma.contentCategory.create({
    data: {
      name: createData.name || '',
      slug: createData.slug || '',
      type: createData.type || 'GENERAL',
      description: createData.description ?? null,
      displayOrder: createData.displayOrder ?? 0,
    },
  });
  return formatRow(created);
}

export async function updateContentCategory(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
  const updated = await prisma.contentCategory.update({
    where: { id: numericId },
    data: updateData,
  });
  return formatRow(updated);
}

export async function deleteContentCategory(id: string | number) {
  const numericId = parseId(id);
  const deleted = await prisma.contentCategory.delete({
    where: { id: numericId },
  });
  return formatRow(deleted);
}
