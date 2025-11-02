import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { blogArticles, services, projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildo-production-c8b4.up.railway.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Blog articles
  const articles = await db
    .select()
    .from(blogArticles)
    .where(eq(blogArticles.isPublished, true));

  const blogPages = articles.map(article => ({
    url: `${BASE_URL}/blog/${article.slugNl}`,
    lastModified: article.updatedAt || article.createdAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Services
  const servicesList = await db.select().from(services);
  const servicesPages = servicesList.map(service => ({
    url: `${BASE_URL}/services/${service.id}`,
    lastModified: service.updatedAt || service.createdAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Projects
  const projectsList = await db.select().from(projects);
  const projectsPages = projectsList.map(project => ({
    url: `${BASE_URL}/projects/${project.id}`,
    lastModified: project.updatedAt || project.createdAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...servicesPages, ...projectsPages];
}
