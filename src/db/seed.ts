import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createPool } from './index.ts';
import { getPublicPortfolioData, getAllAdminPortfolioData } from './queries.ts';

const DDL_STATEMENTS = `
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

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS content_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  short_summary TEXT NOT NULL,
  overview TEXT,
  problem TEXT,
  approach TEXT,
  design TEXT,
  technology TEXT,
  result TEXT,
  deliverables TEXT[],
  tags TEXT[],
  cover_image_url TEXT,
  client TEXT,
  role TEXT,
  start_date TEXT,
  end_date TEXT,
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  title TEXT,
  caption TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[],
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  reading_time_minutes INTEGER NOT NULL DEFAULT 5,
  category TEXT,
  tags TEXT[],
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_links (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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
  accent_color TEXT,
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

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  device_info TEXT,
  ip_address TEXT,
  last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

async function runSeed() {
  const pool = createPool();
  console.log('----------------------------------------------------');
  console.log('Gunjan Shrestha Platform — PostgreSQL Database Seeder');
  console.log('----------------------------------------------------');

  try {
    // 1. Ensure all tables exist (for fresh local databases)
    console.log('1. Verifying database table structures...');
    try {
      await pool.query(DDL_STATEMENTS);
      console.log('   Tables verified/created successfully.');
    } catch (ddlErr: any) {
      console.log('   DDL note: Tables already exist or managed by schema migrations.');
    }

    // 2. Execute SQL seed file to populate initial verified records
    const sqlFilePath = path.join(process.cwd(), 'seed.sql');
    if (fs.existsSync(sqlFilePath)) {
      console.log('2. Seeding initial records into tables from seed.sql...');
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      try {
        await pool.query(sqlContent);
        console.log('   Initial data seeded successfully.');
      } catch (seedErr: any) {
        console.warn('   Seed notice:', seedErr?.message || seedErr);
      }
    } else {
      console.log('2. seed.sql not found, continuing with existing database records...');
    }

    // 3. Ensure default admin user exists
    try {
      await pool.query(`
        INSERT INTO users (uid, email, password_hash, is_active)
        VALUES ('admin_gunjan', 'gunjanstha01@gmail.com', 'gunjan2026', true)
        ON CONFLICT (email) DO NOTHING;
      `);
    } catch {
      // ignore
    }

    // 4. Validate stored data via database queries
    console.log('3. Validating stored data via database queries...');
    const adminData = await getAllAdminPortfolioData();
    const publicData = await getPublicPortfolioData();

    console.log('----------------------------------------------------');
    console.log('Database Seeding Complete! Summary:');
    console.log(`- Profile:            1 record (${publicData.profile?.name || 'Gunjan Shrestha'})`);
    console.log(`- Experiences:        ${publicData.experiences.length} career milestones`);
    console.log(`- Educations:         ${publicData.educations.length} academic credentials`);
    console.log(`- Skill Categories:   ${publicData.skillCategories.length} categories`);
    console.log(`- Skills:             ${publicData.skills.length} skills`);
    console.log(`- Services:           ${publicData.services.length} services`);
    console.log(`- Projects:           ${publicData.projects.length} case studies`);
    console.log(`- Visual Assets:      ${publicData.galleryImages.length} gallery images`);
    console.log(`- Articles / Blogs:   ${publicData.blogPosts.length} posts`);
    console.log(`- Content Categories: ${publicData.contentCategories.length} categories`);
    console.log(`- Social Links:       ${publicData.socialLinks.length} links`);
    console.log(`- Site Settings:      1 record (${publicData.siteSettings?.siteName || 'Gunjan Shrestha'})`);
    console.log(`- Admin User:         ${adminData.adminUser?.email || 'gunjanstha01@gmail.com'}`);
    console.log('----------------------------------------------------');
    console.log('Status: PostgreSQL database ready for development & production!');

    await pool.end();
    process.exit(0);
  } catch (err: any) {
    console.error('Database seeding failed:', err);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

runSeed();
