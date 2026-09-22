-- Gunjan Shrestha Portfolio Database Schema & Seed
-- Target: PostgreSQL 14+ / 15+ / 16+

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
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
    email TEXT,
    phone TEXT,
    location TEXT,
    website TEXT,
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
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
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

-- 2. Seed Initial Profile & Settings
INSERT INTO profiles (name, headline, short_bio, long_bio, profile_image_url, email, phone, location, website)
VALUES (
    'Gunjan Shrestha',
    'Multidisciplinary Founder & Operator — Operations, Finance, Tech & Design',
    'Multidisciplinary founder and operator based in Kathmandu, focused on building businesses that can scale beyond local markets and operate at an international level.',
    'I believe people are defined by their work and their commitment to continuous improvement—learning from mistakes, taking responsibility, and consistently raising the bar. My background spans founding and operating ventures from the ground up: managing technology stacks, brand design, custom fine jewellery craftsmanship, and end-to-end digital strategies, alongside leading office operations, financial accounts, reporting, and cross-functional teams in software development and UI design.\n\nAlongside this, I have built extensive expertise in accounting, company auditing, and the legal and compliance frameworks required to run well-structured businesses. My focus is expanding this to international standards to build and scale multinational ventures combining strong operations, sound financial governance, and thoughtful brand strategy.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    'gunjanstha01@gmail.com',
    '+977 9800000000',
    'Kathmandu, Nepal',
    'https://www.gunjanshrestha.com.np'
) ON CONFLICT DO NOTHING;

INSERT INTO site_settings (site_name, site_description, logo_url, favicon_url, profile_image_url, email, phone, location, footer_text, accent_color, maintenance_mode, analytics_enabled, default_seo_title, default_seo_description, default_og_image_url)
VALUES (
    'Gunjan Shrestha | Founder & Operator',
    'Official portfolio of Gunjan Shrestha: Operations, financial auditing, bespoke fine jewellery manufacturing, brand design, and scalable technology systems.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=64&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    'gunjanstha01@gmail.com',
    '+977 9800000000',
    'Kathmandu, Nepal',
    'Crafted with architectural precision & relentless standards.',
    '#f59e0b',
    false,
    false,
    'Gunjan Shrestha — Executive Portfolio & Ventures',
    'Multidisciplinary Founder & Operator based in Kathmandu, Nepal.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
) ON CONFLICT DO NOTHING;

-- 3. Educations
INSERT INTO educations (institution, qualification, field, location, start_date, end_date, description, display_order, published)
VALUES
('Tribhuvan University', 'Bachelor of Business Studies (BBS)', 'Accounting, Financial Audit & Corporate Law', 'Kathmandu, Nepal', '2017', '2021', 'Focused on statutory audit standards, mercantile law, tax accounting, and organizational leadership.', 1, true),
('National Secondary School', '+2 Higher Secondary Education', 'Management & Accountancy', 'Kathmandu, Nepal', '2015', '2017', 'Graduated with distinction in principles of accounting, business mathematics, and economics.', 2, true)
ON CONFLICT DO NOTHING;

