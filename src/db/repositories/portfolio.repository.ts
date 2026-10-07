import { prisma, createPool } from '../connection.ts';
import { formatRow } from './common.ts';
import {
  Profile,
  Experience,
  Education,
  SkillCategory,
  Skill,
  Service,
  Project,
  GalleryImage,
  BlogPost,
  ContentCategory,
  SocialLink,
  SiteSetting,
} from '../../types.ts';

export interface PublicPortfolioData {
  profile: Profile | null;
  experiences: Experience[];
  educations: Education[];
  skillCategories: SkillCategory[];
  skills: Skill[];
  services: Service[];
  projects: Project[];
  galleryImages: GalleryImage[];
  blogPosts: BlogPost[];
  contentCategories: ContentCategory[];
  socialLinks: SocialLink[];
  siteSettings: SiteSetting | null;
}

/**
 * Resilient Retry Utility
 * Retries asynchronous database operations with exponential backoff
 * to handle transient Cloud SQL socket initialization during scale-to-zero wake-ups.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 500): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const errMsg = (err as Error)?.message || String(err);
      if (attempt < retries) {
        console.warn(`[Database Retry] Attempt ${attempt}/${retries} failed (${errMsg}). Retrying in ${delayMs * attempt}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  throw lastError;
}

/**
 * Converts a database record with snake_case fields to camelCase and converts id to string
 */
function toCamelCaseRow<T>(row: Record<string, unknown>): T {
  const newObj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
    newObj[camelKey] = value;
  }
  newObj.id = String(row.id ?? '');
  return newObj as T;
}

/**
 * Direct node-postgres Pool fallback for public portfolio queries
 * Invoked if Prisma query engine encounters a temporary socket reconnection hiccup
 */
async function getPublicPortfolioDataDirectPg(): Promise<PublicPortfolioData> {
  const pool = createPool();
  const [
    profileRes,
    expRes,
    eduRes,
    skillCatRes,
    skillRes,
    serviceRes,
    projRes,
    projImgRes,
    galRes,
    blogRes,
    catRes,
    socialRes,
    setRes,
  ] = await Promise.all([
    pool.query('SELECT * FROM profiles ORDER BY id ASC LIMIT 1'),
    pool.query('SELECT * FROM experiences WHERE published = true ORDER BY display_order ASC'),
    pool.query('SELECT * FROM educations WHERE published = true ORDER BY display_order ASC'),
    pool.query('SELECT * FROM skill_categories WHERE published = true ORDER BY display_order ASC'),
    pool.query('SELECT * FROM skills WHERE published = true ORDER BY display_order ASC'),
    pool.query('SELECT * FROM services WHERE published = true ORDER BY display_order ASC'),
    pool.query('SELECT * FROM projects WHERE published = true ORDER BY display_order ASC'),
    pool.query('SELECT * FROM project_images ORDER BY display_order ASC'),
    pool.query('SELECT * FROM gallery_images WHERE published = true ORDER BY display_order ASC'),
    pool.query("SELECT * FROM blog_posts WHERE status = 'PUBLISHED' ORDER BY published_at DESC"),
    pool.query('SELECT * FROM content_categories ORDER BY display_order ASC'),
    pool.query('SELECT * FROM social_links WHERE published = true ORDER BY display_order ASC'),
    pool.query('SELECT * FROM site_settings ORDER BY id ASC LIMIT 1'),
  ]);

  const imagesByProject = new Map<number, unknown[]>();
  for (const img of projImgRes.rows) {
    const pId = Number(img.project_id);
    const existing = imagesByProject.get(pId);
    if (!existing) {
      imagesByProject.set(pId, [toCamelCaseRow(img)]);
    } else {
      existing.push(toCamelCaseRow(img));
    }
  }

  const formattedProjects: Project[] = projRes.rows.map((p) => {
    const formatted = toCamelCaseRow<Project>(p);
    return {
      ...formatted,
      images: (imagesByProject.get(Number(p.id)) || []) as Project['images'],
    };
  });

  return {
    profile: profileRes.rows[0] ? (toCamelCaseRow(profileRes.rows[0]) as unknown as Profile) : null,
    experiences: expRes.rows.map((r) => toCamelCaseRow(r)) as unknown as Experience[],
    educations: eduRes.rows.map((r) => toCamelCaseRow(r)) as unknown as Education[],
    skillCategories: skillCatRes.rows.map((r) => toCamelCaseRow(r)) as unknown as SkillCategory[],
    skills: skillRes.rows.map((r) => {
      const camel = toCamelCaseRow<Record<string, unknown>>(r);
      return { ...camel, categoryId: String(camel.categoryId || r.category_id || '') };
    }) as unknown as Skill[],
    services: serviceRes.rows.map((r) => toCamelCaseRow(r)) as unknown as Service[],
    projects: formattedProjects as unknown as Project[],
    galleryImages: galRes.rows.map((r) => toCamelCaseRow(r)) as unknown as GalleryImage[],
    blogPosts: blogRes.rows.map((b) => {
      const camel = toCamelCaseRow<Record<string, unknown>>(b);
      const pubDate = camel.publishedAt || b.published_at;
      return {
        ...camel,
        publishedAt: pubDate instanceof Date ? pubDate.toISOString() : (pubDate ? String(pubDate) : undefined),
      };
    }) as unknown as BlogPost[],
    contentCategories: catRes.rows.map((r) => toCamelCaseRow(r)) as unknown as ContentCategory[],
    socialLinks: socialRes.rows.map((r) => toCamelCaseRow(r)) as unknown as SocialLink[],
    siteSettings: setRes.rows[0] ? (toCamelCaseRow(setRes.rows[0]) as unknown as SiteSetting) : null,
  };
}

