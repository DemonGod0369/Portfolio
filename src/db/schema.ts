import { pgTable, text, timestamp, boolean, integer, jsonb, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users (Admin User with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Profile
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  headline: text('headline'),
  shortBio: text('short_bio'),
  longBio: text('long_bio'),
  profileImageUrl: text('profile_image_url'),
  email: text('email'),
  phone: text('phone'),
  location: text('location'),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Education
export const educations = pgTable('educations', {
  id: serial('id').primaryKey(),
  institution: text('institution').notNull(),
  qualification: text('qualification').notNull(),
  field: text('field'),
  location: text('location'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  description: text('description'),
  displayOrder: integer('display_order').default(0).notNull(),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Experience
export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  organization: text('organization'),
  location: text('location'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  isCurrent: boolean('is_current').default(false).notNull(),
  shortDescription: text('short_description'),
  description: text('description'),
  tags: text('tags').array(), // PostgreSQL string array
  imageUrl: text('image_url'),
  featured: boolean('featured').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. SkillCategory
export const skillCategories = pgTable('skill_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  displayOrder: integer('display_order').default(0).notNull(),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. Skill
export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => skillCategories.id, { onDelete: 'restrict' }).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  displayOrder: integer('display_order').default(0).notNull(),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 7. Services
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description'),
  description: text('description'),
  icon: text('icon'),
  displayOrder: integer('display_order').default(0).notNull(),
  featured: boolean('featured').default(false).notNull(),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 8. Projects
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category'),
  shortSummary: text('short_summary'),
  overview: text('overview'),
  problem: text('problem'),
  approach: text('approach'),
  design: text('design'),
  technology: text('technology'),
  result: text('result'),
  featured: boolean('featured').default(false).notNull(),
  published: boolean('published').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 9. ProjectImage
export const projectImages = pgTable('project_images', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  altText: text('alt_text'),
  caption: text('caption'),
  width: integer('width'),
  height: integer('height'),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 10. GalleryImage
export const galleryImages = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  altText: text('alt_text').notNull(),
  caption: text('caption'),
  category: text('category'),
  width: integer('width'),
  height: integer('height'),
  featured: boolean('featured').default(false).notNull(),
  published: boolean('published').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 11. BlogCategory
export const blogCategories = pgTable('blog_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 12. BlogPost
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  coverImageUrl: text('cover_image_url'),
  content: text('content').notNull(),
  categoryId: integer('category_id').references(() => blogCategories.id, { onDelete: 'set null' }),
  readingTime: integer('reading_time'),
  publishedAt: timestamp('published_at'),
  status: text('status').default('DRAFT').notNull(), // DRAFT | PUBLISHED | ARCHIVED
  featured: boolean('featured').default(false).notNull(),
  tags: text('tags').array(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  canonicalUrl: text('canonical_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 13. ContactMessage
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('NEW').notNull(), // NEW | READ | ARCHIVED
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 14. SocialLink
export const socialLinks = pgTable('social_links', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(),
  label: text('label').notNull(),
  url: text('url').notNull(),
  icon: text('icon'),
  displayOrder: integer('display_order').default(0).notNull(),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 15. SiteSetting
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteName: text('site_name').notNull(),
  siteDescription: text('site_description'),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  profileImageUrl: text('profile_image_url'),
  email: text('email'),
  phone: text('phone'),
  location: text('location'),
  footerText: text('footer_text'),
  accentColor: text('accent_color'),
  maintenanceMode: boolean('maintenance_mode').default(false).notNull(),
  analyticsEnabled: boolean('analytics_enabled').default(false).notNull(),
  defaultSeoTitle: text('default_seo_title'),
  defaultSeoDescription: text('default_seo_description'),
  defaultOgImageUrl: text('default_og_image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 16. AuditLog
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  metadata: jsonb('metadata'),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const skillCategoriesRelations = relations(skillCategories, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
}));
