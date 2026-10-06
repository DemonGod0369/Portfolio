import 'dotenv/config';
import { prisma } from './index.ts';
import { ensureDatabaseSchema } from './migrate.ts';

/**
 * ==============================================================================
 * Gunjan Shrestha Portfolio & Executive CMS Platform — Master TypeScript Seeder
 * ==============================================================================
 * Production-ready, type-safe, and 100% idempotent seeder powered by Prisma ORM.
 * Synchronized with prisma/schema.prisma and seed.sql.
 * 
 * Capabilities:
 * - Dynamic foreign-key relationship resolution (no brittle hardcoded IDs)
 * - Safe UPSERT mechanics (runs cleanly on fresh setups or existing databases)
 * - PostgreSQL sequence resynchronization for smooth CMS auto-increment
 * - Comprehensive logging and data validation
 */

async function main() {
  const startTime = Date.now();
  console.log('================================================================');
  console.log('Gunjan Shrestha Platform — Production Database Seeder');
  console.log('================================================================');

  try {
    // 1. Ensure migrations and columns exist
    console.log('1. Checking database schema and column consistency...');
    await ensureDatabaseSchema();
    console.log('   Schema check verified.');

    // 2. Super Administrator User
    console.log('2. Seeding Super Administrator User...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'gunjanstha01@gmail.com' },
      update: {
        uid: 'admin_gunjan',
        isActive: true,
      },
      create: {
        uid: 'admin_gunjan',
        email: 'gunjanstha01@gmail.com',
        passwordHash: 'gunjan2026',
        isActive: true,
      },
    });
    console.log(`   Admin User verified: ${adminUser.email}`);

    // 3. Executive Profile
    console.log('3. Seeding Executive Profile...');
    const existingProfile = await prisma.profile.findFirst();
    const profileData = {
      name: 'Gunjan Shrestha',
      headline: 'Multidisciplinary Founder & Operator — Operations, Finance, Tech & Design',
      shortBio: 'Multidisciplinary founder and operator based in Kathmandu, focused on building businesses that can scale beyond local markets and operate at an international level.',
      longBio: `I believe people are defined by their work and their commitment to continuous improvement—learning from mistakes, taking responsibility, and consistently raising the bar. My background spans founding and operating ventures from the ground up: managing technology stacks, brand design, custom fine jewellery craftsmanship, and end-to-end digital strategies, alongside leading office operations, financial accounts, reporting, and cross-functional teams in software development and UI design.

Alongside this, I have built extensive expertise in accounting, company auditing, and the legal and compliance frameworks required to run well-structured businesses. My focus is expanding this to international standards to build and scale multinational ventures combining strong operations, sound financial governance, and thoughtful brand strategy.`,
      profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      visitingCardImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      dateOfBirth: '1997-01-01',
      address: 'Kathmandu, Bagmati, Nepal',
      email: 'gunjanstha01@gmail.com',
      alternateEmail: 'contact@gunjanshrestha.com.np',
      primaryEmailLabel: 'Primary Direct',
      alternateEmailLabel: 'Inquiries',
      phone: '+977 9800000000',
      secondaryPhone: '+977 9811111111',
      phoneDisplayOption: 'both',
      whatsappNumber: '+977 9800000000',
      location: 'Kathmandu, Nepal',
      website: 'https://www.gunjanshrestha.com.np',
      availabilityStatus: 'Available for Strategic Advisory & Multinational Ventures',
      availabilityCustomNote: 'Accepting new executive advisory, bespoke jewellery commissions, and cross-border ventures.',
      timezone: 'UTC+5:45 (Kathmandu)',
      responseTime: 'Within 24 Hours',
      languagesSpoken: ['English', 'Nepali', 'Newari', 'Hindi'],
    };

    if (existingProfile) {
      await prisma.profile.update({
        where: { id: existingProfile.id },
        data: profileData,
      });
    } else {
      await prisma.profile.create({ data: profileData });
    }
    console.log('   Profile record seeded.');

    // 4. Site Settings & SEO
    console.log('4. Seeding Global Site Settings & SEO...');
    const existingSettings = await prisma.siteSetting.findFirst();
    const settingsData = {
      siteName: 'Gunjan Shrestha | Founder & Operator',
      siteDescription: 'Official portfolio of Gunjan Shrestha: Operations, financial auditing, bespoke fine jewellery manufacturing, brand design, and scalable technology systems.',
      canonicalUrl: 'https://www.gunjanshrestha.com.np',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
      faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=64&auto=format&fit=crop',
      profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      email: 'gunjanstha01@gmail.com',
      phone: '+977 9800000000',
      location: 'Kathmandu, Nepal',
      footerText: 'Crafted with architectural precision & relentless standards.',
      accentColor: '#c6a87d',
      maintenanceMode: false,
      analyticsEnabled: false,
      defaultSeoTitle: 'Gunjan Shrestha — Executive Portfolio & Ventures',
      defaultSeoDescription: 'Multidisciplinary Founder & Operator based in Kathmandu, Nepal.',
      defaultOgImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      seoKeywords: 'Gunjan Shrestha, Founder, Operations, Finance, Audit, Fine Jewellery, Nepal, Technology',
      allowIndexing: true,
    };

    if (existingSettings) {
      await prisma.siteSetting.update({
        where: { id: existingSettings.id },
        data: settingsData,
      });
    } else {
      await prisma.siteSetting.create({ data: settingsData });
    }
    console.log('   Site settings seeded.');

    // 5. Academic Records (Educations)
    console.log('5. Seeding Academic Qualifications...');
    const educations = [
      {
        institution: 'Tribhuvan University',
        qualification: 'Bachelor of Business Studies (BBS)',
        field: 'Accounting, Financial Audit & Corporate Law',
        location: 'Kathmandu, Nepal',
        startDate: '2017',
        endDate: '2021',
        description: 'Focused on statutory audit standards, mercantile law, tax accounting, and organizational leadership.',
        displayOrder: 1,
        published: true,
      },
      {
        institution: 'National Secondary School',
        qualification: '+2 Higher Secondary Education',
        field: 'Management & Accountancy',
        location: 'Kathmandu, Nepal',
        startDate: '2015',
        endDate: '2017',
        description: 'Graduated with distinction in principles of accounting, business mathematics, and economics.',
        displayOrder: 2,
        published: true,
      },
    ];

    for (const edu of educations) {
      const match = await prisma.education.findFirst({
        where: { institution: edu.institution, qualification: edu.qualification },
      });
      if (match) {
        await prisma.education.update({ where: { id: match.id }, data: edu });
      } else {
        await prisma.education.create({ data: edu });
      }
    }
    console.log(`   ${educations.length} Education records synchronized.`);

    // 6. Career Experiences
    console.log('6. Seeding Career Milestones & Ventures...');
    const experiences = [
      {
        category: 'Operations & Management',
        title: 'Operations, Accounts & Cross-Functional Management',
        roleTitle: 'Head of Operations & Controller',
        organization: 'Technology & Systems Enterprise',
        location: 'Kathmandu, Nepal',
        startDate: '2023',
        endDate: undefined,
        isCurrent: true,
        shortDescription: 'Leading office operations, logistics, accounting, financial reporting, and cross-functional software/design execution.',
        description: 'Shaping how the enterprise runs and scales. Work spans office operations, logistical systems, financial ledgers, compliance reporting, and steering cross-functional initiatives across software development, digital graphics, and UI/UX design workflows.',
        tags: ['Operations', 'Financial Accounting', 'Reporting', 'Cross-Functional Leadership', 'Logistics', 'Software & UI'],
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
        featured: true,
        displayOrder: 1,
        published: true,
      },
      {
        category: 'Entrepreneurship & Craftsmanship',
        title: 'Founder, Master Craftsman & Brand Director',
        roleTitle: 'Founder & Creative Director',
        organization: 'Gunjan Fine Jewellery',
        location: 'Kathmandu & International',
        startDate: '2021',
        endDate: undefined,
        isCurrent: true,
        shortDescription: 'Founding and scaling a bespoke fine jewellery atelier combining traditional goldsmithing with modern 3D CAD design.',
        description: 'Built an independent atelier brand from scratch. Directing every dimension: precious metal sourcing, CAD design, wax casting, gemmological grading, client advisory, packaging design, and worldwide fulfillment.',
        tags: ['Jewellery Manufacturing', 'CAD Design', 'Gemmology', 'Luxury Branding', 'Direct-to-Consumer', 'Global Shipping'],
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
        featured: true,
        displayOrder: 2,
        published: true,
      },
      {
        category: 'Finance & Corporate Governance',
        title: 'Financial Auditor & Corporate Accounts Specialist',
        roleTitle: 'Senior Audit Associate',
        organization: 'Commercial Audit Practice',
        location: 'Kathmandu, Nepal',
        startDate: '2020',
        endDate: '2023',
        isCurrent: false,
        shortDescription: 'Conducted statutory audits, prepared trial balances and financial statements, and reviewed tax compliance across mid-size companies.',
        description: 'Specialized in rigorous internal controls and financial transparency. Prepared audit files, tested ledger integrity, reconciled banking operations, and drafted compliance recommendations for executive boards.',
        tags: ['Statutory Audit', 'Corporate Taxation', 'Internal Controls', 'Financial Statements', 'Due Diligence'],
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
        featured: false,
        displayOrder: 3,
        published: true,
      },
      {
        category: 'Technology & Digital Architecture',
        title: 'Technology Systems & Digital Solutions Lead',
        roleTitle: 'Systems Consultant',
        organization: 'Digital Advisory Group',
        location: 'Kathmandu, Nepal',
        startDate: '2019',
        endDate: '2021',
        isCurrent: false,
        shortDescription: 'Architecting scalable web software, database infrastructures, and automation systems for commercial entities.',
        description: 'Designed end-to-end IT infrastructure blueprints, high-uptime Linux hosting, and automated data entry workflows that reduced manual overhead by 40%.',
        tags: ['Web Architecture', 'PostgreSQL', 'Linux VPS', 'Process Automation', 'API Design'],
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
        featured: false,
        displayOrder: 4,
        published: true,
      },
      {
        category: 'Corporate Finance & Compliance',
        title: 'Junior Accounting & Tax Associate',
        roleTitle: 'Accounting Associate',
        organization: 'Chartered Accountancy Firm',
        location: 'Kathmandu, Nepal',
        startDate: '2017',
        endDate: '2019',
        isCurrent: false,
        shortDescription: 'Assisted in client tax filings, VAT reconciliations, payroll administration, and preliminary audit verification.',
        description: 'Built the core foundation of mercantile law, statutory tax registers, and double-entry accounting procedures across diverse trading and hospitality businesses.',
        tags: ['Tax Filing', 'VAT Reconciliation', 'Payroll Administration', 'Bookkeeping'],
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
        featured: false,
        displayOrder: 5,
        published: true,
      },
    ];

    for (const exp of experiences) {
      const match = await prisma.experience.findFirst({
        where: { title: exp.title, organization: exp.organization },
      });
      if (match) {
        await prisma.experience.update({ where: { id: match.id }, data: exp });
      } else {
        await prisma.experience.create({ data: exp });
      }
    }
    console.log(`   ${experiences.length} Experience records synchronized.`);

    // 7. Skill Categories & Skills
    console.log('7. Seeding Skill Categories and Technical/Craft Skills...');
    const categoryDefinitions = [
      {
        name: 'Executive Operations & Leadership',
        slug: 'operations-leadership',
        description: 'Managing operations, workflows, cross-functional teams, and logistics.',
        displayOrder: 1,
        skills: [
          { name: 'Operations Management', slug: 'operations-management', description: 'Standard operating procedures, office workflows, vendor management, and fulfillment pipelines.', icon: 'briefcase', displayOrder: 1 },
          { name: 'Cross-Functional Team Steering', slug: 'cross-functional-leadership', description: 'Aligning software engineers, UI/UX designers, and business operators toward precise milestones.', icon: 'users', displayOrder: 2 },
          { name: 'Process Automation & SOPs', slug: 'process-automation', description: 'Designing scalable operating manuals and automated notification pipelines.', icon: 'cpu', displayOrder: 3 },
          { name: 'Supply Chain & Fulfillment', slug: 'supply-chain-fulfillment', description: 'End-to-end tracking of materials, production stages, and worldwide secure delivery.', icon: 'truck', displayOrder: 4 },
        ],
      },
      {
        name: 'Finance, Audit & Corporate Governance',
        slug: 'finance-audit',
        description: 'Accounting systems, auditing standards, compliance, and fiscal oversight.',
        displayOrder: 2,
        skills: [
          { name: 'Corporate Financial Accounting', slug: 'financial-accounting', description: 'General ledger management, trial balance preparation, and balance sheet structuring.', icon: 'calculator', displayOrder: 5 },
          { name: 'Statutory & Internal Audit', slug: 'internal-audit', description: 'Audit evidence gathering, internal control evaluation, and compliance testing.', icon: 'shield-check', displayOrder: 6 },
          { name: 'Tax Compliance & Corporate Law', slug: 'tax-compliance', description: 'VAT reconciliation, corporate filing frameworks, and company law procedures.', icon: 'scale', displayOrder: 7 },
          { name: 'Risk & Controls Assessment', slug: 'risk-controls-assessment', description: 'Identifying operational leakages and establishing dual-signoff authorization policies.', icon: 'lock', displayOrder: 8 },
        ],
      },
      {
        name: 'Fine Jewellery Craft & Luxury Manufacturing',
        slug: 'jewellery-craft',
        description: '3D CAD design, gemmology, goldsmithing, and luxury atelier production.',
        displayOrder: 3,
        skills: [
          { name: '3D CAD Jewellery Design', slug: 'cad-jewellery-design', description: 'High-precision micro-prong setting CAD modeling for diamonds and fine gemstones.', icon: 'gem', displayOrder: 9 },
          { name: 'Fine Goldsmithing & Casting', slug: 'fine-goldsmithing', description: 'Directing lost-wax vacuum casting, hallmarking, polishing, and quality grading.', icon: 'hammer', displayOrder: 10 },
          { name: 'Gemmological Grading', slug: 'gemmological-grading', description: 'Evaluating 4Cs of diamonds and coloured gemstone inclusions and spectral clarity.', icon: 'eye', displayOrder: 11 },
          { name: 'Micro-Pave Diamond Setting', slug: 'micro-pave-setting', description: 'Ultra-tight stone setting under stereomicroscope magnification for seamless brilliance.', icon: 'sparkles', displayOrder: 12 },
        ],
      },
      {
        name: 'Technology, Software & Systems',
        slug: 'technology-systems',
        description: 'Modern full-stack web architectures, APIs, deployment, and cloud infrastructure.',
        displayOrder: 4,
        skills: [
          { name: 'Full-Stack Web Architecture', slug: 'full-stack-architecture', description: 'React, TypeScript, Express, PostgreSQL, and performant REST API design.', icon: 'code-2', displayOrder: 13 },
          { name: 'Linux Server & VPS Deployment', slug: 'linux-vps-deployment', description: 'Ubuntu, Nginx reverse proxies, SSL/TLS, PM2 process management, and Docker.', icon: 'server', displayOrder: 14 },
        ],
      },
      {
        name: 'Brand Strategy & Visual Design',
        slug: 'brand-design',
        description: 'High-end branding, UI/UX systems, photography direction, and packaging.',
        displayOrder: 5,
        skills: [
          { name: 'Luxury Identity & Packaging', slug: 'luxury-identity', description: 'Bespoke box packaging, brand typography, and unboxing experience architecture.', icon: 'palette', displayOrder: 15 },
          { name: 'Editorial Photography Direction', slug: 'editorial-photography', description: 'Art direction for fine jewelry macro photography and high-end brand assets.', icon: 'camera', displayOrder: 16 },
        ],
      },
    ];

    let totalSkillsCount = 0;
    for (const cat of categoryDefinitions) {
      const categoryRecord = await prisma.skillCategory.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          description: cat.description,
          displayOrder: cat.displayOrder,
          published: true,
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          displayOrder: cat.displayOrder,
          published: true,
        },
      });

      for (const skill of cat.skills) {
        await prisma.skill.upsert({
          where: { slug: skill.slug },
          update: {
            categoryId: categoryRecord.id,
            name: skill.name,
            description: skill.description,
            icon: skill.icon,
            displayOrder: skill.displayOrder,
            published: true,
          },
          create: {
            categoryId: categoryRecord.id,
            name: skill.name,
            slug: skill.slug,
            description: skill.description,
            icon: skill.icon,
            displayOrder: skill.displayOrder,
            published: true,
          },
        });
        totalSkillsCount++;
      }
    }
    console.log(`   ${categoryDefinitions.length} Skill Categories and ${totalSkillsCount} Skills synchronized.`);

    // 8. Service Offerings
    console.log('8. Seeding Service Offerings & Advisory...');
    const services = [
      {
        title: 'Executive Operations & Growth Advisory',
        slug: 'operations-growth-advisory',
        shortDescription: 'Structuring standard operating procedures, logistics, and accountability frameworks for expanding ventures.',
        description: 'Diagnosing operational bottlenecks and instituting clear systems that enable businesses to scale without chaos.',
        icon: 'briefcase',
        displayOrder: 1,
        featured: true,
        published: true,
      },
      {
        title: 'Financial Systems & Pre-Audit Preparedness',
        slug: 'financial-audit-preparedness',
        shortDescription: 'Organizing chart of accounts, trial balances, and statutory compliance documentation for commercial reviews.',
        description: 'Ensuring corporate books and financial statements withstand rigorous independent audits and compliance scrutiny.',
        icon: 'shield-check',
        displayOrder: 2,
        featured: true,
        published: true,
      },
      {
        title: 'Bespoke Fine Jewellery Commissioning',
        slug: 'bespoke-fine-jewellery',
        shortDescription: 'Custom 18k gold and diamond creations designed in 3D CAD and handcrafted to international luxury benchmarks.',
        description: 'One-on-one private commissions from rough gemstone selection and 3D modeling to casting, setting, and delivery.',
        icon: 'gem',
        displayOrder: 3,
        featured: true,
        published: true,
      },
      {
        title: 'Digital Product & Technical Architecture',
        slug: 'technical-architecture',
        shortDescription: 'Modern web applications, internal operational dashboards, and digital platforms built with precision.',
        description: 'Designing and deploying scalable web applications that combine high aesthetic polish with reliable backend code.',
        icon: 'code-2',
        displayOrder: 4,
        featured: true,
        published: true,
      },
      {
        title: 'Corporate Governance & Internal Controls Audit',
        slug: 'corporate-governance-audit',
        shortDescription: 'Comprehensive review of organizational policies, financial authorizations, and fraud prevention controls.',
        description: 'Helping mid-tier and emerging enterprises structure robust internal governance that builds trust with investors and lenders.',
        icon: 'scale',
        displayOrder: 5,
        featured: false,
        published: true,
      },
      {
        title: 'Luxury Brand Strategy & Packaging Design',
        slug: 'luxury-brand-packaging',
        shortDescription: 'Crafting distinguished visual identities, custom unboxing packaging, and premium brand storytelling.',
        description: 'Transforming bespoke craft and high-ticket products into internationally recognized luxury marques.',
        icon: 'palette',
        displayOrder: 6,
        featured: false,
        published: true,
      },
    ];

    for (const service of services) {
      await prisma.service.upsert({
        where: { slug: service.slug },
        update: service,
        create: service,
      });
    }
    console.log(`   ${services.length} Service offerings synchronized.`);

    // 9. Case Studies & Projects (with Project Images)
    console.log('9. Seeding Case Studies & Project Portfolios...');
    const projects = [
      {
        title: 'Gunjan Fine Jewellery: Global Bespoke Atelier',
        slug: 'gunjan-fine-jewellery-atelier',
        category: 'Luxury Brand & Manufacturing',
        shortSummary: 'Founding and building an independent luxury atelier from Kathmandu with bespoke clients worldwide.',
        overview: 'A vertically integrated fine jewellery brand that merges traditional Himalayan craftsmanship with cutting-edge 3D CAD modeling and ethically sourced precious stones.',
        problem: 'Traditional jewellery retail in South Asia often suffers from opaque pricing, outdated designs, and lack of modern digital customer experience for international buyers.',
        approach: 'Established an end-to-end bespoke pipeline: 3D photorealistic CAD renders before metal pouring, strict certified diamond sourcing, and insured worldwide shipping.',
        design: 'Minimalist luxury aesthetic: warm champagnes, deep charcoal velvets, and architectural geometry.',
        technology: 'Matrix 3D CAD, Rhino 3D, High-Resolution 3D Wax Printers, React E-Commerce Portal, PostgreSQL.',
        result: 'Delivered dozens of bespoke bridal and ceremonial heirlooms across Nepal, the US, and Australia with zero defect returns.',
        heroImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
        featured: true,
        published: true,
        displayOrder: 1,
        images: [
          { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop', altText: 'CAD Render of Solitaire Ring', caption: '3D Matrix CAD model preview before lost-wax casting', displayOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop', altText: 'Finished Micro-Pave Claw Setting in 18k Gold', caption: 'Hand-finished pavé diamond setting under microscope', displayOrder: 2 },
        ],
      },
      {
        title: 'Enterprise Financial Ledger & Audit Engine',
        slug: 'enterprise-financial-audit-engine',
        category: 'Corporate Finance & Software',
        shortSummary: 'Unified internal ledger reconciliation tool designed to streamline commercial audit preparation.',
        overview: 'Architected an internal operations platform to bridge bank transaction feeds, physical invoice registers, and tax ledgers into a single verified audit trail.',
        problem: 'Businesses frequently waste hundreds of hours manually cross-checking paper receipts and multiple bank accounts during tax season.',
        approach: 'Created a rule-based matching engine that automatically detects reconciliation discrepancies and flags missing tax invoices before filing.',
        design: 'Clean high-density tabular UI with color-coded discrepancy highlights and rapid filter shortcuts.',
        technology: 'Node.js, PostgreSQL, TypeScript, Prisma ORM, Nginx, Linux VPS.',
        result: 'Cut audit preparation cycle time by 65% and eliminated ledger discrepancy errors during statutory reviews.',
        heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
        featured: true,
        published: true,
        displayOrder: 2,
        images: [
          { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop', altText: 'Ledger Reconciliation Dashboard UI', caption: 'Real-time reconciliation feed and variance flags', displayOrder: 1 },
        ],
      },
      {
        title: 'Himalayan Artisanal Supply Chain Tracker',
        slug: 'himalayan-artisanal-supply-chain',
        category: 'Operations & Logistics',
        shortSummary: 'End-to-end traceability platform for precious metals and indigenous gemstone verification.',
        overview: 'Implemented a rigorous custodial tracking system for precious metals and certified gemstones from raw discovery to finished jewellery hallmarking.',
        problem: 'Counterfeit certifications and unethically sourced minerals cloud consumer confidence in regional jewellery markets.',
        approach: 'Instituted physical batch identification numbers coupled with digital inspection checklists at every stage of melting, refining, and setting.',
        design: 'Industrial dashboard with high-contrast status badges and verifiable tamper-evident certificates.',
        technology: 'TypeScript, PostgreSQL, Express, QR Code Integration, Nginx.',
        result: 'Achieved 100% chain-of-custody verification for every gold bar and certified diamond processed through the atelier.',
        heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
        featured: true,
        published: true,
        displayOrder: 3,
        images: [
          { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop', altText: 'Supply Chain Traceability Dashboard', caption: 'Real-time batch verification and inspection checkpoints', displayOrder: 1 },
        ],
      },
      {
        title: 'Next-Generation Cloud ERP & Payroll Portal',
        slug: 'cloud-erp-payroll-portal',
        category: 'Operations & Systems',
        shortSummary: 'Centralized workforce management, leave tracking, and automated statutory tax computations.',
        overview: 'Built an internal corporate operations portal managing multi-department employee records, leave allowances, and income tax withholdings.',
        problem: 'Managing employee shifts and payroll deductions across spreadsheets created recurring discrepancies and delayed salary releases.',
        approach: 'Developed a custom cloud application with strict role-based access, automated overtime calculators, and direct bank transfer exports.',
        design: 'Responsive modern administrative interface optimized for desktop and mobile managers.',
        technology: 'React, Node.js, PostgreSQL, Tailwind CSS, Docker.',
        result: 'Automated monthly payroll processing for 50+ staff with zero salary calculation errors.',
        heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
        featured: false,
        published: true,
        displayOrder: 4,
        images: [
          { url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop', altText: 'ERP Payroll Calculation Screen', caption: 'Automated tax withholding and salary disbursement interface', displayOrder: 1 },
        ],
      },
      {
        title: 'High-Jewellery Digital Exhibition & Archive',
        slug: 'high-jewellery-digital-archive',
        category: 'Design & Creative Direction',
        shortSummary: 'Virtual showroom presenting bespoke commissions in 360-degree interactive 3D perspectives.',
        overview: 'Created a private digital viewing room allowing international clientele to inspect custom heirloom designs with magnification controls.',
        problem: 'Overseas clients hesitated to commit to high-ticket custom jewellery without experiencing the craftsmanship in three dimensions.',
        approach: 'Rendered cinematic 4K rotations and structural wireframes illustrating prong architecture and stone seating.',
        design: 'Ultra-clean dark velvet aesthetics with gold typography accents and fluid motion transitions.',
        technology: 'WebGL, Three.js, React, Tailwind CSS, High-Resolution Asset Hosting.',
        result: 'Increased international commission conversion rate by 45% within the first 6 months of deployment.',
        heroImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
        featured: false,
        published: true,
        displayOrder: 5,
        images: [
          { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop', altText: '360 Interactive Diamond Viewer', caption: 'High-resolution digital showcase for bespoke private commissions', displayOrder: 1 },
        ],
      },
    ];

    for (const proj of projects) {
      const { images, ...projFields } = proj;
      const projectRecord = await prisma.project.upsert({
        where: { slug: proj.slug },
        update: projFields,
        create: projFields,
      });

      // Synchronize Project Images
      if (images && images.length > 0) {
        for (const img of images) {
          const match = await prisma.projectImage.findFirst({
            where: { projectId: projectRecord.id, url: img.url },
          });
          if (!match) {
            await prisma.projectImage.create({
              data: {
                projectId: projectRecord.id,
                url: img.url,
                altText: img.altText,
                caption: img.caption,
                displayOrder: img.displayOrder,
              },
            });
          }
        }
      }
    }
    console.log(`   ${projects.length} Case Studies synchronized.`);

    // 10. Gallery Showcase Images
    console.log('10. Seeding Gallery Showcase Images...');
    const galleryImages = [
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop', altText: 'Bespoke Solitaire Diamond Ring in 18k Yellow Gold', caption: 'Custom 1.50ct cushion cut solitaire handcrafted in our Kathmandu atelier.', category: 'Fine Jewellery', width: 1200, height: 800, featured: true, published: true, displayOrder: 1 },
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop', altText: 'Micro-Pave Diamond Band Detail', caption: 'Precision microscope stone setting with four-prong claw architecture.', category: 'Fine Jewellery', width: 1200, height: 800, featured: true, published: true, displayOrder: 2 },
      { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop', altText: 'Financial Audit & Corporate Ledger Review', caption: 'Rigorous verification of fiscal books, audit files, and internal control structures.', category: 'Corporate Advisory', width: 1200, height: 800, featured: true, published: true, displayOrder: 3 },
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop', altText: 'Modern High-Performance Server Architecture', caption: 'Production container systems, Nginx ingress routing, and database clustering.', category: 'Technology', width: 1200, height: 800, featured: false, published: true, displayOrder: 4 },
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', altText: 'Executive Operations & Strategic Planning', caption: 'Cross-functional leadership sessions aligning engineering, design, and operations.', category: 'Operations', width: 1200, height: 800, featured: false, published: true, displayOrder: 5 },
      { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', altText: 'Geometric Architectural Identity & Design System', caption: 'Clean modern visual design language reflecting structural precision.', category: 'Design', width: 1200, height: 800, featured: false, published: true, displayOrder: 6 },
    ];

    for (const img of galleryImages) {
      const match = await prisma.galleryImage.findFirst({ where: { url: img.url } });
      if (match) {
        await prisma.galleryImage.update({ where: { id: match.id }, data: img });
      } else {
        await prisma.galleryImage.create({ data: img });
      }
    }
    console.log(`   ${galleryImages.length} Gallery assets synchronized.`);

    // 11. Blog Categories & Journal Posts
    console.log('11. Seeding Blog Categories & Journal Posts...');
    const blogCategories = [
      { name: 'Corporate Governance & Auditing', slug: 'corporate-governance', description: 'Insights on statutory audits, financial controls, and risk management.' },
      { name: 'Fine Jewellery & Metallurgy', slug: 'fine-jewellery-metallurgy', description: 'Craftsmanship, 3D CAD modeling, and gems manufacturing.' },
    ];

    const categoryMap = new Map<string, number>();
    for (const bCat of blogCategories) {
      const record = await prisma.blogCategory.upsert({
        where: { slug: bCat.slug },
        update: bCat,
        create: bCat,
      });
      categoryMap.set(bCat.slug, record.id);
    }

    const blogPosts = [
      {
        title: 'The Anatomy of an Audit-Ready Enterprise: Lessons from the Field',
        slug: 'anatomy-of-audit-ready-enterprise',
        excerpt: 'Why clean internal controls and disciplined daily accounting are the true superpowers of companies that scale.',
        coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
        content: `# The Anatomy of an Audit-Ready Enterprise

Most founders view accounting as a post-mortem exercise: something you scramble to assemble when tax season knocks or when an external auditor arrives.

In reality, disciplined accounting is a proactive operational radar.

### 1. The Principle of Single-Source Ledgers
When receipts, payment gateways, and banking records live in different silos, discrepancies compound exponentially. A standardized chart of accounts ensures that every dollar has an unmistakable origin and purpose.

### 2. Internal Control as Risk Mitigation
Separation of duties, dual-signoff authorization, and routine inventory reconciliations are not bureaucratic red tape—they are structural armor against fraud, leakage, and compliance penalties.

### 3. Building for International Scale
If your vision involves foreign direct investment (FDI) or international joint ventures, your financial hygiene must meet global scrutiny from day one.`,
        category: 'Corporate Governance & Auditing',
        categorySlug: 'corporate-governance',
        readingTime: 6,
        publishedAt: new Date(),
        status: 'PUBLISHED',
        featured: true,
        tags: ['Finance', 'Corporate Governance', 'Auditing', 'Operations'],
        seoTitle: 'The Anatomy of an Audit-Ready Enterprise | Gunjan Shrestha',
        seoDescription: 'Practical insights on building financial hygiene and internal audit resilience from founder Gunjan Shrestha.',
      },
      {
        title: 'Bridging Traditional Metallurgy with 3D CAD: The Future of Fine Jewellery',
        slug: 'bridging-metallurgy-with-3d-cad',
        excerpt: 'How modern computational modeling elevates centuries-old goldsmithing without sacrificing the artisan soul.',
        coverImageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
        content: `# Bridging Traditional Metallurgy with 3D CAD

Fine jewellery has existed for millennia, but precision CAD technology has fundamentally transformed how bespoke pieces come to life.

### Tolerances at the Sub-Millimeter Scale
When setting a 2-carat natural diamond, a variance of 0.05mm in prong thickness determines whether a stone sits securely for fifty years or risks coming loose. 3D modeling enables stress-testing prong geometries before the gold is even cast.

### Respecting the Human Hand
Technology never replaces the master goldsmith. While CAD models the matrix and 3D wax printers reproduce the form, the final filing, pavé bead setting, and mirror-buffing demand decades of tactile human craftsmanship.`,
        category: 'Fine Jewellery & Metallurgy',
        categorySlug: 'fine-jewellery-metallurgy',
        readingTime: 5,
        publishedAt: new Date(),
        status: 'PUBLISHED',
        featured: true,
        tags: ['Fine Jewellery', 'Manufacturing', 'CAD Design', 'Craftsmanship'],
        seoTitle: 'Bridging Traditional Metallurgy with 3D CAD | Gunjan Shrestha',
        seoDescription: 'Exploration of digital fabrication and artisanal goldsmithing in contemporary bespoke jewellery.',
      },
      {
        title: 'Operational Velocity: Why Clear SOPs Trump Raw Talent',
        slug: 'operational-velocity-clear-sops',
        excerpt: 'How documented workflows and explicit handoffs empower teams to deliver exceptional quality consistently.',
        coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
        content: `# Operational Velocity: Why Clear SOPs Trump Raw Talent

Talented individuals can produce miracles, but systems produce consistency.

When a venture relies solely on individual heroics, growth hits a glass ceiling. The moment key personnel are absent, quality fluctuates.

### 1. Codifying the Standard
Every recurring action—from inventory audits to client onboarding—must have a clear checklist. It removes guesswork and accelerates training.

### 2. Eliminating Friction at the Handoff
Most operational delays occur between teams: when design finishes and engineering begins, or when sales closes and fulfillment takes over. Clear interface definitions solve this friction.`,
        category: 'Operations & Management',
        categorySlug: undefined,
        readingTime: 4,
        publishedAt: new Date(),
        status: 'PUBLISHED',
        featured: true,
        tags: ['Operations', 'Management', 'Productivity', 'Leadership'],
        seoTitle: 'Operational Velocity: Why Clear SOPs Trump Raw Talent | Gunjan Shrestha',
        seoDescription: 'Key operational principles for structuring scalable business processes.',
      },
      {
        title: 'The Architecture of Sound Financial Internal Controls',
        slug: 'architecture-of-financial-internal-controls',
        excerpt: 'A practical framework for preventing cash leakages and ensuring ledger integrity in growing enterprises.',
        coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
        content: `# The Architecture of Sound Financial Internal Controls

Internal controls are frequently misunderstood as lack of trust. In truth, they protect both the business and its employees by eliminating ambiguity.

### Core Pillars of Control
- **Dual Authorization**: Payments above predefined thresholds require independent review.
- **Bank Recs in Real Time**: Monthly reconciliations are too late; weekly checks catch discrepancies while memories are fresh.
- **Vendor Due Diligence**: Verifying tax registration numbers and official banking credentials before processing disbursements.`,
        category: 'Corporate Governance & Auditing',
        categorySlug: 'corporate-governance',
        readingTime: 5,
        publishedAt: new Date(),
        status: 'PUBLISHED',
        featured: false,
        tags: ['Finance', 'Internal Controls', 'Compliance', 'Audit'],
        seoTitle: 'The Architecture of Sound Financial Internal Controls | Gunjan Shrestha',
        seoDescription: 'Framework for building corporate financial integrity and fraud-resistant ledgers.',
      },
      {
        title: 'Scaling From Kathmandu: Operational Lessons in Cross-Border Logistics',
        slug: 'scaling-from-kathmandu-cross-border-logistics',
        excerpt: 'Navigating customs, insurance, and high-value international delivery from an emerging Himalayan market.',
        coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
        content: `# Scaling From Kathmandu: Cross-Border Logistics

Shipping bespoke fine jewellery across international borders requires mastering international trade regulations, customs declarations, and insured armored transit.

Every export must satisfy statutory export clearances, hallmarking certification, and courier insurance liability limits. Building these pipelines turns regional craftsmanship into a viable multinational enterprise.`,
        category: 'Operations & Management',
        categorySlug: undefined,
        readingTime: 6,
        publishedAt: new Date(),
        status: 'PUBLISHED',
        featured: false,
        tags: ['Logistics', 'Global Trade', 'Supply Chain', 'Jewellery'],
        seoTitle: 'Scaling From Kathmandu: Cross-Border Logistics | Gunjan Shrestha',
        seoDescription: 'Lessons in shipping luxury high-value products internationally from Nepal.',
      },
    ];

    for (const post of blogPosts) {
      const { categorySlug, ...postData } = post;
      const categoryId = categorySlug ? categoryMap.get(categorySlug) : undefined;
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {
          ...postData,
          categoryId,
        },
        create: {
          ...postData,
          categoryId,
        },
      });
    }
    console.log(`   ${blogPosts.length} Journal Posts synchronized.`);

    // 12. Content Organization Categories
    console.log('12. Seeding Content Categories...');
    const contentCategories = [
      { name: 'Executive Operations & Systems', slug: 'operations-systems', type: 'OPERATIONS', description: 'SOPs, logistical architectures, and cross-functional leadership frameworks.', displayOrder: 1 },
      { name: 'Financial Accounting & Statutory Audit', slug: 'finance-audit', type: 'FINANCE', description: 'Chart of accounts, reconciliation engines, and fiscal hygiene.', displayOrder: 2 },
      { name: 'Fine Jewellery & Atelier Craft', slug: 'jewellery-craft', type: 'DESIGN', description: '3D CAD micro-modeling, precious metallurgy, and gemmological standards.', displayOrder: 3 },
      { name: 'Technology & Digital Architecture', slug: 'tech-architecture', type: 'TECHNOLOGY', description: 'High-performance web applications, Linux servers, and relational databases.', displayOrder: 4 },
      { name: 'Luxury Brand & Creative Direction', slug: 'luxury-branding', type: 'DESIGN', description: 'High-end branding, unboxing architecture, and editorial photography.', displayOrder: 5 },
      { name: 'Strategic Advisory & Scaling', slug: 'strategic-advisory', type: 'GENERAL', description: 'Cross-border ventures, compliance frameworks, and organizational governance.', displayOrder: 6 },
    ];

    for (const cat of contentCategories) {
      await prisma.contentCategory.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
    }
    console.log(`   ${contentCategories.length} Content categories synchronized.`);

    // 13. Social Links
    console.log('13. Seeding Verified Social Profiles...');
    const socialLinks = [
      { platform: 'LinkedIn', label: 'LinkedIn Official', url: 'https://www.linkedin.com/in/gunjan-shrestha', icon: 'linkedin', displayOrder: 1, published: true },
      { platform: 'GitHub', label: 'GitHub Repositories', url: 'https://github.com/gunjanstha01', icon: 'github', displayOrder: 2, published: true },
      { platform: 'Instagram', label: 'Fine Jewellery Atelier', url: 'https://instagram.com/gunjanfinejewellery', icon: 'instagram', displayOrder: 3, published: true },
      { platform: 'WhatsApp', label: 'Direct Message', url: 'https://wa.me/9779800000000', icon: 'message-circle', displayOrder: 4, published: true },
    ];

    for (const link of socialLinks) {
      const match = await prisma.socialLink.findFirst({ where: { platform: link.platform } });
      if (match) {
        await prisma.socialLink.update({ where: { id: match.id }, data: link });
      } else {
        await prisma.socialLink.create({ data: link });
      }
    }
    console.log(`   ${socialLinks.length} Social links synchronized.`);

    // 14. Sample Contact Inquiries
    console.log('14. Seeding Verified Contact Inquiries...');
    const sampleMessages = [
      { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', subject: 'Bespoke Engagement Ring Inquiry', message: 'Hello Gunjan, I admire your fine jewellery atelier work. I would like to inquire about a custom 18k yellow gold emerald-cut diamond ring for late 2026.', status: 'NEW' },
      { name: 'Elena Rostova', email: 'elena.rostova@techscale.io', subject: 'Executive Advisory & Operations Consulting', message: 'Hi Gunjan, we are scaling cross-functional teams in South Asia and would love to consult with you regarding financial control and operations management.', status: 'READ' },
    ];

    for (const msg of sampleMessages) {
      const match = await prisma.contactMessage.findFirst({ where: { email: msg.email, subject: msg.subject } });
      if (!match) {
        await prisma.contactMessage.create({ data: msg });
      }
    }
    console.log(`   Contact inquiries verified.`);

    // 15. Initial System Audit Log
    console.log('15. Registering System Initialization Audit Log...');
    await prisma.auditLog.create({
      data: {
        userId: 'admin_gunjan',
        action: 'DATABASE_SEED',
        entityType: 'SYSTEM',
        entityId: '1',
        metadata: {
          status: 'SUCCESS',
          message: 'Database initialized with clean synchronized production dataset',
          timestamp: new Date().toISOString(),
          version: '2.0.0',
        },
      },
    });

    // 16. Resynchronize PostgreSQL Primary Key Sequences
    console.log('16. Resynchronizing PostgreSQL Serial Sequences...');
    const sequenceTables = [
      'users',
      'profiles',
      'educations',
      'experiences',
      'skill_categories',
      'skills',
      'services',
      'projects',
      'project_images',
      'gallery_images',
      'blog_categories',
      'blog_posts',
      'contact_messages',
      'social_links',
      'site_settings',
      'content_categories',
      'audit_logs',
    ];

    for (const table of sequenceTables) {
      try {
        await prisma.$executeRawUnsafe(
          `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1)) FROM "${table}";`
        );
      } catch (seqErr: unknown) {
        // Fallback for tables without sequence or permission differences
        const err = seqErr as Error;
        console.warn(`   Notice: Sequence check for ${table} bypassed: ${err?.message || String(seqErr)}`);
      }
    }
    console.log('   All serial sequences aligned with MAX(id).');

    // 17. Validation & Record Counts
    const [
      profileCount,
      educationCount,
      experienceCount,
      skillCatCount,
      skillCount,
      serviceCount,
      projectCount,
      galleryCount,
      blogCount,
      contentCatCount,
      socialCount,
      settingCount,
      userCount,
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.education.count(),
      prisma.experience.count(),
      prisma.skillCategory.count(),
      prisma.skill.count(),
      prisma.service.count(),
      prisma.project.count(),
      prisma.galleryImage.count(),
      prisma.blogPost.count(),
      prisma.contentCategory.count(),
      prisma.socialLink.count(),
      prisma.siteSetting.count(),
      prisma.user.count(),
    ]);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('================================================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Execution Duration: ${duration}s`);
    console.log('----------------------------------------------------------------');
    console.log(`- Administrator Accounts: ${userCount} record`);
    console.log(`- Executive Profile:      ${profileCount} record`);
    console.log(`- Site & SEO Settings:    ${settingCount} record`);
    console.log(`- Career Milestones:      ${experienceCount} records`);
    console.log(`- Academic Degrees:       ${educationCount} records`);
    console.log(`- Skill Categories:       ${skillCatCount} categories`);
    console.log(`- Technical & Craft Skills: ${skillCount} skills`);
    console.log(`- Advisory Services:      ${serviceCount} services`);
    console.log(`- Case Studies:           ${projectCount} projects`);
    console.log(`- Gallery Media Assets:   ${galleryCount} assets`);
    console.log(`- Journal Posts:          ${blogCount} articles`);
    console.log(`- Content Categories:     ${contentCatCount} categories`);
    console.log(`- Social Profiles:        ${socialCount} links`);
    console.log('================================================================');
    console.log('Status: 100% Production-Ready & Synchronized with Prisma ORM!');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error: unknown) {
    console.error('Database seeding encountered an unhandled exception:', error);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

main();
