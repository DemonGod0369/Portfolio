import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

export async function getGalleryImages(publishedOnly = false) {
  const rows = await prisma.galleryImage.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(formatRow);
}

export async function createGalleryImage(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  const created = await prisma.galleryImage.create({
    data: {
      url: createData.url || '',
      altText: createData.altText || '',
      caption: createData.caption ?? null,
      category: createData.category ?? null,
      width: createData.width ?? null,
      height: createData.height ?? null,
      featured: createData.featured ?? false,
      published: createData.published ?? true,
      displayOrder: createData.displayOrder ?? 0,
    },
  });
  return formatRow(created);
}

export async function updateGalleryImage(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
  const updated = await prisma.galleryImage.update({
    where: { id: numericId },
    data: updateData,
  });
  return formatRow(updated);
}

export async function deleteGalleryImage(id: string | number) {
  const numericId = parseId(id);
  const deleted = await prisma.galleryImage.delete({
    where: { id: numericId },
  });
  return formatRow(deleted);
}
