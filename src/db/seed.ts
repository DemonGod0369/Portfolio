import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createPool } from './index.ts';
import {
  getPublicPortfolioData,
  getAllAdminPortfolioData,
} from './queries.ts';

/**
 * ------------------------------------------------------------
 * Database schema
 * ------------------------------------------------------------
 */

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

/**
 * ------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------
 */

function validateDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not defined. Check your .env file.'
    );
  }

  let parsed: URL;

  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error(
      'DATABASE_URL is invalid. Make sure it is a valid PostgreSQL URL.'
    );
  }

  if (
    parsed.protocol !== 'postgresql:' &&
    parsed.protocol !== 'postgres:'
  ) {
    throw new Error(
      `Invalid DATABASE_URL protocol: ${parsed.protocol}. Expected postgresql:// or postgres://`
    );
  }

  if (!parsed.hostname) {
    throw new Error('DATABASE_URL does not contain a database host.');
  }

  if (!parsed.username) {
    throw new Error('DATABASE_URL does not contain a database username.');
  }

  if (!parsed.pathname || parsed.pathname === '/') {
    throw new Error(
      'DATABASE_URL does not contain a database name.'
    );
  }

  // Never print the password.
  const safeUrl = new URL(databaseUrl);
  safeUrl.password = '********';

  console.log(`Database: ${safeUrl.toString()}`);

  return databaseUrl;
}

/**
 * ------------------------------------------------------------
 * Main seed function
 * ------------------------------------------------------------
 */

async function runSeed() {
  console.log('----------------------------------------------------');
  console.log(
    'Gunjan Shrestha Platform — PostgreSQL Database Seeder'
  );
  console.log('----------------------------------------------------');

  let pool: ReturnType<typeof createPool> | null = null;

  try {
    /**
     * 0. Validate DATABASE_URL before creating the pool.
     */
    console.log('0. Checking database configuration...');

    validateDatabaseUrl();

    /**
     * 1. Create PostgreSQL connection pool.
     */
    console.log('1. Connecting to PostgreSQL...');

    pool = createPool();

    await pool.query('SELECT 1');

    console.log('   PostgreSQL connection successful.');

    /**
     * 2. Create database tables.
     */
    console.log('2. Creating/verifying database tables...');

    await pool.query(DDL_STATEMENTS);

    console.log('   Tables verified/created successfully.');

    /**
     * 3. Load seed.sql.
     *
     * Expected location:
     *
     * project-root/
     * ├── seed.sql
     * ├── package.json
     * ├── .env
     * └── src/
     *     └── db/
     *         └── seed.ts
     */
    const sqlFilePath = path.resolve(
      process.cwd(),
      'seed.sql'
    );

    console.log(`3. Looking for seed file: ${sqlFilePath}`);

    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(
        `seed.sql was not found at:\n${sqlFilePath}`
      );
    }

    const sqlContent = fs.readFileSync(
      sqlFilePath,
      'utf8'
    ).trim();

    if (!sqlContent) {
      throw new Error('seed.sql is empty.');
    }

    console.log(
      `   seed.sql loaded successfully (${sqlContent.length} characters).`
    );

    /**
     * 4. Execute seed SQL.
     *
     * IMPORTANT:
     * Do NOT swallow errors here.
     */
    console.log('4. Executing seed.sql...');

    try {
      await pool.query(sqlContent);
      console.log('   Seed SQL executed successfully.');
    } catch (seedErr: any) {
      console.error('');
      console.error('====================================================');
      console.error('SEED SQL FAILED');
      console.error('====================================================');
      console.error(seedErr?.message || seedErr);

      if (seedErr?.detail) {
        console.error('Detail:', seedErr.detail);
      }

      if (seedErr?.hint) {
        console.error('Hint:', seedErr.hint);
      }

      if (seedErr?.position) {
        console.error('Position:', seedErr.position);
      }

      console.error('====================================================');
      console.error('');

      throw seedErr;
    }

    /**
     * 5. Ensure admin user exists.
     */
    console.log('5. Verifying admin user...');

    await pool.query(`
      INSERT INTO users (
        uid,
        email,
        password_hash,
        is_active
      )
      VALUES (
        'admin_gunjan',
        'gunjanstha01@gmail.com',
        'gunjan2026',
        true
      )
      ON CONFLICT (email)
      DO UPDATE SET
        is_active = true;
    `);

    console.log('   Admin user verified.');

    /**
     * 6. Validate database contents.
     */
    console.log('6. Validating stored data...');

    const adminData = await getAllAdminPortfolioData();
    const publicData = await getPublicPortfolioData();

    /**
     * 7. Print summary.
     */
    console.log('');
    console.log('----------------------------------------------------');
    console.log('Database Seeding Complete!');
    console.log('----------------------------------------------------');

    console.log(
      `- Profile:            ${
        publicData.profile?.name || 'Not found'
      }`
    );

    console.log(
      `- Experiences:        ${publicData.experiences.length}`
    );

    console.log(
      `- Educations:         ${publicData.educations.length}`
    );

    console.log(
      `- Skill Categories:   ${publicData.skillCategories.length}`
    );

    console.log(
      `- Skills:             ${publicData.skills.length}`
    );

    console.log(
      `- Services:           ${publicData.services.length}`
    );

    console.log(
      `- Projects:           ${publicData.projects.length}`
    );

    console.log(
      `- Visual Assets:      ${publicData.galleryImages.length}`
    );

    console.log(
      `- Articles / Blogs:   ${publicData.blogPosts.length}`
    );

    console.log(
      `- Content Categories: ${publicData.contentCategories.length}`
    );

    console.log(
      `- Social Links:       ${publicData.socialLinks.length}`
    );

    console.log(
      `- Site Settings:      ${
        publicData.siteSettings ? '1' : '0'
      }`
    );

    console.log(
      `- Admin User:         ${
        adminData.adminUser?.email || 'Not found'
      }`
    );

    console.log('----------------------------------------------------');
    console.log(
      'Status: PostgreSQL database ready.'
    );
    console.log('----------------------------------------------------');

    await pool.end();
    process.exit(0);

  } catch (err: any) {
    console.error('');
    console.error('====================================================');
    console.error('DATABASE SEEDING FAILED');
    console.error('====================================================');
    console.error(err?.message || err);
    console.error('====================================================');

    if (pool) {
      await pool.end().catch(() => {});
    }

    process.exit(1);
  }
}

runSeed();
