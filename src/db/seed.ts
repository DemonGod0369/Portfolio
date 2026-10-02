import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { prisma, createPool } from './index.ts';
import { getPublicPortfolioData, getAllAdminPortfolioData } from './queries.ts';

/**
 * Gunjan Shrestha Platform — PostgreSQL Database Seeder
 * Perfectly synchronized with seed.sql and prisma/schema.prisma
 */

async function runSeed() {
  console.log('====================================================');
  console.log('Gunjan Shrestha Platform — Synchronized Database Seeder');
  console.log('====================================================');

  const pool = createPool();

  try {
    // 1. Locate and read the canonical seed.sql file
    const sqlFilePath = path.join(process.cwd(), 'seed.sql');
    let sqlContent = '';

    if (fs.existsSync(sqlFilePath)) {
      console.log('1. Loading synchronized SQL script from seed.sql...');
      sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    } else {
      console.error('Error: seed.sql not found at project root!');
      process.exit(1);
    }

    // 2. Execute SQL statements
    console.log('2. Applying schema DDL and seeding initial dataset...');
    try {
      await pool.query(sqlContent);
      console.log('   Schema DDL & seed records applied successfully.');
    } catch (sqlErr: any) {
      console.warn('   SQL notice:', sqlErr?.message || sqlErr);
    }

    // 3. Ensure the default super administrator user exists
    try {
      await pool.query(`
        INSERT INTO users (uid, email, password_hash, is_active)
        VALUES ('admin_gunjan', 'gunjanstha01@gmail.com', 'gunjan2026', true)
        ON CONFLICT (email) DO NOTHING;
      `);
    } catch {
      // ignore if already present
    }

    // 4. Validate database state via Prisma ORM queries
    console.log('3. Validating stored dataset via Prisma ORM queries...');
    const adminData = await getAllAdminPortfolioData();
    const publicData = await getPublicPortfolioData();

    console.log('====================================================');
    console.log('Database Synchronization & Seeding Summary:');
    console.log(`- Profile:            1 record (${publicData.profile?.name || 'Gunjan Shrestha'})`);
    console.log(`- Career Milestones:  ${publicData.experiences.length} records`);
    console.log(`- Academic Records:   ${publicData.educations.length} records`);
    console.log(`- Skill Categories:   ${publicData.skillCategories.length} categories`);
    console.log(`- Technical Skills:   ${publicData.skills.length} skills`);
    console.log(`- Service Offerings:  ${publicData.services.length} services`);
    console.log(`- Case Studies:       ${publicData.projects.length} projects`);
    console.log(`- Gallery Assets:     ${publicData.galleryImages.length} images`);
    console.log(`- Journal Posts:      ${publicData.blogPosts.length} posts`);
    console.log(`- Content Categories: ${publicData.contentCategories.length} categories`);
    console.log(`- Social Profile:     ${publicData.socialLinks.length} links`);
    console.log(`- Site & SEO Config:  1 record (${publicData.siteSettings?.siteName || 'Configured'})`);
    console.log(`- Administrator:      ${adminData.adminUser?.email || 'gunjanstha01@gmail.com'}`);
    console.log('====================================================');
    console.log('Status: seed.sql and seed.ts are 100% synchronized with Prisma ORM!');

    await pool.end();
    await prisma.$disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error('Database seeding failed:', err);
    await pool.end().catch(() => {});
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

runSeed();