-- 4. Experiences
INSERT INTO experiences (category, title, organization, location, start_date, end_date, is_current, short_description, description, tags, image_url, featured, display_order, published)
VALUES
('Operations & Management', 'Operations, Accounts & Cross-Functional Management', 'Technology & Systems Enterprise', 'Kathmandu, Nepal', '2023', NULL, true, 'Leading office operations, logistics, accounting, financial reporting, and cross-functional software/design execution.', 'Shaping how the enterprise runs and scales. Work spans office operations, logistical systems, financial ledgers, compliance reporting, and steering cross-functional initiatives across software development, digital graphics, and UI/UX design workflows.', ARRAY['Operations', 'Financial Accounting', 'Reporting', 'Cross-Functional Leadership', 'Logistics', 'Software & UI'], 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', true, 1, true),
('Entrepreneurship & Craftsmanship', 'Founder, Master Craftsman & Brand Director', 'Gunjan Fine Jewellery', 'Kathmandu & International', '2021', NULL, true, 'Founding and scaling a bespoke fine jewellery atelier combining traditional goldsmithing with modern 3D CAD design.', 'Built an independent atelier brand from scratch. Directing every dimension: precious metal sourcing, CAD design, wax casting, gemmological grading, client advisory, packaging design, and worldwide fulfillment.', ARRAY['Jewellery Manufacturing', 'CAD Design', 'Gemmology', 'Luxury Branding', 'Direct-to-Consumer', 'Global Shipping'], 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop', true, 2, true),
('Finance & Corporate Governance', 'Financial Auditor & Corporate Accounts Specialist', 'Commercial Audit Practice', 'Kathmandu, Nepal', '2020', '2023', false, 'Conducted statutory audits, prepared trial balances and financial statements, and reviewed tax compliance across mid-size companies.', 'Specialized in rigorous internal controls and financial transparency. Prepared audit files, tested ledger integrity, reconciled banking operations, and drafted compliance recommendations for executive boards.', ARRAY['Statutory Audit', 'Corporate Taxation', 'Internal Controls', 'Financial Statements', 'Due Diligence'], 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop', false, 3, true)
ON CONFLICT DO NOTHING;

-- 5. Skill Categories
INSERT INTO skill_categories (id, name, slug, description, display_order, published)
VALUES
(1, 'Executive Operations & Leadership', 'operations-leadership', 'Managing operations, workflows, cross-functional teams, and logistics.', 1, true),
(2, 'Finance, Audit & Corporate Governance', 'finance-audit', 'Accounting systems, auditing standards, compliance, and fiscal oversight.', 2, true),
(3, 'Fine Jewellery Craft & Luxury Manufacturing', 'jewellery-craft', '3D CAD design, gemmology, goldsmithing, and luxury atelier production.', 3, true),
(4, 'Technology, Software & Systems', 'technology-systems', 'Modern full-stack web architectures, APIs, deployment, and cloud infrastructure.', 4, true),
(5, 'Brand Strategy & Visual Design', 'brand-design', 'High-end branding, UI/UX systems, photography direction, and packaging.', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 6. Skills
INSERT INTO skills (category_id, name, slug, description, icon, display_order, published)
VALUES
(1, 'Operations Management', 'operations-management', 'Standard operating procedures, office workflows, vendor management, and fulfillment pipelines.', 'briefcase', 1, true),
(1, 'Cross-Functional Team Steering', 'cross-functional-leadership', 'Aligning software engineers, UI/UX designers, and business operators toward precise milestones.', 'users', 2, true),
(2, 'Corporate Financial Accounting', 'financial-accounting', 'General ledger management, trial balance preparation, and balance sheet structuring.', 'calculator', 1, true),
(2, 'Statutory & Internal Audit', 'internal-audit', 'Audit evidence gathering, internal control evaluation, and compliance testing.', 'shield-check', 2, true),
(3, '3D CAD Jewellery Design', 'cad-jewellery-design', 'High-precision micro-prong setting CAD modeling for diamonds and fine gemstones.', 'gem', 1, true),
(3, 'Fine Goldsmithing & Casting', 'fine-goldsmithing', 'Directing lost-wax vacuum casting, hallmarking, polishing, and quality grading.', 'hammer', 2, true),
(4, 'Full-Stack Web Architecture', 'full-stack-architecture', 'React, TypeScript, Express, PostgreSQL, and performant REST API design.', 'code-2', 1, true),
(4, 'Linux Server & Cloud Deployment', 'linux-vps-deployment', 'Ubuntu, Nginx reverse proxies, SSL/TLS, PM2 process management, and Docker.', 'server', 2, true),
(5, 'Luxury Identity & Packaging', 'luxury-identity', 'Bespoke box packaging, brand typography, and unboxing experience architecture.', 'palette', 1, true)
ON CONFLICT (slug) DO NOTHING;

-- 7. Services
INSERT INTO services (title, slug, short_description, description, icon, display_order, featured, published)
VALUES
('Executive Operations & Growth Advisory', 'operations-growth-advisory', 'Structuring standard operating procedures, logistics, and accountability frameworks for expanding ventures.', 'Diagnosing operational bottlenecks and instituting clear systems that enable businesses to scale without chaos.', 'briefcase', 1, true, true),
('Financial Systems & Pre-Audit Preparedness', 'financial-audit-preparedness', 'Organizing chart of accounts, trial balances, and statutory compliance documentation for commercial reviews.', 'Ensuring corporate books and financial statements withstand rigorous independent audits and compliance scrutiny.', 'shield-check', 2, true, true),
('Bespoke Fine Jewellery Commissioning', 'bespoke-fine-jewellery', 'Custom 18k gold and diamond creations designed in 3D CAD and handcrafted to international luxury benchmarks.', 'One-on-one private commissions from rough gemstone selection and 3D modeling to casting, setting, and delivery.', 'gem', 3, true, true),
('Digital Product & Technical Architecture', 'technical-architecture', 'Modern web applications, internal operational dashboards, and digital platforms built with precision.', 'Designing and deploying scalable web applications that combine high aesthetic polish with reliable backend code.', 'code-2', 4, true, true)
ON CONFLICT (slug) DO NOTHING;

-- 8. Projects
INSERT INTO projects (title, slug, category, short_summary, overview, problem, approach, design, technology, result, featured, published, display_order)
VALUES
(
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
    true, true, 1
),
(
    'Enterprise Financial Ledger & Audit Engine',
    'enterprise-financial-audit-engine',
    'Corporate Finance & Software',
    'Unified internal ledger reconciliation tool designed to streamline commercial audit preparation.',
    'Architected an internal operations platform to bridge bank transaction feeds, physical invoice registers, and tax ledgers into a single verified audit trail.',
    'Businesses frequently waste hundreds of hours manually cross-checking paper receipts and multiple bank accounts during tax season.',
    'Created a rule-based matching engine that automatically detects reconciliation discrepancies and flags missing tax invoices before filing.',
    'Clean high-density tabular UI with color-coded discrepancy highlights and rapid filter shortcuts.',
    'Node.js, PostgreSQL, TypeScript, Drizzle ORM, Nginx, Linux VPS.',
    'Cut audit preparation cycle time by 65% and eliminated ledger discrepancy errors during statutory reviews.',
    true, true, 2
)
ON CONFLICT (slug) DO NOTHING;

-- 9. Gallery Images
INSERT INTO gallery_images (url, alt_text, caption, category, width, height, featured, published, display_order)
VALUES
('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop', 'Bespoke Solitaire Diamond Ring in 18k Yellow Gold', 'Custom 1.50ct cushion cut solitaire handcrafted in our Kathmandu atelier.', 'Fine Jewellery', 1200, 800, true, true, 1),
('https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop', 'Micro-Pave Diamond Band Detail', 'Precision microscope stone setting with four-prong claw architecture.', 'Fine Jewellery', 1200, 800, true, true, 2),
('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop', 'Financial Audit & Corporate Ledger Review', 'Rigorous verification of fiscal books, audit files, and internal control structures.', 'Corporate Advisory', 1200, 800, false, true, 3),
('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop', 'Modern High-Performance Server Architecture', 'Production container systems, Nginx ingress routing, and database clustering.', 'Technology', 1200, 800, false, true, 4)
ON CONFLICT DO NOTHING;

-- 10. Blog Posts
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
)
ON CONFLICT (slug) DO NOTHING;

-- 11. Social Links
INSERT INTO social_links (platform, label, url, icon, display_order, published)
VALUES
('LinkedIn', 'LinkedIn Official', 'https://www.linkedin.com/in/gunjan-shrestha', 'linkedin', 1, true),
('GitHub', 'GitHub Repositories', 'https://github.com/gunjanstha01', 'github', 2, true),
('Instagram', 'Fine Jewellery Atelier', 'https://instagram.com/gunjanfinejewellery', 'instagram', 3, true),
('WhatsApp', 'Direct Message', 'https://wa.me/9779800000000', 'message-circle', 4, true)
ON CONFLICT DO NOTHING;
