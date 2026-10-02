import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

// -------------------------------------------------------------
// SKILL CATEGORIES
// -------------------------------------------------------------
export async function getSkillCategories(publishedOnly = false) {
  const rows = await prisma.skillCategory.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(formatRow);
}

export async function createSkillCategory(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  const created = await prisma.skillCategory.create({
    data: {
      name: createData.name || '',
      slug: createData.slug || '',
      description: createData.description ?? null,
      displayOrder: createData.displayOrder ?? 0,
      published: createData.published ?? true,
    },
  });
  return formatRow(created);
}

export async function updateSkillCategory(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
  const updated = await prisma.skillCategory.update({
    where: { id: numericId },
    data: updateData,
  });
  return formatRow(updated);
}

export async function deleteSkillCategory(id: string | number) {
  const numericId = parseId(id);
  // Delete cascading skills first to satisfy foreign key constraint
  await prisma.skill.deleteMany({
    where: { categoryId: numericId },
  });
  const deleted = await prisma.skillCategory.delete({
    where: { id: numericId },
  });
  return formatRow(deleted);
}

// -------------------------------------------------------------
// SKILLS
// -------------------------------------------------------------
export async function getSkills(publishedOnly = false) {
  const rows = await prisma.skill.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(s => ({
    ...formatRow(s),
    categoryId: String(s.categoryId),
  }));
}

export async function createSkill(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  const categoryId = parseId(createData.categoryId);
  const created = await prisma.skill.create({
    data: {
      categoryId,
      name: createData.name || '',
      slug: createData.slug || '',
      description: createData.description ?? null,
      icon: createData.icon ?? null,
      displayOrder: createData.displayOrder ?? 0,
      published: createData.published ?? true,
    },
  });
  return {
    ...formatRow(created),
    categoryId: String(created.categoryId),
  };
}

export async function updateSkill(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
  if (updateData.categoryId !== undefined) {
    updateData.categoryId = parseId(updateData.categoryId);
  }
  const updated = await prisma.skill.update({
    where: { id: numericId },
    data: updateData,
  });
  return {
    ...formatRow(updated),
    categoryId: String(updated.categoryId),
  };
}

export async function deleteSkill(id: string | number) {
  const numericId = parseId(id);
  const deleted = await prisma.skill.delete({
    where: { id: numericId },
  });
  return {
    ...formatRow(deleted),
    categoryId: String(deleted.categoryId),
  };
}
