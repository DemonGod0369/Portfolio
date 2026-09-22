import * as schema from './schema.ts';
import { eq, desc, asc } from 'drizzle-orm';
import {
  initialProfile,
  initialExperiences,
  initialEducations,
  initialSkillCategories,
  initialSkills,
  initialServices,
  initialProjects,
  initialGalleryImages,
  initialBlogPosts,
  initialSocialLinks,
  initialSiteSetting
} from '../data/initialData';
import { db } from '../index.ts';

// Seeding helper to guarantee the PostgreSQL database is populated with Gunjan's verified data
export async function seedDatabaseIfEmpty() {
  try {
    const existingProfiles = await db.select().from(schema.profiles).limit(1);
    if (existingProfiles.length === 0) {
      console.log('Seeding PostgreSQL database with Gunjan Shrestha initial portfolio data...');
      
      // 1. Profile
      await db.insert(schema.profiles).values({
        name: initialProfile.name,
        headline: initialProfile.headline,
        shortBio: initialProfile.shortBio,
        longBio: initialProfile.longBio,
        profileImageUrl: initialProfile.profileImageUrl,
        email: initialProfile.email,
        phone: initialProfile.phone,
        location: initialProfile.location,
        website: initialProfile.website,
      });

      // 2. Site Settings
      await db.insert(schema.siteSettings).values({
        siteName: initialSiteSetting.siteName,
        siteDescription: initialSiteSetting.siteDescription,
        logoUrl: initialSiteSetting.logoUrl,
        faviconUrl: initialSiteSetting.faviconUrl,
        profileImageUrl: initialSiteSetting.profileImageUrl,
        email: initialSiteSetting.email,
        phone: initialSiteSetting.phone,
        location: initialSiteSetting.location,
        footerText: initialSiteSetting.footerText,
        accentColor: initialSiteSetting.accentColor,
        maintenanceMode: initialSiteSetting.maintenanceMode,
        analyticsEnabled: initialSiteSetting.analyticsEnabled,
        defaultSeoTitle: initialSiteSetting.defaultSeoTitle,
        defaultSeoDescription: initialSiteSetting.defaultSeoDescription,
        defaultOgImageUrl: initialSiteSetting.defaultOgImageUrl,
      });

      // 3. Educations
      for (const edu of initialEducations) {
        await db.insert(schema.educations).values({
          institution: edu.institution,
          qualification: edu.qualification,
          field: edu.field,
          location: edu.location,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description,
          displayOrder: edu.displayOrder,
          published: edu.published,
        });
      }

      // 4. Experiences
      for (const exp of initialExperiences) {
        await db.insert(schema.experiences).values({
          category: exp.category,
          title: exp.title,
          organization: exp.organization,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.isCurrent,
          shortDescription: exp.shortDescription,
          description: exp.description,
          tags: exp.tags,
          imageUrl: exp.imageUrl,
          featured: exp.featured,
          displayOrder: exp.displayOrder,
          published: exp.published,
        });
      }

      // 5. Skill Categories and Skills
      for (const cat of initialSkillCategories) {
        const insertedCat = await db.insert(schema.skillCategories).values({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          displayOrder: cat.displayOrder,
          published: cat.published,
        }).returning();

        const catId = insertedCat[0].id;
        const relatedSkills = initialSkills.filter(s => s.categoryId === cat.id);
        for (const skill of relatedSkills) {
          await db.insert(schema.skills).values({
            categoryId: catId,
            name: skill.name,
            slug: skill.slug,
            description: skill.description,
            icon: skill.icon,
            displayOrder: skill.displayOrder,
            published: skill.published,
          });
        }
      }

      // 6. Services
      for (const srv of initialServices) {
        await db.insert(schema.services).values({
          title: srv.title,
          slug: srv.slug,
          shortDescription: srv.shortDescription,
          description: srv.description,
          icon: srv.icon,
          displayOrder: srv.displayOrder,
          featured: srv.featured,
          published: srv.published,
        });
      }

      // 7. Projects
      for (const proj of initialProjects) {
        await db.insert(schema.projects).values({
          title: proj.title,
          slug: proj.slug,
          category: proj.category,
          shortSummary: proj.shortSummary,
          overview: proj.overview,
          problem: proj.problem,
          approach: proj.approach,
          design: proj.design,
          technology: proj.technology,
          result: proj.result,
          featured: proj.featured,
          published: proj.published,
          displayOrder: proj.displayOrder,
        });
      }

      // 8. Gallery Images
      for (const img of initialGalleryImages) {
        await db.insert(schema.galleryImages).values({
          url: img.url,
          altText: img.altText,
          caption: img.caption,
          category: img.category,
          width: img.width,
          height: img.height,
          featured: img.featured,
          published: img.published,
          displayOrder: img.displayOrder,
        });
      }

      // 9. Blog Posts
      for (const post of initialBlogPosts) {
        await db.insert(schema.blogPosts).values({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          coverImageUrl: post.coverImageUrl,
          content: post.content,
          readingTime: post.readingTime,
          publishedAt: new Date(post.publishedAt || Date.now()),
          status: post.status || 'PUBLISHED',
          featured: post.featured,
          tags: post.tags,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
        });
      }

      // 10. Social Links
      for (const link of initialSocialLinks) {
        await db.insert(schema.socialLinks).values({
          platform: link.platform,
          label: link.label,
          url: link.url,
          icon: link.icon,
          displayOrder: link.displayOrder,
          published: link.published,
        });
      }

      console.log('PostgreSQL database seeded successfully.');
    }
  } catch (error) {
    console.error('Database seeding error:', error);
  }
}

