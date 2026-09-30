import { db } from './index.ts';
import * as schema from './schema.ts';
import { eq, desc, asc } from 'drizzle-orm';
import {
  initialProfile,
  initialExperiences,
  initialEducations,
  initialSkillCategories,
  initialSkills,
  initialServices,
  initialContentCategories,
  initialProjects,
  initialGalleryImages,
  initialBlogPosts,
  initialSocialLinks,
  initialSiteSetting
} from './seedData.ts';

// Helper to normalize integer IDs to string for React frontend types
function formatRow<T extends { id: number | string }>(row: T): T & { id: string } {
  return {
    ...row,
    id: String(row.id),
  };
}

function parseId(id: string | number): number {
  const num = typeof id === 'number' ? id : parseInt(id, 10);
  return isNaN(num) ? 0 : num;
}

// -------------------------------------------------------------
// SEEDING HELPER
// -------------------------------------------------------------
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
        visitingCardImageUrl: initialProfile.visitingCardImageUrl || '',
        dateOfBirth: initialProfile.dateOfBirth || '',
        address: initialProfile.address || '',
        email: initialProfile.email,
        alternateEmail: initialProfile.alternateEmail || '',
        primaryEmailLabel: initialProfile.primaryEmailLabel || '',
        alternateEmailLabel: initialProfile.alternateEmailLabel || '',
        phone: initialProfile.phone || '',
        secondaryPhone: initialProfile.secondaryPhone || '',
        phoneDisplayOption: initialProfile.phoneDisplayOption || 'both',
        whatsappNumber: initialProfile.whatsappNumber || 'primary',
        location: initialProfile.location,
        website: initialProfile.website,
        availabilityStatus: initialProfile.availabilityStatus || 'available',
        availabilityCustomNote: initialProfile.availabilityCustomNote || '',
        timezone: initialProfile.timezone || 'Asia/Kathmandu',
        responseTime: initialProfile.responseTime || '< 24 Hours',
        languagesSpoken: initialProfile.languagesSpoken || [],
      });

      // 2. Site Settings
      await db.insert(schema.siteSettings).values({
        siteName: initialSiteSetting.siteName,
        siteDescription: initialSiteSetting.siteDescription,
        canonicalUrl: initialSiteSetting.canonicalUrl || 'https://www.gunjanshrestha.com.np',
        logoUrl: initialSiteSetting.logoUrl,
        faviconUrl: initialSiteSetting.faviconUrl,
        profileImageUrl: initialSiteSetting.profileImageUrl,
        email: initialSiteSetting.email,
        phone: initialSiteSetting.phone || '',
        location: initialSiteSetting.location,
        footerText: initialSiteSetting.footerText,
        accentColor: initialSiteSetting.accentColor,
        maintenanceMode: initialSiteSetting.maintenanceMode,
        analyticsEnabled: initialSiteSetting.analyticsEnabled,
        defaultSeoTitle: initialSiteSetting.defaultSeoTitle,
        defaultSeoDescription: initialSiteSetting.defaultSeoDescription,
        defaultOgImageUrl: initialSiteSetting.defaultOgImageUrl,
        seoKeywords: initialSiteSetting.seoKeywords || '',
        allowIndexing: initialSiteSetting.allowIndexing ?? true,
        googleSiteVerification: initialSiteSetting.googleSiteVerification || '',
        googleAnalyticsId: initialSiteSetting.googleAnalyticsId || '',
        customHeadSnippet: initialSiteSetting.customHeadSnippet || '',
      });

      // 3. Educations
      for (const edu of initialEducations) {
        await db.insert(schema.educations).values({
          institution: edu.institution,
          qualification: edu.qualification,
          field: edu.field || '',
          location: edu.location || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          description: edu.description || '',
          displayOrder: edu.displayOrder,
          published: edu.published,
        });
      }

      // 4. Experiences
      for (const exp of initialExperiences) {
        await db.insert(schema.experiences).values({
          category: exp.category,
          title: exp.title,
          roleTitle: exp.roleTitle || '',
          organization: exp.organization || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          isCurrent: exp.isCurrent,
          shortDescription: exp.shortDescription,
          description: exp.description,
          tags: exp.tags,
          imageUrl: exp.imageUrl || '',
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
          description: cat.description || '',
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
            description: skill.description || '',
            icon: skill.icon || '',
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
          icon: srv.icon || '',
          displayOrder: srv.displayOrder,
          featured: srv.featured,
          published: srv.published,
        });
      }

      // 7. Projects & Project Images
      for (const proj of initialProjects) {
        const insertedProj = await db.insert(schema.projects).values({
          title: proj.title,
          slug: proj.slug,
          category: proj.category,
          shortSummary: proj.shortSummary,
          overview: proj.overview || '',
          problem: proj.problem || '',
          approach: proj.approach || '',
          design: proj.design || '',
          technology: proj.technology || '',
          result: proj.result || '',
          heroImage: proj.heroImage || '',
          liveUrl: proj.liveUrl || '',
          githubUrl: proj.githubUrl || '',
          seoTitle: proj.seoTitle || '',
          seoDescription: proj.seoDescription || '',
          canonicalUrl: proj.canonicalUrl || '',
          featured: proj.featured,
          published: proj.published,
          displayOrder: proj.displayOrder,
        }).returning();

        if (proj.images && proj.images.length > 0) {
          for (const img of proj.images) {
            await db.insert(schema.projectImages).values({
              projectId: insertedProj[0].id,
              url: img.url,
              altText: img.altText || '',
              caption: img.caption || '',
              displayOrder: img.displayOrder || 0,
            });
          }
        }
      }

      // 8. Gallery Images
      for (const img of initialGalleryImages) {
        await db.insert(schema.galleryImages).values({
          url: img.url,
          altText: img.altText,
          caption: img.caption || '',
          category: img.category || '',
          width: img.width || 800,
          height: img.height || 600,
          featured: img.featured,
          published: img.published,
          displayOrder: img.displayOrder,
        });
      }

      // 9. Blog Categories & Blog Posts
      const catMap = new Map<string, number>();
      for (const post of initialBlogPosts) {
        let catId: number | null = null;
        if (post.category) {
          if (!catMap.has(post.category)) {
            const slug = post.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const newCat = await db.insert(schema.blogCategories).values({
              name: post.category,
              slug,
              description: `${post.category} insights and articles`,
            }).onConflictDoNothing().returning();
            if (newCat[0]) catMap.set(post.category, newCat[0].id);
          }
          catId = catMap.get(post.category) || null;
        }

        await db.insert(schema.blogPosts).values({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          coverImageUrl: post.coverImageUrl,
          content: post.content,
          category: post.category || '',
          categoryId: catId,
          readingTime: post.readingTime || 5,
          publishedAt: new Date(post.publishedAt || Date.now()),
          status: post.status || 'PUBLISHED',
          featured: post.featured,
          tags: post.tags,
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || '',
          canonicalUrl: post.canonicalUrl || '',
        });
      }

      // 10. Social Links
      for (const link of initialSocialLinks) {
        await db.insert(schema.socialLinks).values({
          platform: link.platform,
          label: link.label,
          url: link.url,
          icon: link.icon || '',
          displayOrder: link.displayOrder,
          published: link.published,
        });
      }

      // 11. Content Categories
      for (const cat of initialContentCategories) {
        await db.insert(schema.contentCategories).values({
          name: cat.name,
          slug: cat.slug,
          type: cat.type || 'GENERAL',
          description: cat.description || '',
          displayOrder: cat.displayOrder,
        }).onConflictDoNothing();
      }

      // 12. Admin User
      await db.insert(schema.users).values({
        uid: 'admin_gunjan',
        email: 'gunjanstha01@gmail.com',
        passwordHash: 'gunjan2026',
        isActive: true,
      }).onConflictDoNothing();

      console.log('PostgreSQL database seeded successfully.');
    } else {
      // Check if contentCategories or admin users need seeding
      const existingContentCats = await db.select().from(schema.contentCategories).limit(1);
      if (existingContentCats.length === 0) {
        for (const cat of initialContentCategories) {
          await db.insert(schema.contentCategories).values({
            name: cat.name,
            slug: cat.slug,
            type: cat.type || 'GENERAL',
            description: cat.description || '',
            displayOrder: cat.displayOrder,
          }).onConflictDoNothing();
        }
      }

      const existingUsers = await db.select().from(schema.users).limit(1);
      if (existingUsers.length === 0) {
        await db.insert(schema.users).values({
          uid: 'admin_gunjan',
          email: 'gunjanstha01@gmail.com',
          passwordHash: 'gunjan2026',
          isActive: true,
        }).onConflictDoNothing();
      }
    }
  } catch (error) {
    console.error('Database seeding error:', error);
  }
}

