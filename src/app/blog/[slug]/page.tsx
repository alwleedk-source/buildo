import { Metadata } from 'next';
import { BlogArticlePage } from '@/components/pages/blogarticle-page';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    // Fetch article from database
    const [article] = await db
      .select()
      .from(blogArticles)
      .where(or(eq(blogArticles.slugNl, slug), eq(blogArticles.slugEn, slug)))
      .limit(1);

    if (!article) {
      return {
        title: 'Article Not Found - BouwMeesters Amsterdam',
        description: 'The article you are looking for does not exist.',
      };
    }

    // Use Dutch as default, fallback to English
    const title = article.titleNl || article.titleEn || 'Blog Article';
    const description = article.excerptNl || article.excerptEn || '';
    const image = article.image || '';

    return {
      title: `${title} - BouwMeesters Amsterdam`,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: image ? [{ url: image, alt: article.imageAlt || title }] : [],
        type: 'article',
        publishedTime: article.publishedAt?.toISOString(),
        authors: ['BouwMeesters Amsterdam'],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: image ? [image] : [],
      },
      // Add preconnect for external images
      other: image && image.includes('unsplash.com') ? {
        'link': '<https://images.unsplash.com>; rel=preconnect; crossorigin',
      } : undefined,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Article - BouwMeesters Amsterdam',
      description: 'Blog Article - BouwMeesters Amsterdam page',
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch article for preload
  const [article] = await db
    .select()
    .from(blogArticles)
    .where(or(eq(blogArticles.slugNl, slug), eq(blogArticles.slugEn, slug)))
    .limit(1);
  
  return (
    <>
      {article?.image && article.image.includes('unsplash.com') && (
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      )}
      <BlogArticlePage />
    </>
  );
}