// Layer 1: Query Layer with sanitized error handling
export async function getPublicPortfolioData() {
  try {
    const [
      profileList,
      experiencesList,
      educationsList,
      skillCatsList,
      skillsList,
      servicesList,
      projectsList,
      galleryList,
      blogsList,
      socialsList,
      settingsList,
    ] = await Promise.all([
      db.select().from(schema.profiles).limit(1),
      db.select().from(schema.experiences).where(eq(schema.experiences.published, true)).orderBy(asc(schema.experiences.displayOrder)),
      db.select().from(schema.educations).where(eq(schema.educations.published, true)).orderBy(asc(schema.educations.displayOrder)),
      db.select().from(schema.skillCategories).where(eq(schema.skillCategories.published, true)).orderBy(asc(schema.skillCategories.displayOrder)),
      db.select().from(schema.skills).where(eq(schema.skills.published, true)).orderBy(asc(schema.skills.displayOrder)),
      db.select().from(schema.services).where(eq(schema.services.published, true)).orderBy(asc(schema.services.displayOrder)),
      db.select().from(schema.projects).where(eq(schema.projects.published, true)).orderBy(asc(schema.projects.displayOrder)),
      db.select().from(schema.galleryImages).where(eq(schema.galleryImages.published, true)).orderBy(asc(schema.galleryImages.displayOrder)),
      db.select().from(schema.blogPosts).where(eq(schema.blogPosts.status, 'PUBLISHED')).orderBy(desc(schema.blogPosts.publishedAt)),
      db.select().from(schema.socialLinks).where(eq(schema.socialLinks.published, true)).orderBy(asc(schema.socialLinks.displayOrder)),
      db.select().from(schema.siteSettings).limit(1),
    ]);

    return {
      profile: profileList[0] || initialProfile,
      experiences: experiencesList,
      educations: educationsList,
      skillCategories: skillCatsList,
      skills: skillsList,
      services: servicesList,
      projects: projectsList,
      galleryImages: galleryList,
      blogPosts: blogsList,
      socialLinks: socialsList,
      siteSettings: settingsList[0] || initialSiteSetting,
    };
  } catch (error) {
    console.warn('PostgreSQL not accessible or not configured, returning initial portfolio data fallback:', error?.message || error);
    return {
      profile: initialProfile,
      experiences: initialExperiences,
      educations: initialEducations,
      skillCategories: initialSkillCategories,
      skills: initialSkills,
      services: initialServices,
      projects: initialProjects,
      galleryImages: initialGalleryImages,
      blogPosts: initialBlogPosts,
      socialLinks: initialSocialLinks,
      siteSettings: initialSiteSetting,
    };
  }
}

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipHash?: string;
  userAgent?: string;
}) {
  try {
    const result = await db.insert(schema.contactMessages).values({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      ipHash: data.ipHash,
      userAgent: data.userAgent,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert contact message:', error);
    throw new Error('Failed to save message.', { cause: error });
  }
}

export async function createAuditEntry(data: {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: any;
  ipHash?: string;
  userAgent?: string;
}) {
  try {
    await db.insert(schema.auditLogs).values({
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      metadata: data.metadata,
      ipHash: data.ipHash,
      userAgent: data.userAgent,
    });
  } catch (error) {
    console.error('Audit log insertion failed:', error);
  }
}
