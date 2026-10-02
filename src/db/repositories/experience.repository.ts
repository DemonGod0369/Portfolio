import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

export async function getExperiences(publishedOnly = false) {
  const rows = await prisma.experience.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(formatRow);
}

export async function createExperience(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  const created = await prisma.experience.create({
    data: {
      category: createData.category || 'General',
      title: createData.title || '',
      roleTitle: createData.roleTitle ?? null,
      organization: createData.organization ?? null,
      location: createData.location ?? null,
      startDate: createData.startDate ?? null,
      endDate: createData.endDate ?? null,
      isCurrent: createData.isCurrent ?? false,
      shortDescription: createData.shortDescription ?? null,
      description: createData.description ?? null,
      tags: createData.tags || [],
      imageUrl: createData.imageUrl ?? null,
      featured: createData.featured ?? false,
      displayOrder: createData.displayOrder ?? 0,
      published: createData.published ?? true,
    },
  });
  return formatRow(created);
}

export async function updateExperience(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
  const updated = await prisma.experience.update({
    where: { id: numericId },
    data: updateData,
  });
  return formatRow(updated);
}

export async function deleteExperience(id: string | number) {
  const numericId = parseId(id);
  const deleted = await prisma.experience.delete({
    where: { id: numericId },
  });
  return formatRow(deleted);
}
