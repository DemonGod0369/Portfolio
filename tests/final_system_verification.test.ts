import { describe, it, expect } from 'vitest';
import * as queries from '../src/db/queries.ts';
import { prisma } from '../src/db/index.ts';

describe('Comprehensive Final Test Case: Database Structure, Functions, and Full CRUD Lifecycle', () => {
  // Test Data Trackers for clean teardown
  const createdIds = {
    educationId: 0,
    serviceId: 0,
    galleryImageId: 0,
    blogPostId: 0,
    socialLinkId: 0,
    contentCategoryId: 0,
  };

  /* -------------------------------------------------------------------------
   * 1. DATABASE STRUCTURE & PRISMA SCHEMA VERIFICATION
   * ------------------------------------------------------------------------- */
  describe('Database Structure & Model Integrity', () => {
    it('verifies all expected core models exist and are queryable via Prisma client', async () => {
      // 1. User
      const userCount = await prisma.user.count();
      expect(userCount).toBeGreaterThan(0);

      // 2. Profile
      const profile = await prisma.profile.findFirst();
      expect(profile).toBeDefined();
      expect(profile?.name).toBe('Gunjan Shrestha');

      // 3. Education
      const eduCount = await prisma.education.count();
      expect(typeof eduCount).toBe('number');

      // 4. Experience
      const expCount = await prisma.experience.count();
      expect(typeof expCount).toBe('number');

      // 5. SkillCategory & Skill
      const skillCatCount = await prisma.skillCategory.count();
      const skillCount = await prisma.skill.count();
      expect(typeof skillCatCount).toBe('number');
      expect(typeof skillCount).toBe('number');

      // 6. Service
      const serviceCount = await prisma.service.count();
      expect(typeof serviceCount).toBe('number');

      // 7. Project & ProjectImage
      const projCount = await prisma.project.count();
      expect(typeof projCount).toBe('number');

      // 8. GalleryImage
      const galleryCount = await prisma.galleryImage.count();
      expect(typeof galleryCount).toBe('number');

      // 9. BlogCategory & BlogPost
      const blogPostCount = await prisma.blogPost.count();
      expect(typeof blogPostCount).toBe('number');

      // 10. ContactMessage
      const messageCount = await prisma.contactMessage.count();
      expect(typeof messageCount).toBe('number');

      // 11. SocialLink
      const socialCount = await prisma.socialLink.count();
      expect(typeof socialCount).toBe('number');

      // 12. SiteSetting
      const siteSetting = await prisma.siteSetting.findFirst();
      expect(siteSetting).toBeDefined();

      // 13. ContentCategory
      const catCount = await prisma.contentCategory.count();
      expect(typeof catCount).toBe('number');

      // 14. AdminSession
      const sessionCount = await prisma.adminSession.count();
      expect(typeof sessionCount).toBe('number');

      // 15. AuditLog
      const auditCount = await prisma.auditLog.count();
      expect(typeof auditCount).toBe('number');
    });

    it('verifies column naming conventions, camelCase mapping, and relational integrity', async () => {
      // Check that camelCase fields from Prisma correctly read mapped snake_case PostgreSQL columns
      const sampleUser = await prisma.user.findFirst();
      expect(sampleUser).toHaveProperty('id');
      expect(sampleUser).toHaveProperty('uid');
      expect(sampleUser).toHaveProperty('email');
      expect(sampleUser).toHaveProperty('passwordHash');
      expect(sampleUser).toHaveProperty('isActive');
      expect(sampleUser).toHaveProperty('createdAt');
      expect(sampleUser).toHaveProperty('updatedAt');

      const sampleProfile = await prisma.profile.findFirst();
      expect(sampleProfile).toHaveProperty('shortBio');
      expect(sampleProfile).toHaveProperty('longBio');
      expect(sampleProfile).toHaveProperty('profileImageUrl');
      expect(sampleProfile).toHaveProperty('dateOfBirth');
      expect(sampleProfile).toHaveProperty('whatsappNumber');
    });
  });

  /* -------------------------------------------------------------------------
   * 2. EDUCATION CRUD: Create, Read, Update, Delete
   * ------------------------------------------------------------------------- */
  describe('Education Functions & CRUD Operations', () => {
    it('CREATE: creates education entry with expected fields', async () => {
      const created = await queries.createEducation({
        institution: 'Tribhuvan University',
        qualification: 'Bachelor of Science in Computer Science & Information Technology',
        field: 'Computer Science',
        location: 'Kathmandu, Nepal',
        startDate: '2018',
        endDate: '2022',
        description: 'Focus on distributed computing and relational databases.',
        displayOrder: 10,
        published: true,
      });

      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.institution).toBe('Tribhuvan University');
      createdIds.educationId = Number(created.id);
    });

    it('READ: retrieves the created education entry', async () => {
      const all = await queries.getEducations();
      const found = all.find(e => Number(e.id) === createdIds.educationId);
      expect(found).toBeDefined();
      expect(found?.qualification).toBe('Bachelor of Science in Computer Science & Information Technology');
    });

    it('UPDATE: updates education qualification and display order', async () => {
      const updated = await queries.updateEducation(createdIds.educationId, {
        qualification: 'B.Sc. CSIT (Honors)',
        displayOrder: 5,
      });
      expect(updated.qualification).toBe('B.Sc. CSIT (Honors)');
      expect(updated.displayOrder).toBe(5);
    });

    it('DELETE: deletes the education record and ensures it is purged', async () => {
      const deleted = await queries.deleteEducation(createdIds.educationId);
      expect(Number(deleted.id)).toBe(createdIds.educationId);

      const allAfter = await queries.getEducations();
      expect(allAfter.find(e => Number(e.id) === createdIds.educationId)).toBeUndefined();
    });
  });

  /* -------------------------------------------------------------------------
   * 3. SERVICE CRUD: Create, Read, Update, Delete
   * ------------------------------------------------------------------------- */
  describe('Service Functions & CRUD Operations', () => {
    it('CREATE: creates service offering', async () => {
      const timestamp = Date.now();
      const created = await queries.createService({
        title: 'Full-Stack Architecture & Cloud Engineering',
        slug: `cloud-engineering-${timestamp}`,
        shortDescription: 'High-availability infrastructure with automated scaling.',
        description: 'Design and deployment of resilient microservices on Google Cloud and PostgreSQL.',
        icon: 'Server',
        displayOrder: 9,
        featured: true,
        published: true,
      });

      expect(created).toBeDefined();
      expect(created.title).toBe('Full-Stack Architecture & Cloud Engineering');
      createdIds.serviceId = Number(created.id);
    });

    it('READ: retrieves the newly created service', async () => {
      const services = await queries.getServices();
      const found = services.find(s => Number(s.id) === createdIds.serviceId);
      expect(found).toBeDefined();
      expect(found?.icon).toBe('Server');
    });

    it('UPDATE: modifies service title and featured status', async () => {
      const updated = await queries.updateService(createdIds.serviceId, {
        title: 'Enterprise Architecture & Cloud Systems',
        featured: false,
      });
      expect(updated.title).toBe('Enterprise Architecture & Cloud Systems');
      expect(updated.featured).toBe(false);
    });

    it('DELETE: deletes service and verifies removal', async () => {
      const deleted = await queries.deleteService(createdIds.serviceId);
      expect(Number(deleted.id)).toBe(createdIds.serviceId);

      const after = await queries.getServices();
      expect(after.find(s => Number(s.id) === createdIds.serviceId)).toBeUndefined();
    });
  });

  /* -------------------------------------------------------------------------
   * 4. GALLERY IMAGE CRUD: Create, Read, Update, Delete
   * ------------------------------------------------------------------------- */
  describe('Gallery Image Functions & CRUD Operations', () => {
    it('CREATE: adds high-resolution visual asset to gallery', async () => {
      const created = await queries.createGalleryImage({
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
        altText: 'Atmospheric Cloud Computing Visualization',
        caption: 'Global Cloud Network Architecture',
        category: 'Architecture',
        width: 1920,
        height: 1080,
        featured: true,
        published: true,
        displayOrder: 1,
      });

      expect(created).toBeDefined();
      expect(created.altText).toBe('Atmospheric Cloud Computing Visualization');
      createdIds.galleryImageId = Number(created.id);
    });

    it('READ: retrieves gallery image by id', async () => {
      const list = await queries.getGalleryImages();
      const found = list.find(g => Number(g.id) === createdIds.galleryImageId);
      expect(found).toBeDefined();
      expect(found?.category).toBe('Architecture');
    });

    it('UPDATE: updates gallery image caption and featured flag', async () => {
      const updated = await queries.updateGalleryImage(createdIds.galleryImageId, {
        caption: 'Global Distributed Mesh Network',
        featured: false,
      });
      expect(updated.caption).toBe('Global Distributed Mesh Network');
      expect(updated.featured).toBe(false);
    });

    it('DELETE: removes gallery image and verifies DB cleanup', async () => {
      const deleted = await queries.deleteGalleryImage(createdIds.galleryImageId);
      expect(Number(deleted.id)).toBe(createdIds.galleryImageId);

      const listAfter = await queries.getGalleryImages();
      expect(listAfter.find(g => Number(g.id) === createdIds.galleryImageId)).toBeUndefined();
    });
  });

  /* -------------------------------------------------------------------------
   * 5. BLOG POST CRUD: Create, Read, Update, Delete
   * ------------------------------------------------------------------------- */
  describe('Blog Post Functions & CRUD Operations', () => {
    it('CREATE: creates blog post with category auto-link and tags', async () => {
      const timestamp = Date.now();
      const created = await queries.createBlogPost({
        title: 'Building Resilient Distributed Systems on PostgreSQL',
        slug: `distributed-systems-postgresql-${timestamp}`,
        excerpt: 'Key strategies for horizontal scalability and transactional isolation.',
        content: 'PostgreSQL provides robust transactional integrity with serializable isolation...',
        category: 'Engineering & DevOps',
        readingTime: 6,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        featured: true,
        tags: ['PostgreSQL', 'Cloud', 'Architecture'],
      });

      expect(created).toBeDefined();
      expect(created.title).toBe('Building Resilient Distributed Systems on PostgreSQL');
      expect(created.tags).toContain('PostgreSQL');
      createdIds.blogPostId = Number(created.id);
    });

    it('READ: retrieves the created blog post', async () => {
      const posts = await queries.getBlogPosts();
      const found = posts.find(p => Number(p.id) === createdIds.blogPostId);
      expect(found).toBeDefined();
      expect(found?.status).toBe('PUBLISHED');
      expect(found?.readingTime).toBe(6);
    });

    it('UPDATE: updates blog post reading time and title', async () => {
      const updated = await queries.updateBlogPost(createdIds.blogPostId, {
        title: 'Building Resilient Distributed Systems on PostgreSQL (Second Edition)',
        readingTime: 8,
      });
      expect(updated.title).toContain('(Second Edition)');
      expect(updated.readingTime).toBe(8);
    });

    it('DELETE: permanently removes blog post', async () => {
      const deleted = await queries.deleteBlogPost(createdIds.blogPostId);
      expect(Number(deleted.id)).toBe(createdIds.blogPostId);

      const postsAfter = await queries.getBlogPosts();
      expect(postsAfter.find(p => Number(p.id) === createdIds.blogPostId)).toBeUndefined();
    });
  });

  /* -------------------------------------------------------------------------
   * 6. SOCIAL LINK CRUD: Create, Read, Update, Delete
   * ------------------------------------------------------------------------- */
  describe('Social Link Functions & CRUD Operations', () => {
    it('CREATE: adds professional social link', async () => {
      const created = await queries.createSocialLink({
        platform: 'GitHub',
        label: 'Source Code & Open Contributions',
        url: 'https://github.com/gunjanshrestha-dev',
        icon: 'Github',
        displayOrder: 2,
        published: true,
      });

      expect(created).toBeDefined();
      expect(created.platform).toBe('GitHub');
      createdIds.socialLinkId = Number(created.id);
    });

    it('READ: queries social links list', async () => {
      const links = await queries.getSocialLinks();
      const found = links.find(l => Number(l.id) === createdIds.socialLinkId);
      expect(found).toBeDefined();
      expect(found?.label).toBe('Source Code & Open Contributions');
    });

    it('UPDATE: updates social link URL and label', async () => {
      const updated = await queries.updateSocialLink(createdIds.socialLinkId, {
        label: 'Engineering Repository',
        url: 'https://github.com/gunjan-official',
      });
      expect(updated.label).toBe('Engineering Repository');
      expect(updated.url).toBe('https://github.com/gunjan-official');
    });

    it('DELETE: deletes social link', async () => {
      const deleted = await queries.deleteSocialLink(createdIds.socialLinkId);
      expect(Number(deleted.id)).toBe(createdIds.socialLinkId);

      const after = await queries.getSocialLinks();
      expect(after.find(l => Number(l.id) === createdIds.socialLinkId)).toBeUndefined();
    });
  });

  /* -------------------------------------------------------------------------
   * 7. CONTENT CATEGORY CRUD: Create, Read, Update, Delete
   * ------------------------------------------------------------------------- */
  describe('Content Category Functions & CRUD Operations', () => {
    it('CREATE: adds new content category taxonomy', async () => {
      const timestamp = Date.now();
      const created = await queries.createContentCategory({
        name: 'Systems Architecture',
        slug: `systems-architecture-${timestamp}`,
        type: 'EXPERIENCE',
        description: 'Distributed architectures and platform engineering.',
        displayOrder: 3,
      });

      expect(created).toBeDefined();
      expect(created.name).toBe('Systems Architecture');
      createdIds.contentCategoryId = Number(created.id);
    });

    it('READ: queries content categories list', async () => {
      const categories = await queries.getContentCategories();
      const found = categories.find(c => Number(c.id) === createdIds.contentCategoryId);
      expect(found).toBeDefined();
      expect(found?.type).toBe('EXPERIENCE');
    });

    it('UPDATE: updates description and display order', async () => {
      const updated = await queries.updateContentCategory(createdIds.contentCategoryId, {
        description: 'Updated distributed cloud architectures and engineering.',
        displayOrder: 1,
      });
      expect(updated.description).toContain('Updated');
      expect(updated.displayOrder).toBe(1);
    });

    it('DELETE: removes content category', async () => {
      const deleted = await queries.deleteContentCategory(createdIds.contentCategoryId);
      expect(Number(deleted.id)).toBe(createdIds.contentCategoryId);

      const after = await queries.getContentCategories();
      expect(after.find(c => Number(c.id) === createdIds.contentCategoryId)).toBeUndefined();
    });
  });

  /* -------------------------------------------------------------------------
   * 8. FUNCTION NAMING CONVENTIONS & CONTRACT CONSISTENCY
   * ------------------------------------------------------------------------- */
  describe('Function Naming Conventions & Predictable Signatures', () => {
    it('verifies standard query function naming conventions across all repositories', () => {
      // Portfolio & Public Aggregations
      expect(typeof queries.getPublicPortfolioData).toBe('function');

      // Profile
      expect(typeof queries.getProfile).toBe('function');
      expect(typeof queries.updateProfile).toBe('function');

      // Experience CRUD
      expect(typeof queries.getExperiences).toBe('function');
      expect(typeof queries.createExperience).toBe('function');
      expect(typeof queries.updateExperience).toBe('function');
      expect(typeof queries.deleteExperience).toBe('function');

      // Education CRUD
      expect(typeof queries.getEducations).toBe('function');
      expect(typeof queries.createEducation).toBe('function');
      expect(typeof queries.updateEducation).toBe('function');
      expect(typeof queries.deleteEducation).toBe('function');

      // Skills & Skill Categories CRUD
      expect(typeof queries.getSkillCategories).toBe('function');
      expect(typeof queries.createSkillCategory).toBe('function');
      expect(typeof queries.updateSkillCategory).toBe('function');
      expect(typeof queries.deleteSkillCategory).toBe('function');
      expect(typeof queries.getSkills).toBe('function');
      expect(typeof queries.createSkill).toBe('function');
      expect(typeof queries.updateSkill).toBe('function');
      expect(typeof queries.deleteSkill).toBe('function');

      // Services CRUD
      expect(typeof queries.getServices).toBe('function');
      expect(typeof queries.createService).toBe('function');
      expect(typeof queries.updateService).toBe('function');
      expect(typeof queries.deleteService).toBe('function');

      // Projects CRUD
      expect(typeof queries.getProjects).toBe('function');
      expect(typeof queries.createProject).toBe('function');
      expect(typeof queries.updateProject).toBe('function');
      expect(typeof queries.deleteProject).toBe('function');

      // Gallery Images CRUD
      expect(typeof queries.getGalleryImages).toBe('function');
      expect(typeof queries.createGalleryImage).toBe('function');
      expect(typeof queries.updateGalleryImage).toBe('function');
      expect(typeof queries.deleteGalleryImage).toBe('function');

      // Blog Posts & Categories CRUD
      expect(typeof queries.getBlogPosts).toBe('function');
      expect(typeof queries.createBlogPost).toBe('function');
      expect(typeof queries.updateBlogPost).toBe('function');
      expect(typeof queries.deleteBlogPost).toBe('function');
      expect(typeof queries.getBlogCategories).toBe('function');

      // Contact Messages CRUD
      expect(typeof queries.getContactMessages).toBe('function');
      expect(typeof queries.submitContactMessage).toBe('function');
      expect(typeof queries.updateContactMessageStatus).toBe('function');
      expect(typeof queries.deleteContactMessage).toBe('function');

      // Social Links CRUD
      expect(typeof queries.getSocialLinks).toBe('function');
      expect(typeof queries.createSocialLink).toBe('function');
      expect(typeof queries.updateSocialLink).toBe('function');
      expect(typeof queries.deleteSocialLink).toBe('function');

      // Content Categories CRUD
      expect(typeof queries.getContentCategories).toBe('function');
      expect(typeof queries.createContentCategory).toBe('function');
      expect(typeof queries.updateContentCategory).toBe('function');
      expect(typeof queries.deleteContentCategory).toBe('function');

      // Site Settings
      expect(typeof queries.getSiteSettings).toBe('function');
      expect(typeof queries.updateSiteSettings).toBe('function');

      // Authentication & Security
      expect(typeof queries.verifyAdminLogin).toBe('function');
      expect(typeof queries.updateAdminCredentials).toBe('function');
      expect(typeof queries.generatePasswordResetToken).toBe('function');
      expect(typeof queries.resetPasswordWithCode).toBe('function');
      expect(typeof queries.hashPassword).toBe('function');
      expect(typeof queries.comparePassword).toBe('function');
      expect(typeof queries.validatePasswordStrength).toBe('function');
      expect(typeof queries.isBcryptHash).toBe('function');
    });
  });
});