// -------------------------------------------------------------
// PUBLIC DATA LOADER (Fast parallel query for initial site load)
// -------------------------------------------------------------
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
      projectImagesList,
      galleryList,
      blogsList,
      contentCatsList,
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
      db.select().from(schema.projectImages).orderBy(asc(schema.projectImages.displayOrder)),
      db.select().from(schema.galleryImages).where(eq(schema.galleryImages.published, true)).orderBy(asc(schema.galleryImages.displayOrder)),
      db.select().from(schema.blogPosts).where(eq(schema.blogPosts.status, 'PUBLISHED')).orderBy(desc(schema.blogPosts.publishedAt)),
      db.select().from(schema.contentCategories).orderBy(asc(schema.contentCategories.displayOrder)),
      db.select().from(schema.socialLinks).where(eq(schema.socialLinks.published, true)).orderBy(asc(schema.socialLinks.displayOrder)),
      db.select().from(schema.siteSettings).limit(1),
    ]);

    // Attach project images to their projects
    const formattedProjects = projectsList.map(p => {
      const relatedImages = projectImagesList
        .filter(img => img.projectId === p.id)
        .map(img => formatRow(img));
      return {
        ...formatRow(p),
        images: relatedImages,
      };
    });

    return {
      profile: profileList[0] ? formatRow(profileList[0]) : initialProfile,
      experiences: experiencesList.map(formatRow),
      educations: educationsList.map(formatRow),
      skillCategories: skillCatsList.map(formatRow),
      skills: skillsList.map(s => ({ ...formatRow(s), categoryId: String(s.categoryId) })),
      services: servicesList.map(formatRow),
      projects: formattedProjects,
      galleryImages: galleryList.map(formatRow),
      blogPosts: blogsList.map(b => ({
        ...formatRow(b),
        publishedAt: b.publishedAt ? b.publishedAt.toISOString() : undefined,
      })),
      contentCategories: contentCatsList.map(formatRow),
      socialLinks: socialsList.map(formatRow),
      siteSettings: settingsList[0] ? formatRow(settingsList[0]) : initialSiteSetting,
    };
  } catch (error: any) {
    console.warn('Database query error in getPublicPortfolioData:', error?.message || error);
    throw new Error('Failed to retrieve portfolio data from database.', { cause: error });
  }
}

