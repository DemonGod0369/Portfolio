import { prisma, createPool, reconnectPrisma, resetPool } from '../connection.ts';
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

// In-memory resilient cache for public portfolio data to serve during database cold-starts or socket wakeups
let cachedPublicPortfolio: PublicPortfolioData | null = null;
let _lastPublicPortfolioCacheTime = 0;

export function invalidatePortfolioCache(): void {
  cachedPublicPortfolio = null;
  _lastPublicPortfolioCacheTime = 0;
}

/**
 * Default fallback data structure ensures site remains available if database is initializing
 */
export function getFallbackPortfolioData(): PublicPortfolioData {
  return {
    profile: {
      id: '1',
      name: 'Gunjan Shrestha',
      headline: 'Multidisciplinary Founder & Systems Operator',
      shortBio: 'Founder, builder, and operator specializing in business operations, creative direction, and technological systems.',
      longBio: 'Gunjan Shrestha is an entrepreneur and multidisciplinary operator with over 8 years of cross-industry leadership spanning creative direction, scalable digital operations, and strategic brand management.',
      profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      email: 'gunjanstha01@gmail.com',
      location: 'Kathmandu, Nepal',
      website: 'https://www.gunjanshrestha.com.np',
      phoneDisplayOption: 'both',
      whatsappNumber: 'primary',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    experiences: [],
    educations: [],
    skillCategories: [],
    skills: [],
    services: [],
    projects: [],
    galleryImages: [],
    blogPosts: [],
    contentCategories: [],
    socialLinks: [],
    siteSettings: {
      id: '1',
      siteName: 'Gunjan Shrestha',
      siteDescription: 'Multidisciplinary Founder & Systems Operator',
      canonicalUrl: 'https://www.gunjanshrestha.com.np',
      logoUrl: '',
      faviconUrl: '',
      profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      email: 'gunjanstha01@gmail.com',
      location: 'Kathmandu, Nepal',
      footerText: 'Gunjan Shrestha. All Rights Reserved.',
      accentColor: '#c6a87d',
      maintenanceMode: false,
      analyticsEnabled: false,
      defaultSeoTitle: 'Gunjan Shrestha | Founder & Systems Operator',
      defaultSeoDescription: 'Official portfolio and executive platform for Gunjan Shrestha.',
      defaultOgImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      allowIndexing: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Resilient Retry Utility
 * Retries asynchronous database operations with exponential backoff
 * to handle transient Cloud SQL socket initialization during scale-to-zero wake-ups.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 4, delayMs = 800): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const errMsg = (err as Error)?.message || String(err);
      const isConnectionError =
        errMsg.includes('Closed') ||
        errMsg.includes('EPIPE') ||
        errMsg.includes('ECONNRESET') ||
        errMsg.includes('ECONNREFUSED') ||
        errMsg.includes('connection') ||
        errMsg.includes('Connection') ||
        errMsg.includes('socket') ||
        errMsg.includes('timeout') ||
        errMsg.includes('Engine');

      if (attempt < retries) {
        const backoffDelay = delayMs * attempt;
        console.warn(`[Database Retry] Attempt ${attempt}/${retries} failed (${errMsg}). Retrying in ${backoffDelay}ms...`);
        if (isConnectionError) {
          try {
            await reconnectPrisma();
          } catch {
            // Discard reconnect errors
          }
        }
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
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
  await resetPool();
  const pool = createPool(true);
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    console.warn('[Database Resiliency] Direct pg checkout failed, recreating fresh pool:', (err as Error)?.message);
    await new Promise((resolve) => setTimeout(resolve, 800));
    await resetPool();
    const freshPool = createPool(true);
    client = await freshPool.connect();
  }

  let profileRes, expRes, eduRes, skillCatRes, skillRes, serviceRes;
  let projRes, projImgRes, galRes, blogRes, catRes, socialRes, setRes;

  try {
    // Execute sequentially on single client connection to prevent EPIPE write errors
    profileRes = await client.query('SELECT * FROM profiles ORDER BY id ASC LIMIT 1');
    expRes = await client.query('SELECT * FROM experiences WHERE published = true ORDER BY display_order ASC');
    eduRes = await client.query('SELECT * FROM educations WHERE published = true ORDER BY display_order ASC');
    skillCatRes = await client.query('SELECT * FROM skill_categories WHERE published = true ORDER BY display_order ASC');
    skillRes = await client.query('SELECT * FROM skills WHERE published = true ORDER BY display_order ASC');
    serviceRes = await client.query('SELECT * FROM services WHERE published = true ORDER BY display_order ASC');
    projRes = await client.query('SELECT * FROM projects WHERE published = true ORDER BY display_order ASC');
    projImgRes = await client.query('SELECT * FROM project_images ORDER BY display_order ASC');
    galRes = await client.query('SELECT * FROM gallery_images WHERE published = true ORDER BY display_order ASC');
    blogRes = await client.query("SELECT * FROM blog_posts WHERE status = 'PUBLISHED' ORDER BY published_at DESC");
    catRes = await client.query('SELECT * FROM content_categories ORDER BY display_order ASC');
    socialRes = await client.query('SELECT * FROM social_links WHERE published = true ORDER BY display_order ASC');
    setRes = await client.query('SELECT * FROM site_settings ORDER BY id ASC LIMIT 1');
  } finally {
    if (client) {
      try {
        client.release();
      } catch {
        // Discard release errors
      }
    }
  }

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
      // Execute sequentially on single connection to prevent connection exhaustion and socket contention
      const profile = await prisma.profile.findFirst();
      const experiences = await prisma.experience.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      });
      const educations = await prisma.education.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      });
      const skillCategories = await prisma.skillCategory.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      });
      const skills = await prisma.skill.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      });
      const services = await prisma.service.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      });
      const projects = await prisma.project.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      const galleryImages = await prisma.galleryImage.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      });
      const blogPosts = await prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
      });
      const contentCategories = await prisma.contentCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      const socialLinks = await prisma.socialLink.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      });
      const siteSettings = await prisma.siteSetting.findFirst();

      const formattedProjects = projects.map(p => ({
        ...formatRow(p),
        images: p.images.map(formatRow),
      }));

      const result: PublicPortfolioData = {
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

      cachedPublicPortfolio = result;
      _lastPublicPortfolioCacheTime = Date.now();
      return result;
    });
  } catch (error: unknown) {
    console.warn('[Database Resiliency] Prisma query error in getPublicPortfolioData:', (error as Error)?.message || error);
    try {
      console.log('[Database Resiliency] Executing direct node-postgres fallback...');
      const directData = await getPublicPortfolioDataDirectPg();
      cachedPublicPortfolio = directData;
      _lastPublicPortfolioCacheTime = Date.now();
      return directData;
    } catch (fallbackError: unknown) {
      console.error('[Database Resiliency] Direct pg fallback also failed:', (fallbackError as Error)?.message || fallbackError);
      if (cachedPublicPortfolio) {
        console.warn('[Database Resiliency] Serving in-memory cached public portfolio during temporary database recovery.');
        return cachedPublicPortfolio;
      }
      console.warn('[Database Resiliency] Serving baseline portfolio fallback data during database startup.');
      return getFallbackPortfolioData();
    }
  }
}

export async function getAllAdminPortfolioData() {
  try {
    return await withRetry(async () => {
      // Sequential fetching on single connection prevents Cloud SQL pool exhaustion
      const profile = await prisma.profile.findFirst();
      const experiences = await prisma.experience.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      const educations = await prisma.education.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      const skillCategories = await prisma.skillCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      const skills = await prisma.skill.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      const services = await prisma.service.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      const projects = await prisma.project.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      const galleryImages = await prisma.galleryImage.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      const blogPosts = await prisma.blogPost.findMany({
        orderBy: { publishedAt: 'desc' },
      });
      const contentCategories = await prisma.contentCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      const socialLinks = await prisma.socialLink.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      const siteSettings = await prisma.siteSetting.findFirst();
      const contactMessages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });
      const auditLogs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      const adminSessions = await prisma.adminSession.findMany({
        orderBy: { lastActiveAt: 'desc' },
      });
      const users = await prisma.user.findMany({
        take: 1,
      });

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
  invalidatePortfolioCache();
  return { success: true, message: 'All portfolio data is queried and managed directly in PostgreSQL database.' };
}
