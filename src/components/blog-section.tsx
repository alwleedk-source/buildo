'use client';

import { useQuery } from "@tanstack/react-query";
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogArticle } from '@/lib/db/schema';

interface BlogSettingsResponse {
  id: string | null;
  titleNl: string;
  titleEn: string;
  descriptionNl: string;
  descriptionEn: string;
  readMoreTextNl: string;
  readMoreTextEn: string;
  allArticlesButtonNl: string;
  allArticlesButtonEn: string;
  articlesPerRow: number;
  maxArticles: number;
  showDate: boolean;
  showCategory: boolean;
  showExcerpt: boolean;
  showReadMore: boolean;
  showAllArticlesButton: boolean;
  backgroundStyle: string;
  cardStyle: string;
  metaTitleNl: string;
  metaTitleEn: string;
  metaDescriptionNl: string;
  metaDescriptionEn: string;
}

export function BlogSection() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const { data: blogData, isLoading } = useQuery<{data: BlogArticle[], success: boolean}>({
    queryKey: ['/api/blog'],
    queryFn: async () => {
      const res = await fetch('/api/blog');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });
  
  const { data: settings, isLoading: settingsLoading } = useQuery<BlogSettingsResponse>({
    queryKey: ['/api/blog-settings'],
    queryFn: async () => {
      const res = await fetch('/api/blog-settings');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });
  
  const articles = blogData?.data || [];

  if (isLoading || settingsLoading) {
    return (
      <section className="py-20" data-testid="blog-section-loading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-lg">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const defaultArticles = [
    {
      id: '1',
      title: 'Sustainable Construction: Trends for 2024',
      excerpt: 'Discover the latest trends in sustainable construction and how this determines the future of the construction sector.',
      category: 'Sustainability',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      slug: 'sustainable-construction-trends-2024',
      content: '',
      isPublished: true,
      publishedAt: new Date('2025-09-16'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Renovation vs. New Construction: What to Choose?',
      excerpt: 'A practical guide to make decisions between renovating your current home or building from scratch.',
      category: 'Renovation',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      slug: 'renovation-vs-new-construction',
      content: '',
      isPublished: true,
      publishedAt: new Date('2025-09-16'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Project Update: Marina View Apartments',
      excerpt: 'A look behind the scenes of our prestigious Marina View project in Amsterdam Noord.',
      category: 'Projects',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      slug: 'marina-view-apartments-update',
      content: '',
      isPublished: true,
      publishedAt: new Date('2025-09-16'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const maxArticles = settings?.maxArticles || 3;
  const displayArticles = (Array.isArray(articles) && articles.length > 0) ? articles.slice(0, maxArticles) : [];

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  return (
    <section id="blog" className="py-20" data-testid="blog-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-blog-title">
            {currentLang === 'en' ? (settings?.titleEn || "Latest Insights") : (settings?.titleNl || "Laatste Inzichten")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-blog-subtitle">
            {currentLang === 'en' ? (settings?.descriptionEn || "Stay updated with the latest developments in the construction sector") : (settings?.descriptionNl || "Blijf op de hoogte van de laatste ontwikkelingen in de bouwsector")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <article
              key={article.id}
              className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              data-testid={`article-card-${article.id}`}
            >
              <Link href={`/blog/${currentLang === 'en' ? article.slugEn : article.slugNl}`}>
                <img
                  src={article.image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'}
                  alt={currentLang === 'en' ? article.titleEn : article.titleNl}
                  className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  data-testid={`article-image-${article.id}`}
                />
              </Link>
              <CardContent className="p-6">
                {(settings?.showDate !== false || settings?.showCategory !== false) && (
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    {settings?.showDate !== false && (
                      <span data-testid={`article-date-${article.id}`}>
                        {formatDate(article.publishedAt || article.createdAt!)}
                      </span>
                    )}
                    {settings?.showDate !== false && settings?.showCategory !== false && (
                      <span className="mx-2">•</span>
                    )}
                    {settings?.showCategory !== false && (
                      <span data-testid={`article-category-${article.id}`}>
                        {currentLang === 'en' ? article.categoryEn : article.categoryNl}
                      </span>
                    )}
                  </div>
                )}
                <Link href={`/blog/${currentLang === 'en' ? article.slugEn : article.slugNl}`}>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3 hover:text-primary transition-colors cursor-pointer" data-testid={`article-title-${article.id}`}>
                    {currentLang === 'en' ? article.titleEn : article.titleNl}
                  </h3>
                </Link>
                {settings?.showExcerpt !== false && (
                  <p className="text-muted-foreground mb-4" data-testid={`article-excerpt-${article.id}`}>
                    {currentLang === 'en' ? article.excerptEn : article.excerptNl}
                  </p>
                )}
                {settings?.showReadMore !== false && (
                  <Link href={`/blog/${currentLang === 'en' ? article.slugEn : article.slugNl}`}>
                    <button className="text-primary font-medium hover:text-primary/80 transition-colors" data-testid={`article-link-${article.id}`}>
                      {currentLang === 'en' ? (settings?.readMoreTextEn || "Read More") : (settings?.readMoreTextNl || "Lees Meer")} →
                    </button>
                  </Link>
                )}
              </CardContent>
            </article>
          ))}
        </div>
        {settings?.showAllArticlesButton !== false && (
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                data-testid="button-all-articles"
              >
                {currentLang === 'en' ? (settings?.allArticlesButtonEn || "All Articles") : (settings?.allArticlesButtonNl || "Alle Artikelen")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