// -------------------------------------------------------------
// ADMIN DATA LOADER (Loads all entities including drafts)
// -------------------------------------------------------------
export async function getAllAdminPortfolioData() {
  try {
    const [
      profileList,
      experiencesList,
      educationsList,
      skillCatsList,
      skillsList,
      servicesList,
      projectsList,
      projectImagesList,
      galleryList,
      blogsList,
      contentCatsList,
      socialsList,
      settingsList,
      contactMessagesList,
      auditLogsList,
      adminSessionsList,
      usersList,
    ] = await Promise.all([
      db.select().from(schema.profiles).limit(1),
      db.select().from(schema.experiences).orderBy(asc(schema.experiences.displayOrder)),
      db.select().from(schema.educations).orderBy(asc(schema.educations.displayOrder)),
      db.select().from(schema.skillCategories).orderBy(asc(schema.skillCategories.displayOrder)),
      db.select().from(schema.skills).orderBy(asc(schema.skills.displayOrder)),
      db.select().from(schema.services).orderBy(asc(schema.services.displayOrder)),
      db.select().from(schema.projects).orderBy(asc(schema.projects.displayOrder)),
      db.select().from(schema.projectImages).orderBy(asc(schema.projectImages.displayOrder)),
      db.select().from(schema.galleryImages).orderBy(asc(schema.galleryImages.displayOrder)),
      db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt)),
      db.select().from(schema.contentCategories).orderBy(asc(schema.contentCategories.displayOrder)),
      db.select().from(schema.socialLinks).orderBy(asc(schema.socialLinks.displayOrder)),
      db.select().from(schema.siteSettings).limit(1),
      db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt)),
      db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt)).limit(100),
      db.select().from(schema.adminSessions).orderBy(desc(schema.adminSessions.lastActiveAt)),
      db.select().from(schema.users).limit(1),
    ]);

    const formattedProjects = projectsList.map(p => {
      const relatedImages = projectImagesList
        .filter(img => img.projectId === p.id)
        .map(img => formatRow(img));
      return {
        ...formatRow(p),
        images: relatedImages,
      };
    });

    return {
      profile: profileList[0] ? formatRow(profileList[0]) : initialProfile,
      experiences: experiencesList.map(formatRow),
      educations: educationsList.map(formatRow),
      skillCategories: skillCatsList.map(formatRow),
      skills: skillsList.map(s => ({ ...formatRow(s), categoryId: String(s.categoryId) })),
      services: servicesList.map(formatRow),
      projects: formattedProjects,
      galleryImages: galleryList.map(formatRow),
      blogPosts: blogsList.map(b => ({
        ...formatRow(b),
        publishedAt: b.publishedAt ? b.publishedAt.toISOString() : undefined,
      })),
      contentCategories: contentCatsList.map(formatRow),
      socialLinks: socialsList.map(formatRow),
      siteSettings: settingsList[0] ? formatRow(settingsList[0]) : initialSiteSetting,
      contactMessages: contactMessagesList.map(formatRow),
      auditLogs: auditLogsList.map(l => ({ ...formatRow(l), metadata: l.metadata as Record<string, any> })),
      adminSessions: adminSessionsList,
      adminUser: usersList[0] ? { email: usersList[0].email, lastLoginAt: usersList[0].lastLoginAt } : null,
    };
  } catch (error: any) {
    console.error('Failed to load admin portfolio data:', error);
    throw new Error('Failed to retrieve administrative data from database.', { cause: error });
  }
}

