import { prisma } from '../connection.ts';
import { formatRow, parseId } from './common.ts';

export async function getBlogPosts(publishedOnly = false) {
  const rows = await prisma.blogPost.findMany({
    where: publishedOnly ? { status: 'PUBLISHED' } : undefined,
    orderBy: { publishedAt: 'desc' },
  });

  return rows.map(b => ({
    ...formatRow(b),
    publishedAt: b.publishedAt ? b.publishedAt.toISOString() : undefined,
  }));
}

export async function createBlogPost(data: any) {
  const { id: _, createdAt: __, updatedAt: ___, ...createData } = data;
  let categoryId = createData.categoryId ? parseId(createData.categoryId) : null;

  if (createData.category && !categoryId) {
    const slug = createData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cat = await prisma.blogCategory.upsert({
      where: { slug },
      update: { name: createData.category },
      create: {
        name: createData.category,
        slug,
        description: `${createData.category} insights and articles`,
      },
    });
    categoryId = cat.id;
  }

  const created = await prisma.blogPost.create({
    data: {
      title: createData.title || '',
      slug: createData.slug || '',
      excerpt: createData.excerpt ?? null,
      coverImageUrl: createData.coverImageUrl ?? null,
      content: createData.content || '',
      category: createData.category ?? null,
      categoryId,
      readingTime: createData.readingTime ?? null,
      publishedAt: createData.publishedAt ? new Date(createData.publishedAt) : null,
      status: createData.status || 'DRAFT',
      featured: createData.featured ?? false,
      tags: createData.tags || [],
      seoTitle: createData.seoTitle ?? null,
      seoDescription: createData.seoDescription ?? null,
      canonicalUrl: createData.canonicalUrl ?? null,
    },
  });

  return {
    ...formatRow(created),
    publishedAt: created.publishedAt ? created.publishedAt.toISOString() : undefined,
  };
}

export async function updateBlogPost(id: string | number, data: any) {
  const numericId = parseId(id);
  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;

  if (updateData.publishedAt !== undefined) {
    updateData.publishedAt = updateData.publishedAt ? new Date(updateData.publishedAt) : null;
  }
  if (updateData.categoryId !== undefined) {
    updateData.categoryId = updateData.categoryId ? parseId(updateData.categoryId) : null;
  }

  const updated = await prisma.blogPost.update({
    where: { id: numericId },
    data: updateData,
  });

  return {
    ...formatRow(updated),
    publishedAt: updated.publishedAt ? updated.publishedAt.toISOString() : undefined,
  };
}

export async function deleteBlogPost(id: string | number) {
  const numericId = parseId(id);
  const deleted = await prisma.blogPost.delete({
    where: { id: numericId },
  });
  return {
    ...formatRow(deleted),
    publishedAt: deleted.publishedAt ? deleted.publishedAt.toISOString() : undefined,
  };
}
