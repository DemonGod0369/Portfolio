import { prisma } from '../connection.ts';
import { formatRow } from './common.ts';

export async function getPublicPortfolioData() {
  try {
    const [
      profile,
      experiences,
      educations,
      skillCategories,
      skills,
      services,
      projects,
      galleryImages,
      blogPosts,
      contentCategories,
      socialLinks,
      siteSettings,
    ] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.experience.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.education.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.skillCategory.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.skill.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.service.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.project.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      }),
      prisma.galleryImage.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.contentCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.socialLink.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.siteSetting.findFirst(),
    ]);

    const formattedProjects = projects.map(p => ({
      ...formatRow(p),
      images: p.images.map(formatRow),
    }));

    return {
      profile: profile ? formatRow(profile) : null,
      experiences: experiences.map(formatRow),
      educations: educations.map(formatRow),
      skillCategories: skillCategories.map(formatRow),
      skills: skills.map(s => ({ ...formatRow(s), categoryId: String(s.categoryId) })),
      services: services.map(formatRow),
      projects: formattedProjects,
      galleryImages: galleryImages.map(formatRow),
      blogPosts: blogPosts.map(b => ({
        ...formatRow(b),
        publishedAt: b.publishedAt ? b.publishedAt.toISOString() : undefined,
      })),
      contentCategories: contentCategories.map(formatRow),
      socialLinks: socialLinks.map(formatRow),
      siteSettings: siteSettings ? formatRow(siteSettings) : null,
    };
  } catch (error: any) {
    console.warn('Database query error in getPublicPortfolioData:', error?.message || error);
    throw new Error('Failed to retrieve portfolio data from database.', { cause: error });
  }
}

export async function getAllAdminPortfolioData() {
  try {
    const [
      profile,
      experiences,
      educations,
      skillCategories,
      skills,
      services,
      projects,
      galleryImages,
      blogPosts,
      contentCategories,
      socialLinks,
      siteSettings,
      contactMessages,
      auditLogs,
      adminSessions,
      users,
    ] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.experience.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.education.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.skillCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.skill.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.service.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.project.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      }),
      prisma.galleryImage.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.blogPost.findMany({
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.contentCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.socialLink.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.siteSetting.findFirst(),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.adminSession.findMany({
        orderBy: { lastActiveAt: 'desc' },
      }),
      prisma.user.findMany({
        take: 1,
      }),
    ]);

    const formattedProjects = projects.map(p => ({
      ...formatRow(p),
      images: p.images.map(formatRow),
    }));

    return {
      profile: profile ? formatRow(profile) : null,
      experiences: experiences.map(formatRow),
      educations: educations.map(formatRow),
      skillCategories: skillCategories.map(formatRow),
      skills: skills.map(s => ({ ...formatRow(s), categoryId: String(s.categoryId) })),
      services: services.map(formatRow),
      projects: formattedProjects,
      galleryImages: galleryImages.map(formatRow),
      blogPosts: blogPosts.map(b => ({
        ...formatRow(b),
        publishedAt: b.publishedAt ? b.publishedAt.toISOString() : undefined,
      })),
      contentCategories: contentCategories.map(formatRow),
      socialLinks: socialLinks.map(formatRow),
      siteSettings: siteSettings ? formatRow(siteSettings) : null,
      contactMessages: contactMessages.map(formatRow),
      auditLogs: auditLogs.map(l => ({
        ...formatRow(l),
        metadata: (l.metadata as Record<string, any>) || {},
      })),
      adminSessions: adminSessions.map(formatRow),
      adminUser: users[0] ? { email: users[0].email, lastLoginAt: users[0].lastLoginAt } : null,
    };
  } catch (error: any) {
    console.error('Failed to load admin portfolio data:', error);
    throw new Error('Failed to retrieve administrative data from database.', { cause: error });
  }
}

export async function resetAndReseedDatabase() {
  return { success: true, message: 'All portfolio data is queried and managed directly in PostgreSQL database.' };
}
