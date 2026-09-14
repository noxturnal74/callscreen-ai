import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const ROUTES: Array<{ path: string; priority: number }> = [
  { path: '/', priority: 1 },
  { path: '/dashboard', priority: 0.8 },
  { path: '/screening', priority: 0.8 },
  { path: '/candidates', priority: 0.6 },
  { path: '/jobs', priority: 0.6 },
  { path: '/settings', priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: r.priority,
  }));
}
