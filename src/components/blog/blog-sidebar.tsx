'use client';

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { BlogArticle } from '@/lib/db/schema';

interface BlogSidebarProps {
  currentArticleId?: string;
  language?: 'nl' | 'en';
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
}

interface CategoryCount {
  category: string;
  count: number;
}

export function BlogSidebar({ 
  currentArticleId, 
  language = 'nl',
  onCategoryClick,
  onTagClick 
}: BlogSidebarProps) {
  const isNl = language === 'nl';

  // Fetch popular articles
  const { data: popularArticles, isLoading: loadingPopular } = useQuery<BlogArticle[]>({
    queryKey: ['/api/blog/popular'],
    queryFn: async () => {
      const response = await fetch('/api/blog/popular?limit=5');
      if (!response.ok) throw new Error('Failed to fetch popular articles');
      const data = await response.json();
      return data.articles || [];
    }
  });

  // Fetch categories
  const { data: categories, isLoading: loadingCategories } = useQuery<CategoryCount[]>({
    queryKey: ['/api/blog/categories'],
    queryFn: async () => {
      const response = await fetch('/api/blog/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data.categories || [];
    }
  });

  // Fetch tags
  const { data: tags, isLoading: loadingTags } = useQuery<string[]>({
    queryKey: ['/api/blog/tags'],
    queryFn: async () => {
      const response = await fetch('/api/blog/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      return data.tags || [];
    }
  });

  const formatDate = (date: Date | string) => {
    const locale = isNl ? 'nl-NL' : 'en-US';
    return new Date(date).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Popular Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            {isNl ? 'Populaire Artikelen' : 'Popular Articles'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPopular ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          ) : popularArticles && popularArticles.length > 0 ? (
            <div className="space-y-4">
              {popularArticles
                .filter(article => article.id !== currentArticleId)
                .slice(0, 5)
                .map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${isNl ? article.slugNl : article.slugEn || article.slugNl}`}
                    className="block group"
                  >
                    <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                      {isNl ? article.titleNl : article.titleEn || article.titleNl}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.publishedAt || article.createdAt || new Date())}</span>
                    </div>
                  </Link>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isNl ? 'Geen artikelen gevonden' : 'No articles found'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="w-5 h-5 text-primary" />
            {isNl ? 'Categorieën' : 'Categories'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCategories ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => onCategoryClick?.(cat.category)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <span className="text-sm font-medium text-foreground">
                    {cat.category}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {cat.count}
                  </Badge>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isNl ? 'Geen categorieën gevonden' : 'No categories found'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tags Cloud */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isNl ? 'Tags' : 'Tags'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTags ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
          ) : tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 15).map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isNl ? 'Geen tags gevonden' : 'No tags found'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">
            {isNl ? 'Blijf op de hoogte' : 'Stay Updated'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {isNl 
              ? 'Ontvang de nieuwste artikelen direct in je inbox.'
              : 'Get the latest articles delivered straight to your inbox.'}
          </p>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); /* TODO: Implement newsletter */ }}>
            <input
              type="email"
              placeholder={isNl ? 'Jouw e-mailadres' : 'Your email address'}
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              {isNl ? 'Aanmelden' : 'Subscribe'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
