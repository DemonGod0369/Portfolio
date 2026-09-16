import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { generateStructuredData } from '../../utils/seoAndQrUtils';

export const DynamicSEO: React.FC = () => {
  const {
    currentRoute,
    selectedProjectSlug,
    selectedBlogSlug,
    siteSettings,
    profile,
    projects,
    blogPosts,
    socialLinks,
  } = useData();

  useEffect(() => {
    const siteName = siteSettings.siteName || 'Gunjan Shrestha';
    const baseUrl = (siteSettings.canonicalUrl || 'https://gunjan.dev').replace(/\/+$/, '');

    let title = siteSettings.defaultSeoTitle || `${siteName} — Technology, Design & Business`;
    let description = siteSettings.defaultSeoDescription || siteSettings.siteDescription || 'Personal digital identity platform of Gunjan Shrestha.';
    let ogImage = siteSettings.defaultOgImageUrl || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop';
    let canonical = `${baseUrl}/`;

    // Dynamic per-route titles & descriptions
    switch (currentRoute) {
      case 'home':
        title = siteSettings.defaultSeoTitle || `${siteName} — Technology, Design & Business`;
        canonical = `${baseUrl}/`;
        break;
      case 'about':
        title = `About & Philosophy — ${siteName}`;
        description = profile.shortBio || `Learn about Gunjan Shrestha's background across technology, design, and business operations.`;
        canonical = `${baseUrl}/about`;
        break;
      case 'experience':
        title = `Executive Timeline & Milestones — ${siteName}`;
        description = `Chronological timeline of operations, venture founding, and creative direction led by Gunjan Shrestha.`;
        canonical = `${baseUrl}/experience`;
        break;
      case 'academic':
        title = `Academic Qualifications — ${siteName}`;
        description = `Degrees, credentials, and formal qualifications of Gunjan Shrestha.`;
        canonical = `${baseUrl}/academic`;
        break;
      case 'skills':
        title = `Competencies & Technology Matrix — ${siteName}`;
        description = `Comprehensive skill proficiencies across software development, operational workflows, and UI/UX design.`;
        canonical = `${baseUrl}/skills`;
        break;
      case 'services':
        title = `Services & Advisory Offerings — ${siteName}`;
        description = `Consulting, system architecture, operational digitization, and design services offered by Gunjan Shrestha.`;
        canonical = `${baseUrl}/services`;
        break;
      case 'work':
        title = `Case Studies & Portfolio Archive — ${siteName}`;
        description = `In-depth case studies on system architecture, retail digitization, and applied software engineering.`;
        canonical = `${baseUrl}/work`;
        break;
      case 'work-detail': {
        const project = projects.find(p => p.slug === selectedProjectSlug) || projects[0];
        if (project) {
          title = project.seoTitle || `${project.title} — Case Study | ${siteName}`;
          description = project.seoDescription || project.shortSummary || description;
          if (project.heroImage) ogImage = project.heroImage;
          canonical = `${baseUrl}/work/${project.slug}`;
        }
        break;
      }
      case 'blog':
        title = `Journal & Systems Writing — ${siteName}`;
        description = `Essays and field notes on system thinking, business operations, and software craftsmanship.`;
        canonical = `${baseUrl}/writing`;
        break;
      case 'blog-detail': {
        const post = blogPosts.find(p => p.slug === selectedBlogSlug) || blogPosts[0];
        if (post) {
          title = post.seoTitle || `${post.title} — Journal | ${siteName}`;
          description = post.seoDescription || post.excerpt || description;
          if (post.coverImageUrl) ogImage = post.coverImageUrl;
          canonical = `${baseUrl}/writing/${post.slug}`;
        }
        break;
      }
      case 'gallery':
        title = `Visual Media & Captured Moments — ${siteName}`;
        description = `Photography, design artifacts, and visual moments captured by Gunjan Shrestha.`;
        canonical = `${baseUrl}/gallery`;
        break;
      case 'contact':
        title = `Connect & Inquiries — ${siteName}`;
        description = `Direct contact channel for consulting inquiries, business collaborations, or discussions with Gunjan Shrestha.`;
        canonical = `${baseUrl}/contact`;
        break;
      case 'resume':
        title = `Curriculum Vitae — ${siteName}`;
        description = `Professional resume and executive career summary for Gunjan Shrestha.`;
        canonical = `${baseUrl}/resume`;
        break;
      case 'admin':
      case 'admin-login':
        title = `Admin CMS Control — ${siteName}`;
        break;
      default:
        break;
    }

    // Update document title
    document.title = title;

    // Helper to safely set meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard Meta
    setMeta('description', description);
    if (siteSettings.seoKeywords) {
      setMeta('keywords', siteSettings.seoKeywords);
    }

    // Robots Indexing
    const allowIndexing = siteSettings.allowIndexing !== false;
    setMeta('robots', allowIndexing ? 'index, follow' : 'noindex, nofollow');

    // OpenGraph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:url', canonical, true);
    setMeta('og:type', currentRoute === 'blog-detail' ? 'article' : 'website', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // Google Site Verification
    if (siteSettings.googleSiteVerification) {
      setMeta('google-site-verification', siteSettings.googleSiteVerification);
    }

    // Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Structured Data (JSON-LD)
    try {
      const schemaData = generateStructuredData(profile, siteSettings, socialLinks);
      let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'schema-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData, null, 2);
    } catch (e) {
      console.warn('Failed to inject JSON-LD schema:', e);
    }
  }, [
    currentRoute,
    selectedProjectSlug,
    selectedBlogSlug,
    siteSettings,
    profile,
    projects,
    blogPosts,
    socialLinks,
  ]);

  return null;
};