// -------------------------------------------------------------
// PROFILE CRUD
// -------------------------------------------------------------
export async function getProfile() {
  const rows = await db.select().from(schema.profiles).limit(1);
  return rows[0] ? formatRow(rows[0]) : initialProfile;
}

export async function updateProfile(data: any) {
  try {
    const existing = await db.select().from(schema.profiles).limit(1);
    if (existing.length === 0) {
      const inserted = await db.insert(schema.profiles).values({
        name: data.name || initialProfile.name,
        ...data,
      }).returning();
      return formatRow(inserted[0]);
    }
    const updated = await db.update(schema.profiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.profiles.id, existing[0].id))
      .returning();
    return formatRow(updated[0]);
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw new Error('Failed to update profile in database.', { cause: error });
  }
}

// -------------------------------------------------------------
// EXPERIENCES CRUD
// -------------------------------------------------------------
export async function getExperiences() {
  const rows = await db.select().from(schema.experiences).orderBy(asc(schema.experiences.displayOrder));
  return rows.map(formatRow);
}

export async function createExperience(data: any) {
  const inserted = await db.insert(schema.experiences).values({
    category: data.category,
    title: data.title,
    roleTitle: data.roleTitle || '',
    organization: data.organization || '',
    location: data.location || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    isCurrent: Boolean(data.isCurrent),
    shortDescription: data.shortDescription || '',
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    imageUrl: data.imageUrl || '',
    featured: Boolean(data.featured),
    displayOrder: data.displayOrder || 0,
    published: data.published ?? true,
  }).returning();
  return formatRow(inserted[0]);
}

export async function updateExperience(id: string | number, data: any) {
  const numericId = parseId(id);
  const updated = await db.update(schema.experiences)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.experiences.id, numericId))
    .returning();
  return updated[0] ? formatRow(updated[0]) : null;
}

