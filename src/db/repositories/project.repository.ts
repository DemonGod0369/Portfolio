import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

export async function getProjects(publishedOnly = false) {
  const rows = await prisma.project.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { displayOrder: 'asc' },
    include: {
      images: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  return rows.map(p => ({
    ...formatRow(p),
    images: p.images.map(formatRow),
  }));
}

export async function createProject(data: any) {
  const { id: _, images, createdAt: __, updatedAt: ___, ...createData } = data;
  const created = await prisma.project.create({
    data: {
      title: createData.title || '',
      slug: createData.slug || '',
      category: createData.category ?? null,
      shortSummary: createData.shortSummary ?? null,
      overview: createData.overview ?? null,
      problem: createData.problem ?? null,
      approach: createData.approach ?? null,
      design: createData.design ?? null,
      technology: createData.technology ?? null,
      result: createData.result ?? null,
      heroImage: createData.heroImage ?? null,
      liveUrl: createData.liveUrl ?? null,
      githubUrl: createData.githubUrl ?? null,
      seoTitle: createData.seoTitle ?? null,
      seoDescription: createData.seoDescription ?? null,
      canonicalUrl: createData.canonicalUrl ?? null,
      featured: createData.featured ?? false,
      published: createData.published ?? true,
      displayOrder: createData.displayOrder ?? 0,
    },
  });

  const insertedImages: any[] = [];
  if (Array.isArray(images) && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const createdImg = await prisma.projectImage.create({
        data: {
          projectId: created.id,
          url: img.url,
          altText: img.altText ?? null,
          caption: img.caption ?? null,
          width: img.width ?? null,
          height: img.height ?? null,
          displayOrder: img.displayOrder ?? i,
        },
      });
      insertedImages.push(formatRow(createdImg));
    }
  }

  return {
    ...formatRow(created),
    images: insertedImages,
  };
}

export async function updateProject(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, images, createdAt: __, updatedAt: ___, ...updateData } = data;

  const updated = await prisma.project.update({
    where: { id: numericId },
    data: updateData,
  });

  if (Array.isArray(images)) {
    await prisma.projectImage.deleteMany({
      where: { projectId: numericId },
    });

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await prisma.projectImage.create({
        data: {
          projectId: numericId,
          url: img.url,
          altText: img.altText ?? null,
          caption: img.caption ?? null,
          width: img.width ?? null,
          height: img.height ?? null,
          displayOrder: img.displayOrder ?? i,
        },
      });
    }
  }

  const refreshedImages = await prisma.projectImage.findMany({
    where: { projectId: numericId },
    orderBy: { displayOrder: 'asc' },
  });

  return {
    ...formatRow(updated),
    images: refreshedImages.map(formatRow),
  };
}

export async function deleteProject(id: string | number) {
  const numericId = parseId(id);
  // Delete project images first or let cascade delete
  await prisma.projectImage.deleteMany({
    where: { projectId: numericId },
  });
  const deleted = await prisma.project.delete({
    where: { id: numericId },
  });
  return formatRow(deleted);
}
