-- Gunjan Shrestha Portfolio Database Schema & Seed
-- Target: PostgreSQL 14+ / 15+ / 16+ / Google Cloud SQL
-- Synchronized with Prisma ORM Schema & seed.ts

-- =============================================================
-- 0. CLEAN RESET (Drops existing tables for fresh clean seeding)
-- =============================================================
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS content_categories CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS skill_categories CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS educations CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================================
-- 1. CREATE TABLES (Exact match with Prisma models)
-- =============================================================

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

CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
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

CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    device_type TEXT NOT NULL,
    browser TEXT NOT NULL,
    os TEXT NOT NULL,
    ip_address TEXT,
    location TEXT,
    screen_resolution TEXT,
    last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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

-- =============================================================
-- 2. SEED INITIAL DATA (Idempotent: ON CONFLICT DO NOTHING)
-- =============================================================

-- 2.1 Profile
INSERT INTO profiles (
    name, headline, short_bio, long_bio, profile_image_url, visiting_card_image_url,
    date_of_birth, address, email, alternate_email, primary_email_label, alternate_email_label,
    phone, secondary_phone, phone_display_option, whatsapp_number,
    location, website, availability_status, availability_custom_note,
    timezone, response_time, languages_spoken
) VALUES (
    'Gunjan Shrestha',
    'Multidisciplinary Founder & Operator — Operations, Finance, Tech & Design',
    'Multidisciplinary founder and operator based in Kathmandu, focused on building businesses that can scale beyond local markets and operate at an international level.',
    'I believe people are defined by their work and their commitment to continuous improvement—learning from mistakes, taking responsibility, and consistently raising the bar. My background spans founding and operating ventures from the ground up: managing technology stacks, brand design, custom fine jewellery craftsmanship, and end-to-end digital strategies, alongside leading office operations, financial accounts, reporting, and cross-functional teams in software development and UI design.\n\nAlongside this, I have built extensive expertise in accounting, company auditing, and the legal and compliance frameworks required to run well-structured businesses. My focus is expanding this to international standards to build and scale multinational ventures combining strong operations, sound financial governance, and thoughtful brand strategy.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    '1997-01-01',
    'Kathmandu, Bagmati, Nepal',
    'gunjanstha01@gmail.com',
    'contact@gunjanshrestha.com.np',
    'Primary Direct',
    'Inquiries',
    '+977 9800000000',
    '+977 9811111111',
    'both',
    '+977 9800000000',
    'Kathmandu, Nepal',
    'https://www.gunjanshrestha.com.np',
    'Available for Strategic Advisory & Multinational Ventures',
    'Accepting new executive advisory, bespoke jewellery commissions, and cross-border ventures.',
    'UTC+5:45 (Kathmandu)',
    'Within 24 Hours',
    ARRAY['English', 'Nepali', 'Newari', 'Hindi']
) ON CONFLICT DO NOTHING;

-- 2.2 Site Settings
INSERT INTO site_settings (
    site_name, site_description, canonical_url, logo_url, favicon_url, profile_image_url,
    email, phone, location, footer_text, accent_color, maintenance_mode,
    analytics_enabled, default_seo_title, default_seo_description, default_og_image_url,
    seo_keywords, allow_indexing
) VALUES (
    'Gunjan Shrestha | Founder & Operator',
    'Official portfolio of Gunjan Shrestha: Operations, financial auditing, bespoke fine jewellery manufacturing, brand design, and scalable technology systems.',
    'https://www.gunjanshrestha.com.np',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=64&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    'gunjanstha01@gmail.com',
    '+977 9800000000',
    'Kathmandu, Nepal',
    'Crafted with architectural precision & relentless standards.',
    '#00E5FF',
    false,
    false,
    'Gunjan Shrestha — Executive Portfolio & Ventures',
    'Multidisciplinary Founder & Operator based in Kathmandu, Nepal.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    'Gunjan Shrestha, Founder, Operations, Finance, Audit, Fine Jewellery, Nepal, Technology',
    true
) ON CONFLICT DO NOTHING;

