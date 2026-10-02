/**
 * Consolidated Database Queries & Repositories Export
 * All domain queries are modularized under `src/db/repositories/` powered by Prisma ORM.
 */

export * from './repositories/common.ts';
export * from './repositories/portfolio.repository.ts';
export * from './repositories/profile.repository.ts';
export * from './repositories/experience.repository.ts';
export * from './repositories/education.repository.ts';
export * from './repositories/skill.repository.ts';
export * from './repositories/service.repository.ts';
export * from './repositories/project.repository.ts';
export * from './repositories/gallery.repository.ts';
export * from './repositories/blog.repository.ts';
export * from './repositories/category.repository.ts';
export * from './repositories/social.repository.ts';
export * from './repositories/settings.repository.ts';
export * from './repositories/message.repository.ts';
export * from './repositories/session.repository.ts';
export * from './repositories/auth.repository.ts';