export async function getPublicPortfolioData(): Promise<PublicPortfolioData> {
  try {
    return await withRetry(async () => {
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
        profile: profile ? (formatRow(profile) as unknown as Profile) : null,
        experiences: experiences.map(formatRow) as unknown as Experience[],
        educations: educations.map(formatRow) as unknown as Education[],
        skillCategories: skillCategories.map(formatRow) as unknown as SkillCategory[],
        skills: skills.map(s => ({ ...formatRow(s), categoryId: String(s.categoryId) })) as unknown as Skill[],
        services: services.map(formatRow) as unknown as Service[],
        projects: formattedProjects as unknown as Project[],
        galleryImages: galleryImages.map(formatRow) as unknown as GalleryImage[],
        blogPosts: blogPosts.map(b => ({
          ...formatRow(b),
          publishedAt: b.publishedAt ? b.publishedAt.toISOString() : undefined,
        })) as unknown as BlogPost[],
        contentCategories: contentCategories.map(formatRow) as unknown as ContentCategory[],
        socialLinks: socialLinks.map(formatRow) as unknown as SocialLink[],
        siteSettings: siteSettings ? (formatRow(siteSettings) as unknown as SiteSetting) : null,
      };
    });
  } catch (error: unknown) {
    console.warn('[Database Resiliency] Prisma query error in getPublicPortfolioData:', (error as Error)?.message || error);
    try {
      console.log('[Database Resiliency] Executing direct node-postgres fallback...');
      return await getPublicPortfolioDataDirectPg();
    } catch (fallbackError: unknown) {
      console.error('[Database Resiliency] Direct pg fallback also failed:', (fallbackError as Error)?.message || fallbackError);
      throw new Error('Failed to retrieve portfolio data from database.', { cause: fallbackError });
    }
  }
}

export async function getAllAdminPortfolioData() {
  try {
    return await withRetry(async () => {
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
          metadata: (l.metadata as Record<string, unknown>) || {},
        })),
        adminSessions: adminSessions.map(formatRow),
        adminUser: users[0] ? { email: users[0].email, lastLoginAt: users[0].lastLoginAt } : null,
      };
    });
  } catch (error: unknown) {
    console.error('Failed to load admin portfolio data after retries:', error);
    throw new Error('Failed to retrieve administrative data from database.', { cause: error });
  }
}

export async function resetAndReseedDatabase() {
  return { success: true, message: 'All portfolio data is queried and managed directly in PostgreSQL database.' };
}
