import QRCode from 'qrcode';
import { Profile, SiteSetting, SocialLink, Project, BlogPost } from '../types';

export interface SeoCheckItem {
  id: string;
  label: string;
  category: 'Critical' | 'Recommended' | 'Optimal';
  passed: boolean;
  tip: string;
  currentValue?: string;
}

export interface SeoAuditReport {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'Needs Improvement';
  summary: string;
  checklist: SeoCheckItem[];
}

/**
 * Generate XML Sitemap string
 */
export function generateSitemapXml(
  baseUrl: string,
  projects: Project[],
  posts: BlogPost[]
): string {
  const cleanBase = (baseUrl || 'https://gunjan.dev').replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const coreRoutes = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.9', changefreq: 'monthly' },
    { path: '/experience', priority: '0.9', changefreq: 'monthly' },
    { path: '/academic', priority: '0.8', changefreq: 'monthly' },
    { path: '/skills', priority: '0.9', changefreq: 'monthly' },
    { path: '/services', priority: '0.9', changefreq: 'monthly' },
    { path: '/work', priority: '0.9', changefreq: 'weekly' },
    { path: '/writing', priority: '0.9', changefreq: 'weekly' },
    { path: '/gallery', priority: '0.7', changefreq: 'weekly' },
    { path: '/contact', priority: '0.8', changefreq: 'monthly' },
    { path: '/resume', priority: '0.8', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Core routes
  coreRoutes.forEach(route => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}${route.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Published Case Studies
  projects.filter(p => p.published).forEach(project => {
    const lastMod = project.updatedAt ? project.updatedAt.split('T')[0] : today;
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}/work/${project.slug}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // Published Journal Posts
  posts.filter(p => p.status === 'PUBLISHED').forEach(post => {
    const lastMod = post.updatedAt ? post.updatedAt.split('T')[0] : today;
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}/writing/${post.slug}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

/**
 * Generate robots.txt string
 */
export function generateRobotsTxt(baseUrl: string, allowIndexing: boolean = true): string {
  const cleanBase = (baseUrl || 'https://gunjan.dev').replace(/\/+$/, '');

  if (!allowIndexing) {
    return `# Robots.txt for Gunjan Shrestha Portfolio\n# SEARCH INDEXING: DISABLED (Private / Staging Mode)\nUser-agent: *\nDisallow: /\n`;
  }

  return `# Robots.txt for Gunjan Shrestha Portfolio\n# SEARCH INDEXING: ENABLED\nUser-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin-login\n\n# Canonical Sitemap\nSitemap: ${cleanBase}/sitemap.xml\n`;
}

/**
 * Generate Schema.org JSON-LD structured data
 */
export function generateStructuredData(
  profile: Profile,
  siteSettings: SiteSetting,
  socialLinks: SocialLink[]
): object {
  const cleanBase = (siteSettings.canonicalUrl || 'https://gunjan.dev').replace(/\/+$/, '');
  const activeSocials = socialLinks
    .filter(s => s.published && s.url && s.url.startsWith('http'))
    .map(s => s.url);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${cleanBase}/#person`,
        name: profile.name || siteSettings.siteName || 'Gunjan Shrestha',
        jobTitle: profile.headline || 'Technology × Design × Business Operations',
        description: profile.shortBio || siteSettings.siteDescription,
        url: cleanBase,
        image: profile.profileImageUrl || siteSettings.profileImageUrl,
        email: profile.email || siteSettings.email,
        telephone: profile.phone || siteSettings.phone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: profile.location || siteSettings.location || 'Kathmandu, Nepal',
          addressCountry: 'NP',
        },
        sameAs: activeSocials,
      },
      {
        '@type': 'WebSite',
        '@id': `${cleanBase}/#website`,
        url: cleanBase,
        name: siteSettings.siteName || 'Gunjan Shrestha',
        description: siteSettings.siteDescription,
        publisher: {
          '@id': `${cleanBase}/#person`,
        },
        inLanguage: 'en-US',
      },
    ],
  };
}

/**
 * Perform an automated SEO Health Audit
 */
export function calculateSeoHealth(
  siteSettings: SiteSetting,
  profile: Profile,
  socialLinks: SocialLink[]
): SeoAuditReport {
  const checklist: SeoCheckItem[] = [];

  // 1. Title Length
  const titleLen = (siteSettings.defaultSeoTitle || '').length;
  const isTitleGood = titleLen >= 35 && titleLen <= 65;
  checklist.push({
    id: 'title-length',
    label: 'Meta Title Length (35–65 characters)',
    category: 'Critical',
    passed: isTitleGood,
    tip: `Current length: ${titleLen} characters. Optimal SERP length is 40–60 characters to avoid search truncation.`,
    currentValue: `${titleLen} chars`,
  });

  // 2. Meta Description Length
  const descLen = (siteSettings.siteDescription || siteSettings.defaultSeoDescription || '').length;
  const isDescGood = descLen >= 110 && descLen <= 170;
  checklist.push({
    id: 'desc-length',
    label: 'Meta Description Length (110–170 characters)',
    category: 'Critical',
    passed: isDescGood,
    tip: `Current length: ${descLen} characters. Google search snippets show ~120–160 characters before clipping.`,
    currentValue: `${descLen} chars`,
  });

  // 3. Canonical URL
  const canon = siteSettings.canonicalUrl || '';
  const isCanonValid = canon.startsWith('http://') || canon.startsWith('https://');
  checklist.push({
    id: 'canonical-url',
    label: 'Canonical Website Domain Configured',
    category: 'Critical',
    passed: isCanonValid,
    tip: isCanonValid ? `Domain configured as: ${canon}` : 'Specify your production domain with https:// to prevent duplicate content penalties.',
    currentValue: canon || 'Not set',
  });

  // 4. OpenGraph Social Share Card Image
  const ogImg = siteSettings.defaultOgImageUrl || '';
  const isOgGood = ogImg.length > 10 && ogImg.startsWith('http');
  checklist.push({
    id: 'og-image',
    label: 'Social Share (OpenGraph) Card Image',
    category: 'Critical',
    passed: isOgGood,
    tip: isOgGood ? 'OpenGraph image is configured for LinkedIn, WhatsApp & Twitter/X.' : 'Upload an eye-catching 1200x630 banner for social shares.',
    currentValue: isOgGood ? 'Configured' : 'Missing',
  });

  // 5. Personal Brand Logo
  const logo = siteSettings.logoUrl || '';
  const isLogoSet = logo.length > 5;
  checklist.push({
    id: 'brand-logo',
    label: 'Custom Brand Logo Mark',
    category: 'Recommended',
    passed: isLogoSet,
    tip: isLogoSet ? 'Custom brand logo configured for header & footer.' : 'Upload a brand signature mark or logo for stronger visual identity.',
    currentValue: isLogoSet ? 'Uploaded' : 'Default text fallback',
  });

  // 6. Keywords / Taxonomy Tags
  const keywords = (siteSettings.seoKeywords || '').split(',').map(k => k.trim()).filter(Boolean);
  const isKeywordsSet = keywords.length >= 3;
  checklist.push({
    id: 'seo-keywords',
    label: 'Primary Domain Keywords (At least 3 tags)',
    category: 'Recommended',
    passed: isKeywordsSet,
    tip: `Identified ${keywords.length} keywords. Helps categorize your platform across key disciplines.`,
    currentValue: `${keywords.length} keywords`,
  });

  // 7. Social Links Network
  const publishedSocials = socialLinks.filter(s => s.published && s.url);
  const isSocialsGood = publishedSocials.length >= 2;
  checklist.push({
    id: 'social-profiles',
    label: 'Active Social & Professional Links (Min 2)',
    category: 'Recommended',
    passed: isSocialsGood,
    tip: `Connected ${publishedSocials.length} published profiles. These are linked in Google Schema.org sameAs knowledge graphs.`,
    currentValue: `${publishedSocials.length} profiles`,
  });

  // 8. Search Indexing Status
  const isIndexingAllowed = siteSettings.allowIndexing !== false;
  checklist.push({
    id: 'indexing-status',
    label: 'Search Engine Indexing Enabled (Robots.txt)',
    category: 'Critical',
    passed: isIndexingAllowed,
    tip: isIndexingAllowed ? 'Google and Bing web crawlers are allowed to index public pages.' : 'Indexing is currently set to NOINDEX (Private Mode).',
    currentValue: isIndexingAllowed ? 'Allow: /' : 'Disallow: / (Private)',
  });

  // 9. Profile Location and Bio Completeness
  const isProfileComplete = Boolean(profile.name && profile.headline && profile.location);
  checklist.push({
    id: 'profile-schema',
    label: 'Structured Author Data (Name, Role, Location)',
    category: 'Optimal',
    passed: isProfileComplete,
    tip: isProfileComplete ? 'Knowledge graph Person metadata is populated.' : 'Ensure profile name, role, and location are fully specified.',
    currentValue: isProfileComplete ? 'Complete' : 'Incomplete',
  });

  // Calculate score
  const total = checklist.length;
  const passed = checklist.filter(c => c.passed).length;
  const score = Math.round((passed / total) * 100);

  let grade: SeoAuditReport['grade'] = 'Needs Improvement';
  let summary = 'Essential SEO signals are missing. Address critical items below.';

  if (score >= 90) {
    grade = 'A+';
    summary = 'Outstanding! Your search metadata, social sharing cards, and structured schema are optimized.';
  } else if (score >= 75) {
    grade = 'A';
    summary = 'Great SEO health. Fine-tune recommended fields to reach full search optimization.';
  } else if (score >= 60) {
    grade = 'B';
    summary = 'Good baseline, but key social sharing or canonical tags need attention.';
  }

  return {
    score,
    grade,
    summary,
    checklist,
  };
}

/**
 * Generate high-res QR code as Data URL
 */
export async function generateQrCodeDataUrl(
  text: string,
  options?: {
    theme?: 'gold' | 'classic' | 'whiteOnDark' | 'monochrome';
    width?: number;
  }
): Promise<string> {
  const width = options?.width || 512;
  const theme = options?.theme || 'gold';

  let darkColor = '#c6a87d';
  let lightColor = '#080808';

  if (theme === 'classic') {
    darkColor = '#080808';
    lightColor = '#ffffff';
  } else if (theme === 'whiteOnDark') {
    darkColor = '#f5f5f5';
    lightColor = '#111111';
  } else if (theme === 'monochrome') {
    darkColor = '#262626';
    lightColor = '#f5f5f5';
  }

  try {
    return await QRCode.toDataURL(text, {
      width,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    throw err;
  }
}

/**
 * Helper to download an image Data URL
 */
export function downloadDataUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Helper to download arbitrary text content (e.g. sitemap.xml, robots.txt, vcf)
 */
export function downloadTextFile(content: string, fileName: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate vCard 3.0 string for digital contact card sharing
 */
export function generateVCard(profile: Profile, siteSettings: SiteSetting): string {
  const name = profile.name || siteSettings.siteName || 'Gunjan Shrestha';
  const email = profile.email || siteSettings.email || 'gunjanstha01@gmail.com';
  const alternateEmail = profile.alternateEmail || '';
  const phone = profile.phone || siteSettings.phone || '';
  const secondaryPhone = profile.secondaryPhone || '';
  const url = siteSettings.canonicalUrl || 'https://gunjan.dev';
  const title = profile.headline || 'Multidisciplinary Founder & Operator';
  const location = profile.location || siteSettings.location || 'Kathmandu, Nepal';

  const notes = [
    profile.shortBio || siteSettings.siteDescription,
  ].filter(Boolean).join(' | ');

  // vCard format RFC 2426
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `N:Shrestha;Gunjan;;;`,
    `TITLE:${title}`,
    `ORG:Gunjan Shrestha Enterprises`,
    `EMAIL;TYPE=INTERNET,PREF:${email}`,
    alternateEmail ? `EMAIL;TYPE=INTERNET,WORK:${alternateEmail}` : '',
    phone ? `TEL;TYPE=CELL,VOICE,PREF:${phone}` : '',
    secondaryPhone ? `TEL;TYPE=WORK,VOICE:${secondaryPhone}` : '',
    `URL:${url}`,
    `ADR;TYPE=WORK:;;${location};;;Nepal`,
    notes ? `NOTE:${notes}` : '',
    'END:VCARD',
  ].filter(Boolean).join('\r\n');
}

/**
 * Download vCard file directly in browser (.vcf)
 */
export function downloadVCardFile(profile: Profile, siteSettings: SiteSetting): void {
  const vCardContent = generateVCard(profile, siteSettings);
  const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = (profile.name || 'Gunjan_Shrestha').replace(/\s+/g, '_');
  link.href = url;
  link.download = `${safeName}_Contact.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download Visiting Card Image file directly in browser (PNG, JPG, JPEG)
 */
export async function downloadVisitingCardImage(imageUrl: string, personName: string = 'Gunjan Shrestha'): Promise<void> {
  if (!imageUrl) return;
  const safeName = personName.replace(/[^a-zA-Z0-9]+/g, '_');

  let ext = 'png';
  if (imageUrl.includes('.jpg') || imageUrl.includes('.jpeg')) ext = 'jpg';
  else if (imageUrl.includes('.webp')) ext = 'webp';
  else if (imageUrl.includes('.png')) ext = 'png';
  else if (imageUrl.startsWith('data:image/jpeg')) ext = 'jpg';
  else if (imageUrl.startsWith('data:image/png')) ext = 'png';

  const filename = `${safeName}_Visiting_Card.${ext}`;

  // If already data URL
  if (imageUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Fetch as blob to ensure browser download prompt
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      return;
    }
  } catch (e) {
    // Fallback if CORS prevents blob fetch
  }

  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
