import { prisma } from '../connection.ts';
import { formatRow } from './common.ts';

export async function getSiteSettings() {
  const row = await prisma.siteSetting.findFirst();
  return row ? formatRow(row) : null;
}

export async function updateSiteSettings(data: any) {
  const existing = await prisma.siteSetting.findFirst();
  if (!existing) {
    const created = await prisma.siteSetting.create({
      data: {
        siteName: data.siteName || '',
        siteDescription: data.siteDescription ?? null,
        canonicalUrl: data.canonicalUrl ?? null,
        logoUrl: data.logoUrl ?? null,
        faviconUrl: data.faviconUrl ?? null,
        profileImageUrl: data.profileImageUrl ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        location: data.location ?? null,
        footerText: data.footerText ?? null,
        accentColor: data.accentColor ?? '#c6a87d',
        maintenanceMode: data.maintenanceMode ?? false,
        analyticsEnabled: data.analyticsEnabled ?? false,
        defaultSeoTitle: data.defaultSeoTitle ?? null,
        defaultSeoDescription: data.defaultSeoDescription ?? null,
        defaultOgImageUrl: data.defaultOgImageUrl ?? null,
        seoKeywords: data.seoKeywords ?? null,
        allowIndexing: data.allowIndexing ?? true,
        googleSiteVerification: data.googleSiteVerification ?? null,
        googleAnalyticsId: data.googleAnalyticsId ?? null,
        customHeadSnippet: data.customHeadSnippet ?? null,
      },
    });
    return formatRow(created);
  }

  const { id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
  const updated = await prisma.siteSetting.update({
    where: { id: existing.id },
    data: updateData,
  });
  return formatRow(updated);
}
