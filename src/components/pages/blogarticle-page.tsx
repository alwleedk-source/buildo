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
import { CommentsSection } from '@/components/blog/comments-section';

export function BlogArticlePage() {
  const { t, i18n } = useTranslation();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const currentLang = i18n.language;
  const isNl = currentLang === 'nl';

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

  const formatDate = (date: Date | string) => {
    const locale = isNl ? 'nl-NL' : 'en-US';
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
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
  const content = isNl ? article.contentNl : article.contentEn || article.contentNl;
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

      {/* Hero Section */}
      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Category */}
            {category && (
              <Badge className="mb-4" variant="secondary">
                {category}
              </Badge>
            )}
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {title}
            </h1>
            
            {/* Excerpt */}
            {excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {excerpt}
              </p>
            )}
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.publishedAt?.toString() || article.createdAt?.toString()}>
                  {formatDate(article.publishedAt || article.createdAt || new Date())}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} {isNl ? 'min leestijd' : 'min read'}</span>
              </div>
              {article.views !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{article.views} {isNl ? 'weergaven' : 'views'}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {(typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Social Share */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                {isNl ? 'Delen:' : 'Share:'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('facebook')}
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('twitter')}
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial('linkedin')}
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.image && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <img
              src={article.image}
              alt={article.imageAlt || title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TableOfContents content={content} language={currentLang as 'nl' | 'en'} />
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {isNl ? 'Gerelateerde Artikelen' : 'Related Articles'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {relatedArticles.map((related) => (
                <Card key={related.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {related.image && (
                    <img
                      src={related.image}
                      alt={related.imageAlt || (isNl ? related.titleNl : related.titleEn || related.titleNl)}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">
                      {isNl ? related.titleNl : related.titleEn || related.titleNl}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {isNl ? related.excerptNl : related.excerptEn || related.excerptNl}
                    </p>
                    <Link href={`/blog/${isNl ? related.slugNl : related.slugEn || related.slugNl}`}>
                      <Button variant="link" className="p-0 h-auto">
                        {isNl ? 'Lees meer' : 'Read more'} →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <CommentsSection articleId={article.id} language={currentLang as 'nl' | 'en'} />
        </div>
      </div>

      {/* Back to Blog */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isNl ? 'Terug naar Blog' : 'Back to Blog'}
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
