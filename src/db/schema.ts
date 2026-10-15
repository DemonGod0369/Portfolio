/**
 * ==============================================================================
 * Gunjan Shrestha Portfolio & Executive CMS Platform — Master Database Schema
 * ==============================================================================
 * Synchronized with PostgreSQL 14+/15+/16+, Google Cloud SQL, and prisma/schema.prisma
 * 
 * Provides:
 * 1. Strict TypeScript Interfaces & Domain Models for all 18 tables
 * 2. Insert and Update Payload Types (with partials and auto-generated fields omitted)
 * 3. PostgreSQL Table and Column Name Mappings (snake_case DB <-> camelCase TS)
 * 4. Runtime Table Metadata Dictionary
 * 5. Complete DDL Statements for Local Migration / Initialization
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. ENUMS & CONSTANTS
// ------------------------------------------------------------------------------

export type PhoneDisplayOption = 'both' | 'primary' | 'secondary' | 'none';
export type AvailabilityStatus = 'available' | 'advisory' | 'busy';
export type BlogPostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ContactMessageStatus = 'NEW' | 'READ' | 'ARCHIVED';
export type ContentCategoryType = 'CASE_STUDY' | 'JOURNAL' | 'GALLERY' | 'GENERAL' | 'OPERATIONS' | 'FINANCE' | 'DESIGN' | 'TECHNOLOGY';
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export const TABLES = {
  USERS: 'users',
  PROFILES: 'profiles',
  EDUCATIONS: 'educations',
  EXPERIENCES: 'experiences',
  SKILL_CATEGORIES: 'skill_categories',
  SKILLS: 'skills',
  SERVICES: 'services',
  PROJECTS: 'projects',
  PROJECT_IMAGES: 'project_images',
  GALLERY_IMAGES: 'gallery_images',
  BLOG_CATEGORIES: 'blog_categories',
  BLOG_POSTS: 'blog_posts',
  CONTACT_MESSAGES: 'contact_messages',
  SOCIAL_LINKS: 'social_links',
  SITE_SETTINGS: 'site_settings',
  CONTENT_CATEGORIES: 'content_categories',
  ADMIN_SESSIONS: 'admin_sessions',
  AUDIT_LOGS: 'audit_logs',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

// ------------------------------------------------------------------------------
// 2. MODEL INTERFACES (Full Row Data)
// ------------------------------------------------------------------------------

/** 1. Super Administrator Users (`users`) */
export interface User {
  id: number;
  uid: string;
  email: string;
  passwordHash: string | null;
  isActive: boolean;
  lastLoginAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 2. Executive Profile (`profiles`) */
export interface Profile {
  id: number;
  name: string;
  headline: string | null;
  shortBio: string | null;
  longBio: string | null;
  profileImageUrl: string | null;
  visitingCardImageUrl: string | null;
  dateOfBirth: string | null;
  address: string | null;
  email: string | null;
  alternateEmail: string | null;
  primaryEmailLabel: string | null;
  alternateEmailLabel: string | null;
  phone: string | null;
  secondaryPhone: string | null;
  phoneDisplayOption: PhoneDisplayOption | string | null;
  whatsappNumber: string | null;
  location: string | null;
  website: string | null;
  availabilityStatus: AvailabilityStatus | string | null;
  availabilityCustomNote: string | null;
  timezone: string | null;
  responseTime: string | null;
  languagesSpoken: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 3. Academic Degrees & Qualifications (`educations`) */
export interface Education {
  id: number;
  institution: string;
  qualification: string;
  field: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  displayOrder: number;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 4. Career Milestones & Operations (`experiences`) */
export interface Experience {
  id: number;
  category: string;
  title: string;
  roleTitle: string | null;
  organization: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  shortDescription: string | null;
  description: string | null;
  tags: string[];
  imageUrl: string | null;
  featured: boolean;
  displayOrder: number;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 5. Skill Categories (`skill_categories`) */
export interface SkillCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  skills?: Skill[];
}

/** 6. Technical, Operational & Craft Skills (`skills`) */
export interface Skill {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: SkillCategory;
}

/** 7. Advisory & Service Offerings (`services`) */
export interface Service {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  featured: boolean;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 8. Projects & Case Studies (`projects`) */
export interface Project {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  shortSummary: string | null;
  overview: string | null;
  problem: string | null;
  approach: string | null;
  design: string | null;
  technology: string | null;
  result: string | null;
  heroImage: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  images?: ProjectImage[];
}

/** 9. Case Study Images (`project_images`) */
export interface ProjectImage {
  id: number;
  projectId: number;
  url: string;
  altText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  displayOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  project?: Project;
}

/** 10. Fine Jewelry & Operational Gallery Assets (`gallery_images`) */
export interface GalleryImage {
  id: number;
  url: string;
  altText: string;
  caption: string | null;
  category: string | null;
  width: number | null;
  height: number | null;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 11. Editorial Blog Categories (`blog_categories`) */
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  posts?: BlogPost[];
}

/** 12. Editorial Journal Articles (`blog_posts`) */
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  content: string;
  category: string | null;
  categoryId: number | null;
  readingTime: number | null;
  publishedAt: Date | string | null;
  status: BlogPostStatus | string;
  featured: boolean;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  blogCategory?: BlogCategory | null;
}

/** 13. Contact Inquiries (`contact_messages`) */
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus | string;
  ipHash: string | null;
  userAgent: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 14. Verified Social Links (`social_links`) */
export interface SocialLink {
  id: number;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
  displayOrder: number;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 15. Global Site Settings & SEO Configuration (`site_settings`) */
export interface SiteSetting {
  id: number;
  siteName: string;
  siteDescription: string | null;
  canonicalUrl: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  profileImageUrl: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  footerText: string | null;
  accentColor: string | null;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
  defaultOgImageUrl: string | null;
  seoKeywords: string | null;
  allowIndexing: boolean;
  googleSiteVerification: string | null;
  googleAnalyticsId: string | null;
  customHeadSnippet: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 16. Cross-Cutting Content Taxonomy (`content_categories`) */
export interface ContentCategory {
  id: number;
  name: string;
  slug: string;
  type: ContentCategoryType | string;
  description: string | null;
  displayOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** 17. Multi-Device Admin Sessions (`admin_sessions`) */
export interface AdminSession {
  id: string;
  deviceType: DeviceType | string;
  browser: string;
  os: string;
  ipAddress: string | null;
  location: string | null;
  screenResolution: string | null;
  lastActiveAt: Date | string;
  createdAt: Date | string;
}

/** 18. Enterprise Audit Logs (`audit_logs`) */
export interface AuditLog {
  id: number;
  userId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, any> | null;
  ipHash: string | null;
  userAgent: string | null;
  createdAt: Date | string;
}

// ------------------------------------------------------------------------------
// 3. INSERT & UPDATE INPUT TYPES
// ------------------------------------------------------------------------------

export type UserInsert = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>;

export type ProfileInsert = Omit<Profile, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'createdAt'>>;

export type EducationInsert = Omit<Education, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type EducationUpdate = Partial<Omit<Education, 'id' | 'createdAt'>>;

export type ExperienceInsert = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type ExperienceUpdate = Partial<Omit<Experience, 'id' | 'createdAt'>>;

export type SkillCategoryInsert = Omit<SkillCategory, 'id' | 'createdAt' | 'updatedAt' | 'skills'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type SkillCategoryUpdate = Partial<Omit<SkillCategory, 'id' | 'createdAt'>>;

export type SkillInsert = Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'category'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type SkillUpdate = Partial<Omit<Skill, 'id' | 'createdAt'>>;

export type ServiceInsert = Omit<Service, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type ServiceUpdate = Partial<Omit<Service, 'id' | 'createdAt'>>;

export type ProjectInsert = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'images'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type ProjectUpdate = Partial<Omit<Project, 'id' | 'createdAt'>>;

export type ProjectImageInsert = Omit<ProjectImage, 'id' | 'createdAt' | 'updatedAt' | 'project'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type ProjectImageUpdate = Partial<Omit<ProjectImage, 'id' | 'createdAt'>>;

export type GalleryImageInsert = Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type GalleryImageUpdate = Partial<Omit<GalleryImage, 'id' | 'createdAt'>>;

export type BlogCategoryInsert = Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt' | 'posts'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type BlogCategoryUpdate = Partial<Omit<BlogCategory, 'id' | 'createdAt'>>;

export type BlogPostInsert = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'blogCategory'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type BlogPostUpdate = Partial<Omit<BlogPost, 'id' | 'createdAt'>>;

export type ContactMessageInsert = Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type ContactMessageUpdate = Partial<Omit<ContactMessage, 'id' | 'createdAt'>>;

export type SocialLinkInsert = Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type SocialLinkUpdate = Partial<Omit<SocialLink, 'id' | 'createdAt'>>;

export type SiteSettingInsert = Omit<SiteSetting, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type SiteSettingUpdate = Partial<Omit<SiteSetting, 'id' | 'createdAt'>>;

export type ContentCategoryInsert = Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: Date | string; updatedAt?: Date | string };
export type ContentCategoryUpdate = Partial<Omit<ContentCategory, 'id' | 'createdAt'>>;

export type AdminSessionInsert = Omit<AdminSession, 'createdAt' | 'lastActiveAt'> & { createdAt?: Date | string; lastActiveAt?: Date | string };
export type AdminSessionUpdate = Partial<AdminSession>;

export type AuditLogInsert = Omit<AuditLog, 'id' | 'createdAt'> & { id?: number; createdAt?: Date | string };
export type AuditLogUpdate = Partial<Omit<AuditLog, 'id' | 'createdAt'>>;

// ------------------------------------------------------------------------------
// 4. DATABASE COLUMN DICTIONARY (PostgreSQL snake_case <-> TypeScript camelCase)
// ------------------------------------------------------------------------------

export const SCHEMA_COLUMNS = {
  users: [
    'id', 'uid', 'email', 'password_hash', 'is_active', 'last_login_at', 'created_at', 'updated_at'
  ],
  profiles: [
    'id', 'name', 'headline', 'short_bio', 'long_bio', 'profile_image_url', 'visiting_card_image_url',
    'date_of_birth', 'address', 'email', 'alternate_email', 'primary_email_label', 'alternate_email_label',
    'phone', 'secondary_phone', 'phone_display_option', 'whatsapp_number', 'location', 'website',
    'availability_status', 'availability_custom_note', 'timezone', 'response_time', 'languages_spoken',
    'created_at', 'updated_at'
  ],
  educations: [
    'id', 'institution', 'qualification', 'field', 'location', 'start_date', 'end_date',
    'description', 'display_order', 'published', 'created_at', 'updated_at'
  ],
  experiences: [
    'id', 'category', 'title', 'role_title', 'organization', 'location', 'start_date', 'end_date',
    'is_current', 'short_description', 'description', 'tags', 'image_url', 'featured',
    'display_order', 'published', 'created_at', 'updated_at'
  ],
  skill_categories: [
    'id', 'name', 'slug', 'description', 'display_order', 'published', 'created_at', 'updated_at'
  ],
  skills: [
    'id', 'category_id', 'name', 'slug', 'description', 'icon', 'display_order', 'published',
    'created_at', 'updated_at'
  ],
  services: [
    'id', 'title', 'slug', 'short_description', 'description', 'icon', 'display_order',
    'featured', 'published', 'created_at', 'updated_at'
  ],
  projects: [
    'id', 'title', 'slug', 'category', 'short_summary', 'overview', 'problem', 'approach',
    'design', 'technology', 'result', 'hero_image', 'live_url', 'github_url', 'seo_title',
    'seo_description', 'canonical_url', 'featured', 'published', 'display_order',
    'created_at', 'updated_at'
  ],
  project_images: [
    'id', 'project_id', 'url', 'alt_text', 'caption', 'width', 'height', 'display_order',
    'created_at', 'updated_at'
  ],
  gallery_images: [
    'id', 'url', 'alt_text', 'caption', 'category', 'width', 'height', 'featured',
    'published', 'display_order', 'created_at', 'updated_at'
  ],
  blog_categories: [
    'id', 'name', 'slug', 'description', 'created_at', 'updated_at'
  ],
  blog_posts: [
    'id', 'title', 'slug', 'excerpt', 'cover_image_url', 'content', 'category', 'category_id',
    'reading_time', 'published_at', 'status', 'featured', 'tags', 'seo_title', 'seo_description',
    'canonical_url', 'created_at', 'updated_at'
  ],
  contact_messages: [
    'id', 'name', 'email', 'subject', 'message', 'status', 'ip_hash', 'user_agent',
    'created_at', 'updated_at'
  ],
  social_links: [
    'id', 'platform', 'label', 'url', 'icon', 'display_order', 'published', 'created_at', 'updated_at'
  ],
  site_settings: [
    'id', 'site_name', 'site_description', 'canonical_url', 'logo_url', 'favicon_url',
    'profile_image_url', 'email', 'phone', 'location', 'footer_text', 'accent_color',
    'maintenance_mode', 'analytics_enabled', 'default_seo_title', 'default_seo_description',
    'default_og_image_url', 'seo_keywords', 'allow_indexing', 'google_site_verification',
    'google_analytics_id', 'custom_head_snippet', 'created_at', 'updated_at'
  ],
  content_categories: [
    'id', 'name', 'slug', 'type', 'description', 'display_order', 'created_at', 'updated_at'
  ],
  admin_sessions: [
    'id', 'device_type', 'browser', 'os', 'ip_address', 'location', 'screen_resolution',
    'last_active_at', 'created_at'
  ],
  audit_logs: [
    'id', 'user_id', 'action', 'entity_type', 'entity_id', 'metadata', 'ip_hash', 'user_agent',
    'created_at'
  ],
} as const;

// ------------------------------------------------------------------------------
// 5. MASTER DDL STATEMENTS FOR LOCAL POSTGRESQL INITIALIZATION
// ------------------------------------------------------------------------------

export const CREATE_ALL_TABLES_SQL = `
-- 1. users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);

-- 2. admin_sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    device_type TEXT NOT NULL DEFAULT 'desktop',
    browser TEXT NOT NULL DEFAULT 'Unknown',
    os TEXT NOT NULL DEFAULT 'Unknown',
    ip_address TEXT,
    location TEXT,
    screen_resolution TEXT,
    last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_last_active ON admin_sessions(last_active_at DESC);

-- 3. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    metadata JSONB,
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 4. profiles
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    headline TEXT,
    short_bio TEXT,
    long_bio TEXT,
    profile_image_url TEXT,
    visiting_card_image_url TEXT,
    date_of_birth TEXT,
    address TEXT,
    email TEXT,
    alternate_email TEXT,
    primary_email_label TEXT,
    alternate_email_label TEXT,
    phone TEXT,
    secondary_phone TEXT,
    phone_display_option TEXT,
    whatsapp_number TEXT,
    location TEXT,
    website TEXT,
    availability_status TEXT,
    availability_custom_note TEXT,
    timezone TEXT,
    response_time TEXT,
    languages_spoken TEXT[],
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5. site_settings
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    site_name TEXT NOT NULL,
    site_description TEXT,
    canonical_url TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    profile_image_url TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    footer_text TEXT,
    accent_color TEXT DEFAULT '#c6a87d',
    maintenance_mode BOOLEAN NOT NULL DEFAULT false,
    analytics_enabled BOOLEAN NOT NULL DEFAULT false,
    default_seo_title TEXT,
    default_seo_description TEXT,
    default_og_image_url TEXT,
    seo_keywords TEXT,
    allow_indexing BOOLEAN NOT NULL DEFAULT true,
    google_site_verification TEXT,
    google_analytics_id TEXT,
    custom_head_snippet TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. social_links
CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    platform TEXT NOT NULL,
    label TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_social_links_display_order ON social_links(display_order ASC);

-- 7. educations
CREATE TABLE IF NOT EXISTS educations (
    id SERIAL PRIMARY KEY,
    institution TEXT NOT NULL,
    qualification TEXT NOT NULL,
    field TEXT,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_educations_display_order ON educations(display_order ASC);

-- 8. experiences
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    role_title TEXT,
    organization TEXT,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    is_current BOOLEAN NOT NULL DEFAULT false,
    short_description TEXT,
    description TEXT,
    tags TEXT[],
    image_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON experiences(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_experiences_featured ON experiences(featured);

-- 9. skill_categories
CREATE TABLE IF NOT EXISTS skill_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_skill_categories_slug ON skill_categories(slug);
CREATE INDEX IF NOT EXISTS idx_skill_categories_display_order ON skill_categories(display_order ASC);

-- 10. skills
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES skill_categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_skills_category_id ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order ASC);

-- 11. services
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order ASC);

-- 12. projects
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT,
    short_summary TEXT,
    overview TEXT,
    problem TEXT,
    approach TEXT,
    design TEXT,
    technology TEXT,
    result TEXT,
    hero_image TEXT,
    live_url TEXT,
    github_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order ASC);

-- 13. project_images
CREATE TABLE IF NOT EXISTS project_images (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    width INTEGER,
    height INTEGER,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON project_images(display_order ASC);

-- 14. gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    alt_text TEXT NOT NULL DEFAULT '',
    caption TEXT,
    category TEXT,
    width INTEGER,
    height INTEGER,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order ASC);

-- 15. blog_categories
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- 16. blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    cover_image_url TEXT,
    content TEXT NOT NULL,
    category TEXT,
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
    reading_time INTEGER,
    published_at TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    featured BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[],
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- 17. content_categories
CREATE TABLE IF NOT EXISTS content_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'GENERAL',
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_content_categories_slug ON content_categories(slug);
CREATE INDEX IF NOT EXISTS idx_content_categories_type ON content_categories(type);

-- 18. contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW',
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
`;