export async function deleteExperience(id: string | number) {
  const numericId = parseId(id);
  const deleted = await db.delete(schema.experiences)
    .where(eq(schema.experiences.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// EDUCATIONS CRUD
// -------------------------------------------------------------
export async function getEducations() {
  const rows = await db.select().from(schema.educations).orderBy(asc(schema.educations.displayOrder));
  return rows.map(formatRow);
}

export async function createEducation(data: any) {
  const inserted = await db.insert(schema.educations).values({
    institution: data.institution,
    qualification: data.qualification,
    field: data.field || '',
    location: data.location || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    description: data.description || '',
    displayOrder: data.displayOrder || 0,
    published: data.published ?? true,
  }).returning();
  return formatRow(inserted[0]);
}

export async function updateEducation(id: string | number, data: any) {
  const numericId = parseId(id);
  const updated = await db.update(schema.educations)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.educations.id, numericId))
    .returning();
  return updated[0] ? formatRow(updated[0]) : null;
}

export async function deleteEducation(id: string | number) {
  const numericId = parseId(id);
  const deleted = await db.delete(schema.educations)
    .where(eq(schema.educations.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// SKILL CATEGORIES CRUD
// -------------------------------------------------------------
export async function getSkillCategories() {
  const rows = await db.select().from(schema.skillCategories).orderBy(asc(schema.skillCategories.displayOrder));
  return rows.map(formatRow);
}

export async function createSkillCategory(data: any) {
  const inserted = await db.insert(schema.skillCategories).values({
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description || '',
    displayOrder: data.displayOrder || 0,
    published: data.published ?? true,
  }).returning();
  return formatRow(inserted[0]);
}

export async function updateSkillCategory(id: string | number, data: any) {
  const numericId = parseId(id);
  const updated = await db.update(schema.skillCategories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.skillCategories.id, numericId))
    .returning();
  return updated[0] ? formatRow(updated[0]) : null;
}

export async function deleteSkillCategory(id: string | number) {
  const numericId = parseId(id);
  // Delete related skills first or let DB restrict
  await db.delete(schema.skills).where(eq(schema.skills.categoryId, numericId));
  const deleted = await db.delete(schema.skillCategories)
    .where(eq(schema.skillCategories.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// SKILLS CRUD
// -------------------------------------------------------------
export async function getSkills() {
  const rows = await db.select().from(schema.skills).orderBy(asc(schema.skills.displayOrder));
  return rows.map(s => ({ ...formatRow(s), categoryId: String(s.categoryId) }));
}

export async function createSkill(data: any) {
  const categoryId = parseId(data.categoryId);
  const inserted = await db.insert(schema.skills).values({
    categoryId,
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description || '',
    icon: data.icon || '',
    displayOrder: data.displayOrder || 0,
    published: data.published ?? true,
  }).returning();
  return { ...formatRow(inserted[0]), categoryId: String(inserted[0].categoryId) };
}

export async function updateSkill(id: string | number, data: any) {
  const numericId = parseId(id);
  const updatePayload: any = { ...data, updatedAt: new Date() };
  if (data.categoryId) updatePayload.categoryId = parseId(data.categoryId);

  const updated = await db.update(schema.skills)
    .set(updatePayload)
    .where(eq(schema.skills.id, numericId))
    .returning();
  return updated[0] ? { ...formatRow(updated[0]), categoryId: String(updated[0].categoryId) } : null;
}

export async function deleteSkill(id: string | number) {
  const numericId = parseId(id);
  const deleted = await db.delete(schema.skills)
    .where(eq(schema.skills.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// SERVICES CRUD
// -------------------------------------------------------------
export async function getServices() {
  const rows = await db.select().from(schema.services).orderBy(asc(schema.services.displayOrder));
  return rows.map(formatRow);
}

export async function createService(data: any) {
  const inserted = await db.insert(schema.services).values({
    title: data.title,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    shortDescription: data.shortDescription || '',
    description: data.description || '',
    icon: data.icon || '',
    displayOrder: data.displayOrder || 0,
    featured: Boolean(data.featured),
    published: data.published ?? true,
  }).returning();
  return formatRow(inserted[0]);
}

export async function updateService(id: string | number, data: any) {
  const numericId = parseId(id);
  const updated = await db.update(schema.services)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.services.id, numericId))
    .returning();
  return updated[0] ? formatRow(updated[0]) : null;
}

export async function deleteService(id: string | number) {
  const numericId = parseId(id);
  const deleted = await db.delete(schema.services)
    .where(eq(schema.services.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// PROJECTS & PROJECT IMAGES CRUD
// -------------------------------------------------------------
export async function getProjects() {
  const [projs, imgs] = await Promise.all([
    db.select().from(schema.projects).orderBy(asc(schema.projects.displayOrder)),
    db.select().from(schema.projectImages).orderBy(asc(schema.projectImages.displayOrder)),
  ]);

  return projs.map(p => ({
    ...formatRow(p),
    images: imgs.filter(i => i.projectId === p.id).map(formatRow),
  }));
}

export async function createProject(data: any) {
  const inserted = await db.insert(schema.projects).values({
    title: data.title,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: data.category || '',
    shortSummary: data.shortSummary || '',
    overview: data.overview || '',
    problem: data.problem || '',
    approach: data.approach || '',
    design: data.design || '',
    technology: data.technology || '',
    result: data.result || '',
    heroImage: data.heroImage || '',
    liveUrl: data.liveUrl || '',
    githubUrl: data.githubUrl || '',
    seoTitle: data.seoTitle || '',
    seoDescription: data.seoDescription || '',
    canonicalUrl: data.canonicalUrl || '',
    featured: Boolean(data.featured),
    published: data.published ?? true,
    displayOrder: data.displayOrder || 0,
  }).returning();

  const projectRecord = inserted[0];
  const createdImages = [];

  if (Array.isArray(data.images) && data.images.length > 0) {
    for (const img of data.images) {
      const insertedImg = await db.insert(schema.projectImages).values({
        projectId: projectRecord.id,
        url: img.url,
        altText: img.altText || '',
        caption: img.caption || '',
        displayOrder: img.displayOrder || 0,
      }).returning();
      createdImages.push(formatRow(insertedImg[0]));
    }
  }

  return {
    ...formatRow(projectRecord),
    images: createdImages,
  };
}

export async function updateProject(id: string | number, data: any) {
  const numericId = parseId(id);
  const { images, ...projectData } = data;

  const updated = await db.update(schema.projects)
    .set({
      ...projectData,
      updatedAt: new Date(),
    })
    .where(eq(schema.projects.id, numericId))
    .returning();

  if (!updated[0]) return null;

  if (Array.isArray(images)) {
    // Replace project images with new list
    await db.delete(schema.projectImages).where(eq(schema.projectImages.projectId, numericId));
    for (const img of images) {
      await db.insert(schema.projectImages).values({
        projectId: numericId,
        url: img.url,
        altText: img.altText || '',
        caption: img.caption || '',
        displayOrder: img.displayOrder || 0,
      });
    }
  }

  const allImgs = await db.select().from(schema.projectImages)
    .where(eq(schema.projectImages.projectId, numericId))
    .orderBy(asc(schema.projectImages.displayOrder));

  return {
    ...formatRow(updated[0]),
    images: allImgs.map(formatRow),
  };
}

export async function deleteProject(id: string | number) {
  const numericId = parseId(id);
  // Cascade will delete projectImages
  const deleted = await db.delete(schema.projects)
    .where(eq(schema.projects.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// GALLERY IMAGES CRUD
// -------------------------------------------------------------
export async function getGalleryImages() {
  const rows = await db.select().from(schema.galleryImages).orderBy(asc(schema.galleryImages.displayOrder));
  return rows.map(formatRow);
}

export async function createGalleryImage(data: any) {
  const inserted = await db.insert(schema.galleryImages).values({
    url: data.url,
    altText: data.altText || 'Gallery item',
    caption: data.caption || '',
    category: data.category || '',
    width: data.width || 800,
    height: data.height || 600,
    featured: Boolean(data.featured),
    published: data.published ?? true,
    displayOrder: data.displayOrder || 0,
  }).returning();
  return formatRow(inserted[0]);
}

export async function updateGalleryImage(id: string | number, data: any) {
  const numericId = parseId(id);
  const updated = await db.update(schema.galleryImages)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.galleryImages.id, numericId))
    .returning();
  return updated[0] ? formatRow(updated[0]) : null;
}

export async function deleteGalleryImage(id: string | number) {
  const numericId = parseId(id);
  const deleted = await db.delete(schema.galleryImages)
    .where(eq(schema.galleryImages.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// BLOG POSTS CRUD
// -------------------------------------------------------------
export async function getBlogPosts() {
  const rows = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt));
  return rows.map(b => ({
    ...formatRow(b),
    publishedAt: b.publishedAt ? b.publishedAt.toISOString() : undefined,
  }));
}

export async function createBlogPost(data: any) {
  const inserted = await db.insert(schema.blogPosts).values({
    title: data.title,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: data.excerpt || '',
    coverImageUrl: data.coverImageUrl || '',
    content: data.content || '',
    category: data.category || '',
    readingTime: data.readingTime || 5,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    status: data.status || 'PUBLISHED',
    featured: Boolean(data.featured),
    tags: Array.isArray(data.tags) ? data.tags : [],
    seoTitle: data.seoTitle || '',
    seoDescription: data.seoDescription || '',
    canonicalUrl: data.canonicalUrl || '',
  }).returning();
  const post = inserted[0];
  return {
    ...formatRow(post),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : undefined,
  };
}

export async function updateBlogPost(id: string | number, data: any) {
  const numericId = parseId(id);
  const updatePayload: any = { ...data, updatedAt: new Date() };
  if (data.publishedAt) {
    updatePayload.publishedAt = new Date(data.publishedAt);
  }

  const updated = await db.update(schema.blogPosts)
    .set(updatePayload)
    .where(eq(schema.blogPosts.id, numericId))
    .returning();
  if (!updated[0]) return null;
  const post = updated[0];
  return {
    ...formatRow(post),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : undefined,
  };
}

export async function deleteBlogPost(id: string | number) {
  const numericId = parseId(id);
  const deleted = await db.delete(schema.blogPosts)
    .where(eq(schema.blogPosts.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// CONTENT CATEGORIES CRUD (Universal Categories)
// -------------------------------------------------------------
export async function getContentCategories() {
  const rows = await db.select().from(schema.contentCategories).orderBy(asc(schema.contentCategories.displayOrder));
  return rows.map(formatRow);
}

export async function createContentCategory(data: any) {
  const inserted = await db.insert(schema.contentCategories).values({
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    type: data.type || 'GENERAL',
    description: data.description || '',
    displayOrder: data.displayOrder || 0,
  }).returning();
  return formatRow(inserted[0]);
}

export async function updateContentCategory(id: string | number, data: any) {
  const numericId = parseId(id);
  const updated = await db.update(schema.contentCategories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.contentCategories.id, numericId))
    .returning();
  return updated[0] ? formatRow(updated[0]) : null;
}

export async function deleteContentCategory(id: string | number) {
  const numericId = parseId(id);
  const deleted = await db.delete(schema.contentCategories)
    .where(eq(schema.contentCategories.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// SOCIAL LINKS CRUD
// -------------------------------------------------------------
export async function getSocialLinks() {
  const rows = await db.select().from(schema.socialLinks).orderBy(asc(schema.socialLinks.displayOrder));
  return rows.map(formatRow);
}

export async function createSocialLink(data: any) {
  const inserted = await db.insert(schema.socialLinks).values({
    platform: data.platform,
    label: data.label,
    url: data.url,
    icon: data.icon || '',
    displayOrder: data.displayOrder || 0,
    published: data.published ?? true,
  }).returning();
  return formatRow(inserted[0]);
}

export async function updateSocialLink(id: string | number, data: any) {
  const numericId = parseId(id);
  const updated = await db.update(schema.socialLinks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.socialLinks.id, numericId))
    .returning();
  return updated[0] ? formatRow(updated[0]) : null;
}

export async function deleteSocialLink(id: string | number) {
  const numericId = parseId(id);
  const deleted = await db.delete(schema.socialLinks)
    .where(eq(schema.socialLinks.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// SITE SETTINGS CRUD
// -------------------------------------------------------------
export async function getSiteSettings() {
  const rows = await db.select().from(schema.siteSettings).limit(1);
  return rows[0] ? formatRow(rows[0]) : initialSiteSetting;
}

export async function updateSiteSettings(data: any) {
  const existing = await db.select().from(schema.siteSettings).limit(1);
  if (existing.length === 0) {
    const inserted = await db.insert(schema.siteSettings).values({
      siteName: data.siteName || initialSiteSetting.siteName,
      ...data,
    }).returning();
    return formatRow(inserted[0]);
  }
  const updated = await db.update(schema.siteSettings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.siteSettings.id, existing[0].id))
    .returning();
  return formatRow(updated[0]);
}

// -------------------------------------------------------------
// CONTACT MESSAGES CRUD
// -------------------------------------------------------------
export async function getContactMessages() {
  const rows = await db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt));
  return rows.map(formatRow);
}

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipHash?: string;
  userAgent?: string;
}) {
  const result = await db.insert(schema.contactMessages).values({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    ipHash: data.ipHash,
    userAgent: data.userAgent,
  }).returning();
  return formatRow(result[0]);
}

export async function updateContactMessageStatus(id: string | number, status: 'NEW' | 'READ' | 'ARCHIVED') {
  const numericId = parseId(id);
  const updated = await db.update(schema.contactMessages)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(schema.contactMessages.id, numericId))
    .returning();
  return updated[0] ? formatRow(updated[0]) : null;
}

export async function deleteContactMessage(id: string | number) {
  const numericId = parseId(id);
  const deleted = await db.delete(schema.contactMessages)
    .where(eq(schema.contactMessages.id, numericId))
    .returning();
  return deleted[0] ? formatRow(deleted[0]) : null;
}

// -------------------------------------------------------------
// AUDIT LOGS
// -------------------------------------------------------------
export async function getAuditLogs(limitCount = 100) {
  const rows = await db.select().from(schema.auditLogs)
    .orderBy(desc(schema.auditLogs.createdAt))
    .limit(limitCount);
  return rows.map(l => ({ ...formatRow(l), metadata: l.metadata as Record<string, any> }));
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
    const inserted = await db.insert(schema.auditLogs).values({
      userId: data.userId || 'admin',
      action: data.action,
      entityType: data.entityType || 'General',
      entityId: data.entityId ? String(data.entityId) : '',
      metadata: data.metadata || {},
      ipHash: data.ipHash,
      userAgent: data.userAgent,
    }).returning();
    return formatRow(inserted[0]);
  } catch (error) {
    console.error('Audit log insertion failed:', error);
    return null;
  }
}

// -------------------------------------------------------------
// ADMIN SESSIONS & AUTHENTICATION
// -------------------------------------------------------------
export async function verifyAdminLogin(email: string, passwordAttempt: string) {
  const user = await db.select().from(schema.users).where(eq(schema.users.email, email.trim())).limit(1);
  if (user.length === 0) {
    // If table has default user with another email or empty, fallback check
    if (email.trim() === 'gunjanstha01@gmail.com' && passwordAttempt === 'gunjan2026') {
      return { success: true, email: 'gunjanstha01@gmail.com' };
    }
    return { success: false, message: 'Invalid administrator email.' };
  }

  const u = user[0];
  const expectedPassword = u.passwordHash || 'gunjan2026';
  if (passwordAttempt === expectedPassword) {
    await db.update(schema.users)
      .set({ lastLoginAt: new Date() })
      .where(eq(schema.users.id, u.id));
    return { success: true, email: u.email };
  }

  return { success: false, message: 'Invalid administrator password.' };
}

export async function updateAdminCredentials(email: string, newPassword?: string) {
  const existing = await db.select().from(schema.users).limit(1);
  if (existing.length === 0) {
    await db.insert(schema.users).values({
      uid: 'admin_gunjan',
      email,
      passwordHash: newPassword || 'gunjan2026',
      isActive: true,
      lastLoginAt: new Date(),
    });
    return { success: true, email };
  }

  const updateSet: any = { email, updatedAt: new Date() };
  if (newPassword && newPassword.trim()) {
    updateSet.passwordHash = newPassword.trim();
  }

  await db.update(schema.users).set(updateSet).where(eq(schema.users.id, existing[0].id));
  return { success: true, email };
}

export async function getAdminSessions() {
  const rows = await db.select().from(schema.adminSessions).orderBy(desc(schema.adminSessions.lastActiveAt));
  return rows;
}

export async function upsertAdminSession(session: {
  id: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress?: string;
  location?: string;
  screenResolution?: string;
}) {
  const result = await db.insert(schema.adminSessions)
    .values({
      id: session.id,
      deviceType: session.deviceType,
      browser: session.browser,
      os: session.os,
      ipAddress: session.ipAddress,
      location: session.location,
      screenResolution: session.screenResolution,
      lastActiveAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.adminSessions.id,
      set: {
        lastActiveAt: new Date(),
        location: session.location,
      },
    })
    .returning();
  return result[0];
}

export async function deleteAdminSession(id: string) {
  await db.delete(schema.adminSessions).where(eq(schema.adminSessions.id, id));
  return { success: true };
}

export async function deleteAllAdminSessions() {
  await db.delete(schema.adminSessions);
  return { success: true };
}

// -------------------------------------------------------------
// RESET / RESTORE TO INITIAL POSTGRESQL STATE
// -------------------------------------------------------------
export async function resetAndReseedDatabase() {
  console.log('Resetting and reseeding PostgreSQL database...');
  // Delete all rows in order of foreign key dependency
  await db.delete(schema.auditLogs);
  await db.delete(schema.contactMessages);
  await db.delete(schema.projectImages);
  await db.delete(schema.projects);
  await db.delete(schema.blogPosts);
  await db.delete(schema.blogCategories);
  await db.delete(schema.contentCategories);
  await db.delete(schema.galleryImages);
  await db.delete(schema.services);
  await db.delete(schema.skills);
  await db.delete(schema.skillCategories);
  await db.delete(schema.experiences);
  await db.delete(schema.educations);
  await db.delete(schema.socialLinks);
  await db.delete(schema.siteSettings);
  await db.delete(schema.profiles);
  await db.delete(schema.adminSessions);
  await db.delete(schema.users);

  // Re-seed from scratch
  await seedDatabaseIfEmpty();
  return { success: true, message: 'Database reset and re-seeded successfully.' };
}
