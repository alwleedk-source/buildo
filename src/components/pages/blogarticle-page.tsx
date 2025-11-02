'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Eye,
  Share2,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BlogArticle } from '@/lib/db/schema';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { useEffect, useRef } from 'react';

export function BlogArticlePage() {
  const { t, i18n } = useTranslation();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const currentLang = i18n.language;
  const isNl = currentLang === 'nl';
  const contentRef = useRef<HTMLDivElement>(null);

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
      const data = await response.json();
      return data.article || data;
    },
    enabled: !!slug
  });

  // Fetch related articles
  const { data: relatedArticles } = useQuery<BlogArticle[]>({
    queryKey: ['/api/blog/related', article?.id],
    queryFn: async () => {
      if (!article?.id) return [];
      const response = await fetch(`/api/blog/related?articleId=${article.id}&limit=3`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.articles || [];
    },
    enabled: !!article?.id
  });

  // Add IDs to headings for table of contents
  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          const text = heading.textContent || '';
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50) || `heading-${index}`;
          heading.id = id;
        }
      });
    }
  }, [article]);

  const formatDate = (date: Date | string) => {
    const locale = isNl ? 'nl-NL' : 'en-US';
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content: string | null | undefined) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article ? (isNl ? article.titleNl : article.titleEn || article.titleNl) : '';

  const shareOnSocial = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 mt-16">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 mt-16 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {isNl ? 'Artikel niet gevonden' : 'Article not found'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isNl 
              ? 'Het artikel dat je zoekt bestaat niet of is verwijderd.'
              : 'The article you are looking for does not exist or has been removed.'}
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isNl ? 'Terug naar Blog' : 'Back to Blog'}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = isNl ? article.titleNl : article.titleEn || article.titleNl;
  const content = (isNl ? article.contentNl : article.contentEn || article.contentNl) || '';
  const excerpt = isNl ? article.excerptNl : article.excerptEn || article.excerptNl;
  const category = isNl ? article.categoryNl : article.categoryEn || article.categoryNl;
  const tags = isNl ? article.tagsNl : article.tagsEn || article.tagsNl;
  const readingTime = calculateReadingTime(content);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                Home
              </Button>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                Blog
              </Button>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium line-clamp-1">{title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section - Enhanced */}
      <div className="bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Category */}
            {category && (
              <Badge className="mb-6 text-sm px-4 py-1" variant="secondary">
                {category}
              </Badge>
            )}
            
            {/* Title - Enhanced */}
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-foreground leading-tight">
              {title}
            </h1>
            
            {/* Excerpt - Enhanced */}
            {excerpt && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                {excerpt}
              </p>
            )}
            
            {/* Meta Info - Enhanced */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <time dateTime={article.publishedAt?.toString() || article.createdAt?.toString()}>
                  {formatDate(article.publishedAt || article.createdAt || new Date())}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{readingTime} {isNl ? 'min leestijd' : 'min read'}</span>
              </div>
              {article.viewCount !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{article.viewCount} {isNl ? 'weergaven' : 'views'}</span>
                </div>
              )}
            </div>

            {/* Tags - Enhanced */}
            {tags && (
              <div className="flex flex-wrap gap-2 mb-8">
                {(typeof tags === 'string' 
                  ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
                  : Array.isArray(tags) ? tags : []
                ).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm px-3 py-1 hover:bg-accent transition-colors">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Social Share - Enhanced */}
            <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg">
              <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                {isNl ? 'Delen:' : 'Share:'}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial('facebook')}
                  className="hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial('twitter')}
                  className="hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial('linkedin')}
                  className="hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image - Enhanced with Aspect Ratio */}
      {article.image && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-muted">
              <div className="aspect-video w-full">
                <img
                  src={article.image}
                  alt={article.imageAlt || title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {article.imageAlt && (
              <p className="text-sm text-muted-foreground text-center mt-4 italic">
                {article.imageAlt}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content - Enhanced */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <article 
              ref={contentRef}
              className="prose prose-lg md:prose-xl max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-24
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-md prose-img:w-full
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic
                prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6
                prose-li:mb-2
              "
            >
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </article>
          </div>

          {/* Sidebar - Enhanced */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TableOfContents content={content} language={currentLang as 'nl' | 'en'} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles - Enhanced with Clickable Titles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="bg-gradient-to-b from-muted/30 to-background py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {isNl ? 'Gerelateerde Artikelen' : 'Related Articles'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedArticles.map((related) => {
                const relatedSlug = isNl ? related.slugNl : related.slugEn || related.slugNl;
                const relatedTitle = isNl ? related.titleNl : related.titleEn || related.titleNl;
                const relatedExcerpt = isNl ? related.excerptNl : related.excerptEn || related.excerptNl;
                
                return (
                  <Link 
                    key={related.id} 
                    href={`/blog/${relatedSlug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-2 hover:border-primary">
                      {related.image && (
                        <div className="relative overflow-hidden aspect-video bg-muted">
                          <img
                            src={related.image}
                            alt={related.imageAlt || relatedTitle}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                          {relatedExcerpt}
                        </p>
                        <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                          <span>{isNl ? 'Lees meer' : 'Read more'}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Back to Blog - Enhanced */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {isNl ? 'Terug naar Blog' : 'Back to Blog'}
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
