'use client';

"use client";

import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BlogArticle } from '@/lib/db/schema';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface BlogResponse {
  articles: BlogArticle[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasMore: boolean;
  };
}

export function BlogPage() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;
  const currentLang = i18n.language;

  // SEO optimization
  
  const { data: blogData, isLoading } = useQuery<BlogResponse>({
    queryKey: ['/api/blog', currentPage],
    queryFn: async () => {
      const response = await fetch(`/api/blog?page=${currentPage}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch blog articles');
      return response.json();
    }
  });

  const articles = blogData?.articles || [];
  const pagination = blogData?.pagination;

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
        <div className="container mx-auto px-4 py-20">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <Skeleton className="h-16 w-80 mx-auto mb-6" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          {/* Articles Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Pagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const start = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(pagination.totalPages, start + maxVisiblePages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-12" data-testid="blog-pagination">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          data-testid="button-prev-page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {currentLang === 'en' ? 'Previous' : 'Vorige'}
        </Button>

        <div className="flex gap-1">
          {start > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
              >
                1
              </Button>
              {start > 2 && <span className="px-2">...</span>}
            </>
          )}

          {pages.map(page => (
            <Button
              key={page}
              variant={page === pagination.currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              data-testid={`button-page-${page}`}
            >
              {page}
            </Button>
          ))}

          {end < pagination.totalPages && (
            <>
              {end < pagination.totalPages - 1 && <span className="px-2">...</span>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                {pagination.totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          data-testid="button-next-page"
        >
          {currentLang === 'en' ? 'Next' : 'Volgende'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  };

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
            <span className="text-foreground font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {currentLang === 'en' ? 'Our Blog' : 'Ons Blog'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentLang === 'en' 
              ? 'Discover the latest trends, tips and insights from the construction world'
              : 'Ontdek de nieuwste trends, tips en inzichten uit de bouwwereld'
            }
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {currentLang === 'en' ? 'No articles available yet.' : 'Nog geen artikelen beschikbaar.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-articles-grid">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  data-testid={`blog-card-${currentLang === 'en' ? article.slugEn || article.slugNl : article.slugNl}`}
                >
                  {article.image && (
                    <Link href={`/blog/${currentLang === 'en' ? article.slugEn || article.slugNl : article.slugNl}`} data-testid={`link-article-image-${currentLang === 'en' ? article.slugEn || article.slugNl : article.slugNl}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.imageAlt || `${currentLang === 'en' ? article.titleEn || article.titleNl : article.titleNl} - ${currentLang === 'en' ? article.categoryEn || article.categoryNl || 'Construction' : article.categoryNl || 'Bouwproject'} | BuildIt Professional`}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <time dateTime={article.publishedAt?.toString() || article.createdAt?.toString() || ''}>
                        {formatDate(article.publishedAt || article.createdAt || new Date())}
                      </time>
                      {(currentLang === 'en' ? article.categoryEn || article.categoryNl : article.categoryNl) && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                          {currentLang === 'en' ? article.categoryEn || article.categoryNl : article.categoryNl}
                        </span>
                      )}
                    </div>
                    
                    <Link href={`/blog/${currentLang === 'en' ? article.slugEn || article.slugNl : article.slugNl}`} data-testid={`link-article-title-${currentLang === 'en' ? article.slugEn || article.slugNl : article.slugNl}`}>
                      <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                        {currentLang === 'en' ? article.titleEn || article.titleNl : article.titleNl}
                      </h3>
                    </Link>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {currentLang === 'en' ? article.excerptEn || article.excerptNl : article.excerptNl}
                    </p>
                    
                    <Link href={`/blog/${currentLang === 'en' ? article.slugEn || article.slugNl : article.slugNl}`} data-testid={`link-article-${currentLang === 'en' ? article.slugEn || article.slugNl : article.slugNl}`}>
                      <Button className="w-full group">
                        {currentLang === 'en' ? 'Read More' : 'Lees Meer'}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <Pagination />
            
            {/* Results info */}
            {pagination && (
              <div className="text-center mt-8 text-muted-foreground">
                {currentLang === 'en' 
                  ? `Showing ${((pagination.currentPage - 1) * pagination.limit) + 1}-${Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of ${pagination.totalCount} articles`
                  : `Toont ${((pagination.currentPage - 1) * pagination.limit) + 1}-${Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} van ${pagination.totalCount} artikelen`
                }
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
}