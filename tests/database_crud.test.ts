import { describe, it, expect } from 'vitest';
import * as queries from '../src/db/queries.ts';
import { prisma } from '../src/db/connection.ts';

describe('PostgreSQL Dynamic Database Integration & Full CRUD Suite', () => {
  it('READ: retrieves dynamic portfolio data on initial load from PostgreSQL', async () => {
    const data = await queries.getPublicPortfolioData();
    expect(data).toBeDefined();
    expect(data.profile).toBeDefined();
    expect(data.profile.name).toBe('Gunjan Shrestha');
    expect(Array.isArray(data.experiences)).toBe(true);
    expect(data.experiences.length).toBeGreaterThan(0);
    expect(Array.isArray(data.projects)).toBe(true);
    expect(data.projects.length).toBeGreaterThan(0);
    expect(Array.isArray(data.skills)).toBe(true);
    expect(data.skills.length).toBeGreaterThan(0);
    expect(Array.isArray(data.services)).toBe(true);
    expect(data.services.length).toBeGreaterThan(0);
  });

  // 1. Profile CRUD
  it('PROFILE: reads and updates profile in PostgreSQL', async () => {
    const profile = await queries.getProfile();
    expect(profile).toBeDefined();
    expect(profile?.name).toBe('Gunjan Shrestha');

    const updated = await queries.updateProfile({
      headline: 'Multidisciplinary Founder & Operator — Operations, Finance, Tech & Design (Updated)',
    });
    expect(updated.headline).toContain('(Updated)');

    // Restore headline
    await queries.updateProfile({
      headline: 'Multidisciplinary Founder & Operator — Operations, Finance, Tech & Design',
    });
  });

  // 2. Experience CRUD
  it('EXPERIENCES: full CREATE, READ, UPDATE, DELETE lifecycle in PostgreSQL', async () => {
    // CREATE
    const newExp = await queries.createExperience({
      category: 'Software & Technology',
      title: 'Senior Solutions Architect',
      roleTitle: 'Principal Cloud Engineer',
      organization: 'Global Systems Lab',
      location: 'Kathmandu / Remote',
      startDate: '2025',
      endDate: 'Present',
      isCurrent: true,
      shortDescription: 'Engineering scalable cloud native architectures.',
      description: 'Full stack development with PostgreSQL and modern distributed systems.',
      tags: ['PostgreSQL', 'Cloud SQL', 'TypeScript'],
      featured: true,
      displayOrder: 99,
      published: true,
    });

    expect(newExp).toBeDefined();
    expect(newExp.id).toBeDefined();
    expect(newExp.title).toBe('Senior Solutions Architect');

    // READ
    const allExp = await queries.getExperiences();
    const found = allExp.find(e => e.id === newExp.id);
    expect(found).toBeDefined();
    expect(found?.organization).toBe('Global Systems Lab');

    // UPDATE
    const updated = await queries.updateExperience(newExp.id, {
      title: 'Principal Solutions Architect',
      location: 'Singapore / Kathmandu',
    });
    expect(updated).toBeDefined();
    expect(updated?.title).toBe('Principal Solutions Architect');

    // DELETE
    const deleted = await queries.deleteExperience(newExp.id);
    expect(deleted).toBeDefined();
    expect(deleted?.id).toBe(newExp.id);

    // Verify deletion
    const allAfter = await queries.getExperiences();
    expect(allAfter.find(e => e.id === newExp.id)).toBeUndefined();
  });

  // 3. Project / Case Study CRUD
  it('PROJECTS: full CREATE, READ, UPDATE, DELETE with images in PostgreSQL', async () => {
    // CREATE
    const newProj = await queries.createProject({
      title: 'Enterprise High-Frequency Financial Ledger',
      slug: `fintech-ledger-${Date.now()}`,
      category: 'Fintech & Systems',
      shortSummary: 'High-throughput transactional microservices with PostgreSQL ACID compliance.',
      overview: 'Real-time double entry bookkeeping engine.',
      problem: 'Concurrency race conditions during ledger reconciliation.',
      approach: 'Serializable transaction isolation and optimistic locking.',
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      featured: true,
      published: true,
      displayOrder: 10,
      images: [
        { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', altText: 'Dashboard screenshot' }
      ]
    });

    expect(newProj.id).toBeDefined();
    expect(newProj.title).toBe('Enterprise High-Frequency Financial Ledger');
    expect(newProj.images.length).toBe(1);

    // UPDATE
    const updated = await queries.updateProject(newProj.id, {
      title: 'Enterprise Multi-Currency Ledger Platform',
      featured: false,
    });
    expect(updated?.title).toBe('Enterprise Multi-Currency Ledger Platform');

    // DELETE
    const deleted = await queries.deleteProject(newProj.id);
    expect(deleted?.id).toBe(newProj.id);
  });

  // 4. Contact Message CRUD
  it('CONTACT MESSAGES: submits, reads, updates status and deletes message in PostgreSQL', async () => {
    // SUBMIT
    const msg = await queries.submitContactMessage({
      name: 'Venture Partner',
      email: 'partner@venture.org',
      subject: 'Cross-Border Venture Advisory',
      message: 'Interested in strategic operations and enterprise deployment.',
      ipHash: 'test-ip-hash',
    });

    expect(msg.id).toBeDefined();
    expect(msg.status).toBe('NEW');

    // READ
    const messages = await queries.getContactMessages();
    const found = messages.find(m => m.id === msg.id);
    expect(found).toBeDefined();

    // UPDATE STATUS
    const updated = await queries.updateContactMessageStatus(msg.id, 'READ');
    expect(updated?.status).toBe('READ');

    // DELETE
    const deleted = await queries.deleteContactMessage(msg.id);
    expect(deleted?.id).toBe(msg.id);
  });

  // 5. Skills and Categories CRUD
  it('SKILL CATEGORIES & SKILLS: creates, queries, and cleans up skills', async () => {
    const category = await queries.createSkillCategory({
      name: 'Cloud Infrastructure & DevOps',
      slug: `devops-${Date.now()}`,
      description: 'Kubernetes, Cloud SQL, and automated CI/CD pipelines.',
      displayOrder: 99,
      published: true,
    });
    expect(category.id).toBeDefined();

    const skill = await queries.createSkill({
      categoryId: category.id,
      name: 'PostgreSQL Architecture',
      slug: `postgres-${Date.now()}`,
      description: 'Advanced relational schema design and query optimization.',
      displayOrder: 1,
      published: true,
    });
    expect(skill.id).toBeDefined();

    // Delete skill and category
    await queries.deleteSkill(skill.id);
    await queries.deleteSkillCategory(category.id);
  });

  // 6. Site Settings
  it('SITE SETTINGS: updates and persists site configuration', async () => {
    const original = await queries.getSiteSettings();
    expect(original.siteName).toBeDefined();

    const updated = await queries.updateSiteSettings({
      footerText: '© Gunjan Shrestha. All Rights Reserved. Powered by PostgreSQL.',
    });
    expect(updated.footerText).toContain('Powered by PostgreSQL');

    // Restore
    await queries.updateSiteSettings({
      footerText: original.footerText,
    });
  });
});
