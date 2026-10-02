import { createPool } from './connection.ts';

/**
 * Automatically ensures all required columns and tables exist in PostgreSQL
 * Prevents "The column does not exist in the current database" runtime errors
 * when running against existing databases created with older schemas.
 */
export async function ensureDatabaseSchema(): Promise<void> {
  const pool = createPool();
  const migrations = [
    // 1. admin_sessions
    `CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      device_type TEXT NOT NULL DEFAULT 'desktop',
      browser TEXT NOT NULL DEFAULT 'Unknown',
      os TEXT NOT NULL DEFAULT 'Unknown',
      ip_address TEXT,
      location TEXT,
      screen_resolution TEXT,
      last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,
    `ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS device_type TEXT NOT NULL DEFAULT 'desktop';`,
    `ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS browser TEXT NOT NULL DEFAULT 'Unknown';`,
    `ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS os TEXT NOT NULL DEFAULT 'Unknown';`,
    `ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS ip_address TEXT;`,
    `ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS location TEXT;`,
    `ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS screen_resolution TEXT;`,
    `ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP NOT NULL DEFAULT NOW();`,
    `ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();`,

    // 2. gallery_images
    `CREATE TABLE IF NOT EXISTS gallery_images (
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
    );`,
    `ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS alt_text TEXT NOT NULL DEFAULT '';`,
    `ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS width INTEGER;`,
    `ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS height INTEGER;`,
    `ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();`,

    // 3. social_links
    `CREATE TABLE IF NOT EXISTS social_links (
      id SERIAL PRIMARY KEY,
      platform TEXT NOT NULL,
      label TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL,
      icon TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      published BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,
    `ALTER TABLE social_links ADD COLUMN IF NOT EXISTS label TEXT NOT NULL DEFAULT '';`,
    `ALTER TABLE social_links ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();`,

    // 4. blog_posts
    `CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      cover_image_url TEXT,
      content TEXT NOT NULL,
      category TEXT,
      category_id INTEGER,
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
    );`,
    `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category_id INTEGER;`,
    `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT;`,
    `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time INTEGER;`,
    `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'DRAFT';`,
    `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT;`,
    `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;`,
    `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS canonical_url TEXT;`,
    `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();`,

    // 5. contact_messages
    `CREATE TABLE IF NOT EXISTS contact_messages (
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
    );`,
    `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();`,

    // 6. content_categories
    `CREATE TABLE IF NOT EXISTS content_categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL DEFAULT 'GENERAL',
      description TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,
    `ALTER TABLE content_categories ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'GENERAL';`,
    `ALTER TABLE content_categories ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;`,
    `ALTER TABLE content_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();`,

    // 7. audit_logs
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      metadata JSONB,
      ip_hash TEXT,
      user_agent TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,
    `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_id TEXT;`,
    `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS entity_type TEXT;`,
    `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS entity_id TEXT;`,
    `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB;`,
    `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_hash TEXT;`,
    `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;`,

    // 8. projects
    `CREATE TABLE IF NOT EXISTS projects (
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
    );`,
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS hero_image TEXT;`,
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_title TEXT;`,
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_description TEXT;`,
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS canonical_url TEXT;`,
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();`,

    // 9. profiles
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS visiting_card_image_url TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS alternate_email TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_email_label TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS alternate_email_label TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS secondary_phone TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_display_option TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_status TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_custom_note TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS response_time TEXT;`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages_spoken TEXT[];`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();`,

    // 10. site_settings
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS canonical_url TEXT;`,
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS default_seo_title TEXT;`,
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS default_seo_description TEXT;`,
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS default_og_image_url TEXT;`,
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS seo_keywords TEXT;`,
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS allow_indexing BOOLEAN NOT NULL DEFAULT true;`,
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS google_site_verification TEXT;`,
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS google_analytics_id TEXT;`,
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS custom_head_snippet TEXT;`,
    `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();`,

    // 11. experiences
    `ALTER TABLE experiences ADD COLUMN IF NOT EXISTS role_title TEXT;`,
    `ALTER TABLE experiences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();`
  ];

  for (const sql of migrations) {
    try {
      await pool.query(sql);
    } catch {
      // Non-fatal if table/column check skips
    }
  }
}
