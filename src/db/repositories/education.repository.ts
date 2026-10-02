import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

export async function getEducations(publishedOnly = false) {
  const rows = await prisma.education.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(formatRow);
}

export async function createEducation(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  const created = await prisma.education.create({
    data: {
      institution: createData.institution || '',
      qualification: createData.qualification || '',
      field: createData.field ?? null,
      location: createData.location ?? null,
      startDate: createData.startDate ?? null,
      endDate: createData.endDate ?? null,
      description: createData.description ?? null,
      displayOrder: createData.displayOrder ?? 0,
      published: createData.published ?? true,
    },
  });
  return formatRow(created);
}

export async function updateEducation(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
  const updated = await prisma.education.update({
    where: { id: numericId },
    data: updateData,
  });
  return formatRow(updated);
}

export async function deleteEducation(id: string | number) {
  const numericId = parseId(id);
  const deleted = await prisma.education.delete({
    where: { id: numericId },
  });
  return formatRow(deleted);
}
