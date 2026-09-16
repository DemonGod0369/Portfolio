export interface Profile {
  id: string;
  name: string;
  dateOfBirth?: string;
  address?: string;
  headline: string;
  shortBio: string;
  longBio: string;
  profileImageUrl: string;
  visitingCardImageUrl?: string; // Custom uploaded visiting card image (jpg, jpeg, png)
  email: string;
  alternateEmail?: string;
  primaryEmailLabel?: string;
  alternateEmailLabel?: string;
  phone?: string; // Primary Contact Number
  secondaryPhone?: string; // Secondary Contact Number
  phoneDisplayOption?: 'both' | 'primary' | 'secondary' | 'none'; // Show or Not to Show contact number in the website
  whatsappNumber?: 'primary' | 'secondary' | 'none';
  location: string;
  website: string;
  availabilityStatus?: 'available' | 'advisory' | 'busy';
  availabilityCustomNote?: string;
  timezone?: string;
  responseTime?: string;
  languagesSpoken?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  category: string; // e.g. 'Operations & Management', 'Venture Founding', 'Creative Direction'
  title: string;
  roleTitle?: string;
  organization?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  shortDescription: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  featured: boolean;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  qualification: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  displayOrder: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  type?: 'CASE_STUDY' | 'JOURNAL' | 'GALLERY' | 'GENERAL';
  description?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  altText: string;
  caption?: string;
  width?: number;
  height?: number;
  displayOrder: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortSummary: string;
  overview?: string;
  problem?: string;
  approach?: string;
  design?: string;
  technology?: string;
  result?: string;
  heroImage: string;
  images: ProjectImage[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  altText: string;
  caption?: string;
  category: string;
  width?: number;
  height?: number;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type BlogPostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: number;
  publishedAt?: string;
  status: BlogPostStatus;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactMessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  ipHash?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon?: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSetting {
  id: string;
  siteName: string;
  siteDescription: string;
  canonicalUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  profileImageUrl: string;
  email: string;
  phone?: string;
  location: string;
  footerText: string;
  accentColor: string;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImageUrl: string;
  seoKeywords?: string;
  allowIndexing?: boolean;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
  customHeadSnippet?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
  ipHash?: string;
  createdAt: string;
}

export interface AdminSession {
  id: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  ipAddress?: string;
  location?: string;
  screenResolution?: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent?: boolean;
}

export type ActiveRoute = 
  | 'home'
  | 'about'
  | 'experience'
  | 'academic'
  | 'skills'
  | 'services'
  | 'work'
  | 'work-detail'
  | 'gallery'
  | 'blog'
  | 'blog-detail'
  | 'resume'
  | 'contact'
  | 'admin-login'
  | 'admin';

export type AdminTab = 
  | 'dashboard'
  | 'profile'
  | 'experience'
  | 'education'
  | 'skills-services'
  | 'skills'
  | 'services'
  | 'case-studies-journal'
  | 'projects'
  | 'blog'
  | 'categories'
  | 'gallery'
  | 'messages'
  | 'seo-settings'
  | 'seo'
  | 'settings'
  | 'security'
  | 'audit-log'
  | 'backup';
