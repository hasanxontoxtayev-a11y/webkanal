import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/request';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tubepilotpro.com';
  const currentDate = new Date();

  const publicRoutes = ['', '/pricing'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Localized URLs for all public pages
  for (const route of publicRoutes) {
    for (const locale of locales) {
      const isHome = route === '';
      const priority = isHome ? 1.0 : 0.8;
      const changeFrequency = isHome ? 'daily' : 'weekly';

      const alternatesLanguages: Record<string, string> = {};
      for (const l of locales) {
        alternatesLanguages[l] = `${baseUrl}/${l}${route}`;
      }
      alternatesLanguages['x-default'] = `${baseUrl}/en${route}`;

      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency,
        priority,
        alternates: {
          languages: alternatesLanguages,
        },
      });
    }
  }

  return sitemapEntries;
}
