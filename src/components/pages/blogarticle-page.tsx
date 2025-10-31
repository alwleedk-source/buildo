'use client';
import { useSEO } from '@/hooks/useSEO';

import { useQuery } from "@tanstack/react-query";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChevronRight, CalendarIcon, User, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BlogArticle } from '@/lib/db/schema';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function BlogArticlePage() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const currentLang = i18n.language;

  const { data: article, isLoading, error } = useQuery<BlogArticle>({
    queryKey: ['/api/blog', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        throw new Error('Failed to fetch article');
      }
      return response.json();
    },
    enabled: !!slug
  });

  // Advanced SEO optimization with JSON-LD NewsArticle schema
  const createNewsArticleSchema = (article: BlogArticle) => {
    const baseUrl = window.location.origin;
    const articleUrl = `${baseUrl}/blog/${article.slugNl}`;
    
    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.titleNl,
      "alternativeHeadline": article.excerptNl,
      "description": article.metaDescriptionNl || article.excerptNl,
      "articleBody": article.contentNl,
      "url": articleUrl,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl
      },
      "image": {
        "@type": "ImageObject",
        "url": article.image || article.ogImage,
        "width": 1200,
        "height": 630,
        "caption": article.imageAlt || article.titleNl
      },
      "datePublished": article.publishedAt || article.createdAt,
      "dateModified": article.updatedAt,
      "author": {
        "@type": "Organization",
        "name": "BuildIt Professional",
        "url": baseUrl
      },
      "publisher": {
        "@type": "Organization",
        "name": "BuildIt Professional",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 200,
          "height": 60
        }
      },
      "articleSection": article.categoryNl,
      "keywords": article.keywordsNl || (article.tagsNl && article.tagsNl.join(", ")),
      "wordCount": article.contentNl?.length || 0,
      "timeRequired": article.readingTime ? `PT${article.readingTime}M` : undefined,
      "inLanguage": "nl-NL",
      "genre": "construction, architecture, building"
    };
  };

  useSEO({
    title: article?.titleNl ? `${article.titleNl} | BuildIt Professional` : 'Artikel laden...',
    description: article?.metaDescriptionNl || article?.excerptNl || 'Lees meer over dit interessante artikel op onze blog.',
    keywords: article?.keywordsNl || (article?.tagsNl && article.tagsNl.join(", ")) || (article?.categoryNl ? `${article.categoryNl}, bouw, constructie` : 'bouw, constructie, artikelen'),
    image: article?.ogImage || article?.image || undefined,
    type: 'article',
    url: article?.canonicalUrl || `${window.location.origin}/blog/${article?.slugNl}`,
    structuredData: article ? createNewsArticleSchema(article) : undefined
  });

  const formatDate = (date: Date | string) => {
    const locale = currentLang === 'en' ? 'en-US' : 'nl-NL';
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumb Skeleton */}
        <div className="border-b bg-muted/50">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-6 w-64" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-3/4 mb-6" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="w-full h-64 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            {currentLang === 'en' ? 'Article not found' : 'Artikel niet gevonden'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {currentLang === 'en' 
              ? 'The article you are looking for does not exist or has been removed.'
              : 'Het artikel dat u zoekt bestaat niet of is verwijderd.'
            }
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentLang === 'en' ? 'Back to Blog' : 'Terug naar Blog'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Navigation breadcrumb */}
      <div className="border-b bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" data-testid="breadcrumb-home">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                Home
              </Button>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" data-testid="breadcrumb-blog">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                Blog
              </Button>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium line-clamp-1">
              {currentLang === 'en' ? (article.titleEn || article.titleNl) : article.titleNl}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 -ml-4" data-testid="button-back-to-blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentLang === 'en' ? 'Back to Blog' : 'Terug naar Blog'}
            </Button>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight" data-testid="article-title">
              {currentLang === 'en' ? (article.titleEn || article.titleNl) : article.titleNl}
            </h1>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6" data-testid="article-meta">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <time dateTime={article.publishedAt?.toString() || article.createdAt?.toString() || ''}>
                  {formatDate(article.publishedAt || article.createdAt || new Date())}
                </time>
              </div>
              
              {(currentLang === 'en' ? article.categoryEn || article.categoryNl : article.categoryNl) && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {currentLang === 'en' ? article.categoryEn || article.categoryNl : article.categoryNl}
                  </span>
                </div>
              )}
            </div>

            {/* Article Excerpt */}
            {(currentLang === 'en' ? article.excerptEn || article.excerptNl : article.excerptNl) && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="article-excerpt">
                {currentLang === 'en' ? article.excerptEn || article.excerptNl : article.excerptNl}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {article.image && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg" data-testid="article-image">
              <img
                src={article.image}
                alt={article.imageAlt || `${article.titleNl} - Gedetailleerd artikel over ${article.categoryNl || 'bouwen'} | BuildIt Professional`}
                className="w-full h-auto max-h-96 object-cover"
                loading="lazy"
                itemProp="image"
              />
              {article.imageAlt && (
                <figcaption className="text-sm text-muted-foreground text-center py-2 px-4 bg-muted/30">
                  {article.imageAlt}
                </figcaption>
              )}
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none" data-testid="article-content">
            <div 
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: currentLang === 'en' 
                  ? (article.contentEn || article.contentNl) 
                  : article.contentNl 
              }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-muted">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {article.updatedAt && article.updatedAt !== article.createdAt && (
                  <p>
                    {currentLang === 'en' ? 'Last updated: ' : 'Laatst bijgewerkt: '}
                    {formatDate(article.updatedAt)}
                  </p>
                )}
              </div>
              
              <Link href="/blog">
                <Button variant="outline" data-testid="button-more-articles">
                  {currentLang === 'en' ? 'More Articles' : 'Meer Artikelen'}
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </Link>
            </div>
          </footer>
        </div>
      </article>
      
      <Footer />
    </div>
  );
}