-- 2.3 Educations (2 Records)
INSERT INTO educations (institution, qualification, field, location, start_date, end_date, description, display_order, published)
VALUES
('Tribhuvan University', 'Bachelor of Business Studies (BBS)', 'Accounting, Financial Audit & Corporate Law', 'Kathmandu, Nepal', '2017', '2021', 'Focused on statutory audit standards, mercantile law, tax accounting, and organizational leadership.', 1, true),
('National Secondary School', '+2 Higher Secondary Education', 'Management & Accountancy', 'Kathmandu, Nepal', '2015', '2017', 'Graduated with distinction in principles of accounting, business mathematics, and economics.', 2, true)
ON CONFLICT DO NOTHING;

-- 2.4 Experiences (5 Records)
INSERT INTO experiences (category, title, role_title, organization, location, start_date, end_date, is_current, short_description, description, tags, image_url, featured, display_order, published)
VALUES
('Operations & Management', 'Operations, Accounts & Cross-Functional Management', 'Head of Operations & Controller', 'Technology & Systems Enterprise', 'Kathmandu, Nepal', '2023', NULL, true, 'Leading office operations, logistics, accounting, financial reporting, and cross-functional software/design execution.', 'Shaping how the enterprise runs and scales. Work spans office operations, logistical systems, financial ledgers, compliance reporting, and steering cross-functional initiatives across software development, digital graphics, and UI/UX design workflows.', ARRAY['Operations', 'Financial Accounting', 'Reporting', 'Cross-Functional Leadership', 'Logistics', 'Software & UI'], 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', true, 1, true),
('Entrepreneurship & Craftsmanship', 'Founder, Master Craftsman & Brand Director', 'Founder & Creative Director', 'Gunjan Fine Jewellery', 'Kathmandu & International', '2021', NULL, true, 'Founding and scaling a bespoke fine jewellery atelier combining traditional goldsmithing with modern 3D CAD design.', 'Built an independent atelier brand from scratch. Directing every dimension: precious metal sourcing, CAD design, wax casting, gemmological grading, client advisory, packaging design, and worldwide fulfillment.', ARRAY['Jewellery Manufacturing', 'CAD Design', 'Gemmology', 'Luxury Branding', 'Direct-to-Consumer', 'Global Shipping'], 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop', true, 2, true),
('Finance & Corporate Governance', 'Financial Auditor & Corporate Accounts Specialist', 'Senior Audit Associate', 'Commercial Audit Practice', 'Kathmandu, Nepal', '2020', '2023', false, 'Conducted statutory audits, prepared trial balances and financial statements, and reviewed tax compliance across mid-size companies.', 'Specialized in rigorous internal controls and financial transparency. Prepared audit files, tested ledger integrity, reconciled banking operations, and drafted compliance recommendations for executive boards.', ARRAY['Statutory Audit', 'Corporate Taxation', 'Internal Controls', 'Financial Statements', 'Due Diligence'], 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop', false, 3, true),
('Technology & Digital Architecture', 'Technology Systems & Digital Solutions Lead', 'Systems Consultant', 'Digital Advisory Group', 'Kathmandu, Nepal', '2019', '2021', false, 'Architecting scalable web software, database infrastructures, and automation systems for commercial entities.', 'Designed end-to-end IT infrastructure blueprints, high-uptime Linux hosting, and automated data entry workflows that reduced manual overhead by 40%.', ARRAY['Web Architecture', 'PostgreSQL', 'Linux VPS', 'Process Automation', 'API Design'], 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', false, 4, true),
('Corporate Finance & Compliance', 'Junior Accounting & Tax Associate', 'Accounting Associate', 'Chartered Accountancy Firm', 'Kathmandu, Nepal', '2017', '2019', false, 'Assisted in client tax filings, VAT reconciliations, payroll administration, and preliminary audit verification.', 'Built the core foundation of mercantile law, statutory tax registers, and double-entry accounting procedures across diverse trading and hospitality businesses.', ARRAY['Tax Filing', 'VAT Reconciliation', 'Payroll Administration', 'Bookkeeping'], 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop', false, 5, true)
ON CONFLICT DO NOTHING;

-- 2.5 Skill Categories (5 Categories)
INSERT INTO skill_categories (id, name, slug, description, display_order, published)
VALUES
(1, 'Executive Operations & Leadership', 'operations-leadership', 'Managing operations, workflows, cross-functional teams, and logistics.', 1, true),
(2, 'Finance, Audit & Corporate Governance', 'finance-audit', 'Accounting systems, auditing standards, compliance, and fiscal oversight.', 2, true),
(3, 'Fine Jewellery Craft & Luxury Manufacturing', 'jewellery-craft', '3D CAD design, gemmology, goldsmithing, and luxury atelier production.', 3, true),
(4, 'Technology, Software & Systems', 'technology-systems', 'Modern full-stack web architectures, APIs, deployment, and cloud infrastructure.', 4, true),
(5, 'Brand Strategy & Visual Design', 'brand-design', 'High-end branding, UI/UX systems, photography direction, and packaging.', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 2.6 Skills (16 Skills)
INSERT INTO skills (category_id, name, slug, description, icon, display_order, published)
VALUES
-- Operations & Leadership
(1, 'Operations Management', 'operations-management', 'Standard operating procedures, office workflows, vendor management, and fulfillment pipelines.', 'briefcase', 1, true),
(1, 'Cross-Functional Team Steering', 'cross-functional-leadership', 'Aligning software engineers, UI/UX designers, and business operators toward precise milestones.', 'users', 2, true),
(1, 'Process Automation & SOPs', 'process-automation', 'Designing scalable operating manuals and automated notification pipelines.', 'cpu', 3, true),
(1, 'Supply Chain & Fulfillment', 'supply-chain-fulfillment', 'End-to-end tracking of materials, production stages, and worldwide secure delivery.', 'truck', 4, true),

-- Finance & Audit
(2, 'Corporate Financial Accounting', 'financial-accounting', 'General ledger management, trial balance preparation, and balance sheet structuring.', 'calculator', 5, true),
(2, 'Statutory & Internal Audit', 'internal-audit', 'Audit evidence gathering, internal control evaluation, and compliance testing.', 'shield-check', 6, true),
(2, 'Tax Compliance & Corporate Law', 'tax-compliance', 'VAT reconciliation, corporate filing frameworks, and company law procedures.', 'scale', 7, true),
(2, 'Risk & Controls Assessment', 'risk-controls-assessment', 'Identifying operational leakages and establishing dual-signoff authorization policies.', 'lock', 8, true),

-- Jewellery & Craftsmanship
(3, '3D CAD Jewellery Design', 'cad-jewellery-design', 'High-precision micro-prong setting CAD modeling for diamonds and fine gemstones.', 'gem', 9, true),
(3, 'Fine Goldsmithing & Casting', 'fine-goldsmithing', 'Directing lost-wax vacuum casting, hallmarking, polishing, and quality grading.', 'hammer', 10, true),
(3, 'Gemmological Grading', 'gemmological-grading', 'Evaluating 4Cs of diamonds and coloured gemstone inclusions and spectral clarity.', 'eye', 11, true),
(3, 'Micro-Pave Diamond Setting', 'micro-pave-setting', 'Ultra-tight stone setting under stereomicroscope magnification for seamless brilliance.', 'sparkles', 12, true),

-- Technology & Systems
(4, 'Full-Stack Web Architecture', 'full-stack-architecture', 'React, TypeScript, Express, PostgreSQL, and performant REST API design.', 'code-2', 13, true),
(4, 'Linux Server & VPS Deployment', 'linux-vps-deployment', 'Ubuntu, Nginx reverse proxies, SSL/TLS, PM2 process management, and Docker.', 'server', 14, true),

-- Brand & Visual Design
(5, 'Luxury Identity & Packaging', 'luxury-identity', 'Bespoke box packaging, brand typography, and unboxing experience architecture.', 'palette', 15, true),
(5, 'Editorial Photography Direction', 'editorial-photography', 'Art direction for fine jewelry macro photography and high-end brand assets.', 'camera', 16, true)
ON CONFLICT (slug) DO NOTHING;

-- 2.7 Services (6 Services)
INSERT INTO services (title, slug, short_description, description, icon, display_order, featured, published)
VALUES
('Executive Operations & Growth Advisory', 'operations-growth-advisory', 'Structuring standard operating procedures, logistics, and accountability frameworks for expanding ventures.', 'Diagnosing operational bottlenecks and instituting clear systems that enable businesses to scale without chaos.', 'briefcase', 1, true, true),
('Financial Systems & Pre-Audit Preparedness', 'financial-audit-preparedness', 'Organizing chart of accounts, trial balances, and statutory compliance documentation for commercial reviews.', 'Ensuring corporate books and financial statements withstand rigorous independent audits and compliance scrutiny.', 'shield-check', 2, true, true),
('Bespoke Fine Jewellery Commissioning', 'bespoke-fine-jewellery', 'Custom 18k gold and diamond creations designed in 3D CAD and handcrafted to international luxury benchmarks.', 'One-on-one private commissions from rough gemstone selection and 3D modeling to casting, setting, and delivery.', 'gem', 3, true, true),
('Digital Product & Technical Architecture', 'technical-architecture', 'Modern web applications, internal operational dashboards, and digital platforms built with precision.', 'Designing and deploying scalable web applications that combine high aesthetic polish with reliable backend code.', 'code-2', 4, true, true),
('Corporate Governance & Internal Controls Audit', 'corporate-governance-audit', 'Comprehensive review of organizational policies, financial authorizations, and fraud prevention controls.', 'Helping mid-tier and emerging enterprises structure robust internal governance that builds trust with investors and lenders.', 'scale', 5, false, true),
('Luxury Brand Strategy & Packaging Design', 'luxury-brand-packaging', 'Crafting distinguished visual identities, custom unboxing packaging, and premium brand storytelling.', 'Transforming bespoke craft and high-ticket products into internationally recognized luxury marques.', 'palette', 6, false, true)
ON CONFLICT (slug) DO NOTHING;

-- 2.8 Projects (5 Case Studies)
INSERT INTO projects (id, title, slug, category, short_summary, overview, problem, approach, design, technology, result, hero_image, featured, published, display_order)
VALUES
(
    1,
    'Gunjan Fine Jewellery: Global Bespoke Atelier',
    'gunjan-fine-jewellery-atelier',
    'Luxury Brand & Manufacturing',
    'Founding and building an independent luxury atelier from Kathmandu with bespoke clients worldwide.',
    'A vertically integrated fine jewellery brand that merges traditional Himalayan craftsmanship with cutting-edge 3D CAD modeling and ethically sourced precious stones.',
    'Traditional jewellery retail in South Asia often suffers from opaque pricing, outdated designs, and lack of modern digital customer experience for international buyers.',
    'Established an end-to-end bespoke pipeline: 3D photorealistic CAD renders before metal pouring, strict certified diamond sourcing, and insured worldwide shipping.',
    'Minimalist luxury aesthetic: warm champagnes, deep charcoal velvets, and architectural geometry.',
    'Matrix 3D CAD, Rhino 3D, High-Resolution 3D Wax Printers, React E-Commerce Portal, PostgreSQL.',
    'Delivered dozens of bespoke bridal and ceremonial heirlooms across Nepal, the US, and Australia with zero defect returns.',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
    true, true, 1
),
(
    2,
    'Enterprise Financial Ledger & Audit Engine',
    'enterprise-financial-audit-engine',
    'Corporate Finance & Software',
    'Unified internal ledger reconciliation tool designed to streamline commercial audit preparation.',
    'Architected an internal operations platform to bridge bank transaction feeds, physical invoice registers, and tax ledgers into a single verified audit trail.',
    'Businesses frequently waste hundreds of hours manually cross-checking paper receipts and multiple bank accounts during tax season.',
    'Created a rule-based matching engine that automatically detects reconciliation discrepancies and flags missing tax invoices before filing.',
    'Clean high-density tabular UI with color-coded discrepancy highlights and rapid filter shortcuts.',
    'Node.js, PostgreSQL, TypeScript, Prisma ORM, Nginx, Linux VPS.',
    'Cut audit preparation cycle time by 65% and eliminated ledger discrepancy errors during statutory reviews.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    true, true, 2
),
(
    3,
    'Himalayan Artisanal Supply Chain Tracker',
    'himalayan-artisanal-supply-chain',
    'Operations & Logistics',
    'End-to-end traceability platform for precious metals and indigenous gemstone verification.',
    'Implemented a rigorous custodial tracking system for precious metals and certified gemstones from raw discovery to finished jewellery hallmarking.',
    'Counterfeit certifications and unethically sourced minerals cloud consumer confidence in regional jewellery markets.',
    'Instituted physical batch identification numbers coupled with digital inspection checklists at every stage of melting, refining, and setting.',
    'Industrial dashboard with high-contrast status badges and verifiable tamper-evident certificates.',
    'TypeScript, PostgreSQL, Express, QR Code Integration, Nginx.',
    'Achieved 100% chain-of-custody verification for every gold bar and certified diamond processed through the atelier.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    true, true, 3
),
(
    4,
    'Next-Generation Cloud ERP & Payroll Portal',
    'cloud-erp-payroll-portal',
    'Operations & Systems',
    'Centralized workforce management, leave tracking, and automated statutory tax computations.',
    'Built an internal corporate operations portal managing multi-department employee records, leave allowances, and income tax withholdings.',
    'Managing employee shifts and payroll deductions across spreadsheets created recurring discrepancies and delayed salary releases.',
    'Developed a custom cloud application with strict role-based access, automated overtime calculators, and direct bank transfer exports.',
    'Responsive modern administrative interface optimized for desktop and mobile managers.',
    'React, Node.js, PostgreSQL, Tailwind CSS, Docker.',
    'Automated monthly payroll processing for 50+ staff with zero salary calculation errors.',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
    false, true, 4
),
(
    5,
    'High-Jewellery Digital Exhibition & Archive',
    'high-jewellery-digital-archive',
    'Design & Creative Direction',
    'Virtual showroom presenting bespoke commissions in 360-degree interactive 3D perspectives.',
    'Created a private digital viewing room allowing international clientele to inspect custom heirloom designs with magnification controls.',
    'Overseas clients hesitated to commit to high-ticket custom jewellery without experiencing the craftsmanship in three dimensions.',
    'Rendered cinematic 4K rotations and structural wireframes illustrating prong architecture and stone seating.',
    'Ultra-clean dark velvet aesthetics with gold typography accents and fluid motion transitions.',
    'WebGL, Three.js, React, Tailwind CSS, High-Resolution Asset Hosting.',
    'Increased international commission conversion rate by 45% within the first 6 months of deployment.',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
    false, true, 5
)
ON CONFLICT (slug) DO NOTHING;

-- 2.8.1 Project Images
INSERT INTO project_images (project_id, url, alt_text, caption, display_order)
VALUES
(1, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop', 'CAD Render of Solitaire Ring', '3D Matrix CAD model preview before lost-wax casting', 1),
(1, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop', 'Finished Micro-Pave Claw Setting in 18k Gold', 'Hand-finished pavé diamond setting under microscope', 2),
(2, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop', 'Ledger Reconciliation Dashboard UI', 'Real-time reconciliation feed and variance flags', 1),
(3, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop', 'Supply Chain Traceability Dashboard', 'Real-time batch verification and inspection checkpoints', 1),
(4, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop', 'ERP Payroll Calculation Screen', 'Automated tax withholding and salary disbursement interface', 1),
(5, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop', '360 Interactive Diamond Viewer', 'High-resolution digital showcase for bespoke private commissions', 1)
ON CONFLICT DO NOTHING;

-- 2.9 Gallery Images (6 Assets)
INSERT INTO gallery_images (url, alt_text, caption, category, width, height, featured, published, display_order)
VALUES
('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop', 'Bespoke Solitaire Diamond Ring in 18k Yellow Gold', 'Custom 1.50ct cushion cut solitaire handcrafted in our Kathmandu atelier.', 'Fine Jewellery', 1200, 800, true, true, 1),
('https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop', 'Micro-Pave Diamond Band Detail', 'Precision microscope stone setting with four-prong claw architecture.', 'Fine Jewellery', 1200, 800, true, true, 2),
('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop', 'Financial Audit & Corporate Ledger Review', 'Rigorous verification of fiscal books, audit files, and internal control structures.', 'Corporate Advisory', 1200, 800, true, true, 3),
('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop', 'Modern High-Performance Server Architecture', 'Production container systems, Nginx ingress routing, and database clustering.', 'Technology', 1200, 800, false, true, 4),
('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 'Executive Operations & Strategic Planning', 'Cross-functional leadership sessions aligning engineering, design, and operations.', 'Operations', 1200, 800, false, true, 5),
('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', 'Geometric Architectural Identity & Design System', 'Clean modern visual design language reflecting structural precision.', 'Design', 1200, 800, false, true, 6)
ON CONFLICT DO NOTHING;

-- 2.10 Blog Categories (2 Categories)
INSERT INTO blog_categories (id, name, slug, description)
VALUES
(1, 'Corporate Governance & Auditing', 'corporate-governance', 'Insights on statutory audits, financial controls, and risk management.'),
(2, 'Fine Jewellery & Metallurgy', 'fine-jewellery-metallurgy', 'Craftsmanship, 3D CAD modeling, and gems manufacturing.')
ON CONFLICT (slug) DO NOTHING;

-- 2.11 Blog Posts (5 Journal Posts)
INSERT INTO blog_posts (title, slug, excerpt, cover_image_url, content, reading_time, published_at, status, featured, tags, seo_title, seo_description)
VALUES
(
    'The Anatomy of an Audit-Ready Enterprise: Lessons from the Field',
    'anatomy-of-audit-ready-enterprise',
    'Why clean internal controls and disciplined daily accounting are the true superpowers of companies that scale.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    '# The Anatomy of an Audit-Ready Enterprise\n\nMost founders view accounting as a post-mortem exercise: something you scramble to assemble when tax season knocks or when an external auditor arrives.\n\nIn reality, disciplined accounting is a proactive operational radar.\n\n### 1. The Principle of Single-Source Ledgers\nWhen receipts, payment gateways, and banking records live in different silos, discrepancies compound exponentially. A standardized chart of accounts ensures that every dollar has an unmistakable origin and purpose.\n\n### 2. Internal Control as Risk Mitigation\nSeparation of duties, dual-signoff authorization, and routine inventory reconciliations are not bureaucratic red tape—they are structural armor against fraud, leakage, and compliance penalties.\n\n### 3. Building for International Scale\nIf your vision involves foreign direct investment (FDI) or international joint ventures, your financial hygiene must meet global scrutiny from day one.',
    6,
    NOW(),
    'PUBLISHED',
    true,
    ARRAY['Finance', 'Corporate Governance', 'Auditing', 'Operations'],
    'The Anatomy of an Audit-Ready Enterprise | Gunjan Shrestha',
    'Practical insights on building financial hygiene and internal audit resilience from founder Gunjan Shrestha.'
),
(
    'Bridging Traditional Metallurgy with 3D CAD: The Future of Fine Jewellery',
    'bridging-metallurgy-with-3d-cad',
    'How modern computational modeling elevates centuries-old goldsmithing without sacrificing the artisan soul.',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
    '# Bridging Traditional Metallurgy with 3D CAD\n\nFine jewellery has existed for millennia, but precision CAD technology has fundamentally transformed how bespoke pieces come to life.\n\n### Tolerances at the Sub-Millimeter Scale\nWhen setting a 2-carat natural diamond, a variance of 0.05mm in prong thickness determines whether a stone sits securely for fifty years or risks coming loose. 3D modeling enables stress-testing prong geometries before the gold is even cast.\n\n### Respecting the Human Hand\nTechnology never replaces the master goldsmith. While CAD models the matrix and 3D wax printers reproduce the form, the final filing, pavé bead setting, and mirror-buffing demand decades of tactile human craftsmanship.',
    5,
    NOW(),
    'PUBLISHED',
    true,
    ARRAY['Fine Jewellery', 'Manufacturing', 'CAD Design', 'Craftsmanship'],
    'Bridging Traditional Metallurgy with 3D CAD | Gunjan Shrestha',
    'Exploration of digital fabrication and artisanal goldsmithing in contemporary bespoke jewellery.'
),
(
    'Operational Velocity: Why Clear SOPs Trump Raw Talent',
    'operational-velocity-clear-sops',
    'How documented workflows and explicit handoffs empower teams to deliver exceptional quality consistently.',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    '# Operational Velocity: Why Clear SOPs Trump Raw Talent\n\nTalented individuals can produce miracles, but systems produce consistency.\n\nWhen a venture relies solely on individual heroics, growth hits a glass ceiling. The moment key personnel are absent, quality fluctuates.\n\n### 1. Codifying the Standard\nEvery recurring action—from inventory audits to client onboarding—must have a clear checklist. It removes guesswork and accelerates training.\n\n### 2. Eliminating Friction at the Handoff\nMost operational delays occur between teams: when design finishes and engineering begins, or when sales closes and fulfillment takes over. Clear interface definitions solve this friction.',
    4,
    NOW(),
    'PUBLISHED',
    true,
    ARRAY['Operations', 'Management', 'Productivity', 'Leadership'],
    'Operational Velocity: Why Clear SOPs Trump Raw Talent | Gunjan Shrestha',
    'Key operational principles for structuring scalable business processes.'
),
(
    'The Architecture of Sound Financial Internal Controls',
    'architecture-of-financial-internal-controls',
    'A practical framework for preventing cash leakages and ensuring ledger integrity in growing enterprises.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    '# The Architecture of Sound Financial Internal Controls\n\nInternal controls are frequently misunderstood as lack of trust. In truth, they protect both the business and its employees by eliminating ambiguity.\n\n### Core Pillars of Control\n- **Dual Authorization**: Payments above predefined thresholds require independent review.\n- **Bank Recs in Real Time**: Monthly reconciliations are too late; weekly checks catch discrepancies while memories are fresh.\n- **Vendor Due Diligence**: Verifying tax registration numbers and official banking credentials before processing disbursements.',
    5,
    NOW(),
    'PUBLISHED',
    false,
    ARRAY['Finance', 'Internal Controls', 'Compliance', 'Audit'],
    'The Architecture of Sound Financial Internal Controls | Gunjan Shrestha',
    'Framework for building corporate financial integrity and fraud-resistant ledgers.'
),
(
    'Scaling From Kathmandu: Operational Lessons in Cross-Border Logistics',
    'scaling-from-kathmandu-cross-border-logistics',
    'Navigating customs, insurance, and high-value international delivery from an emerging Himalayan market.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    '# Scaling From Kathmandu: Cross-Border Logistics\n\nShipping bespoke fine jewellery across international borders requires mastering international trade regulations, customs declarations, and insured armored transit.\n\nEvery export must satisfy statutory export clearances, hallmarking certification, and courier insurance liability limits. Building these pipelines turns regional craftsmanship into a viable multinational enterprise.',
    6,
    NOW(),
    'PUBLISHED',
    false,
    ARRAY['Logistics', 'Global Trade', 'Supply Chain', 'Jewellery'],
    'Scaling From Kathmandu: Cross-Border Logistics | Gunjan Shrestha',
    'Lessons in shipping luxury high-value products internationally from Nepal.'
)
ON CONFLICT (slug) DO NOTHING;

-- 2.12 Content Categories (6 Categories)
INSERT INTO content_categories (name, slug, type, description, display_order)
VALUES
('Executive Operations & Systems', 'operations-systems', 'OPERATIONS', 'SOPs, logistical architectures, and cross-functional leadership frameworks.', 1),
('Financial Accounting & Statutory Audit', 'finance-audit', 'FINANCE', 'Chart of accounts, reconciliation engines, and fiscal hygiene.', 2),
('Fine Jewellery & Atelier Craft', 'jewellery-craft', 'DESIGN', '3D CAD micro-modeling, precious metallurgy, and gemmological standards.', 3),
('Technology & Digital Architecture', 'tech-architecture', 'TECHNOLOGY', 'High-performance web applications, Linux servers, and relational databases.', 4),
('Luxury Brand & Creative Direction', 'luxury-branding', 'DESIGN', 'High-end branding, unboxing architecture, and editorial photography.', 5),
('Strategic Advisory & Scaling', 'strategic-advisory', 'GENERAL', 'Cross-border ventures, compliance frameworks, and organizational governance.', 6)
ON CONFLICT (slug) DO NOTHING;

-- 2.13 Social Links (4 Links)
INSERT INTO social_links (platform, label, url, icon, display_order, published)
VALUES
('LinkedIn', 'LinkedIn Official', 'https://www.linkedin.com/in/gunjan-shrestha', 'linkedin', 1, true),
('GitHub', 'GitHub Repositories', 'https://github.com/gunjanstha01', 'github', 2, true),
('Instagram', 'Fine Jewellery Atelier', 'https://instagram.com/gunjanfinejewellery', 'instagram', 3, true),
('WhatsApp', 'Direct Message', 'https://wa.me/9779800000000', 'message-circle', 4, true)
ON CONFLICT DO NOTHING;

-- 2.14 Admin User (1 Super Administrator)
INSERT INTO users (uid, email, password_hash, is_active)
VALUES ('admin_gunjan', 'gunjanstha01@gmail.com', 'gunjan2026', true)
ON CONFLICT (email) DO NOTHING;

-- 2.15 Sample Contact Messages (2 Inquiries)
INSERT INTO contact_messages (name, email, subject, message, status)
VALUES
('Aarav Sharma', 'aarav.sharma@example.com', 'Bespoke Engagement Ring Inquiry', 'Hello Gunjan, I admire your fine jewellery atelier work. I would like to inquire about a custom 18k yellow gold emerald-cut diamond ring for late 2026.', 'NEW'),
('Elena Rostova', 'elena.rostova@techscale.io', 'Executive Advisory & Operations Consulting', 'Hi Gunjan, we are scaling cross-functional teams in South Asia and would love to consult with you regarding financial control and operations management.', 'REPLIED')
ON CONFLICT DO NOTHING;

-- 2.16 Initial Audit Log (1 System Initialization Record)
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
VALUES
('admin_gunjan', 'DATABASE_SEED', 'SYSTEM', '1', '{"status": "SUCCESS", "message": "Database initialized with clean synchronized dataset"}'::jsonb)
ON CONFLICT DO NOTHING;
