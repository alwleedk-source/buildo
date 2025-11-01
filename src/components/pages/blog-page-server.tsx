import Link from 'next/link';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq, desc, and, like, or } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ChevronRight, X } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface BlogPageServerProps {
  searchParams?: {
    category?: string;
    tag?: string;
  };
}

export async function BlogPageServer({ searchParams }: BlogPageServerProps) {
  const category = searchParams?.category;
  const tag = searchParams?.tag;

  // Build query with filters
  let query = db
    .select()
    .from(blogArticles)
    .where(eq(blogArticles.isPublished, true))
    .orderBy(desc(blogArticles.publishedAt))
    .limit(50); // Increased limit for filtering

  // Fetch all articles first
  let allArticles = await query;

  // Apply filters in JavaScript (since tags might be string or array)
  let articles = allArticles;

  if (category) {
    articles = articles.filter(article => 
      article.categoryNl === category || article.categoryEn === category
    );
  }

  if (tag) {
    articles = articles.filter(article => {
      const tagsNl = article.tagsNl;
      const tagsEn = article.tagsEn;
      
      const nlTags = typeof tagsNl === 'string' 
        ? tagsNl.split(',').map(t => t.trim()) 
        : Array.isArray(tagsNl) ? tagsNl : [];
      
      const enTags = typeof tagsEn === 'string' 
        ? tagsEn.split(',').map(t => t.trim()) 
        : Array.isArray(tagsEn) ? tagsEn : [];
      
      return nlTags.includes(tag) || enTags.includes(tag);
    });
  }

  // Limit to 12 after filtering
  articles = articles.slice(0, 12);

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('nl-NL', {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Navigation breadcrumb */}
      <div className="border-b bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/">
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Ons Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Ontdek de nieuwste trends, tips en inzichten uit de bouwwereld
          </p>

          {/* Active Filters */}
          {(category || tag) && (
            <div className="flex justify-center gap-3 mb-6">
              {category && (
                <Link href="/blog">
                  <Badge variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-secondary/80">
                    Category: {category}
                    <X className="w-3 h-3 ml-2" />
                  </Badge>
                </Link>
              )}
              {tag && (
                <Link href="/blog">
                  <Badge variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-secondary/80">
                    Tag: {tag}
                    <X className="w-3 h-3 ml-2" />
                  </Badge>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Articles Grid */}
          <div className="lg:col-span-3">
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  Geen artikelen gevonden{category ? ` in categorie "${category}"` : ''}{tag ? ` met tag "${tag}"` : ''}.
                </p>
                <Link href="/blog">
                  <Button variant="outline">
                    Toon alle artikelen
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => {
                  const readingTime = calculateReadingTime(article.contentNl);
                  
                  return (
                    <Card
                      key={article.id}
                      className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      {article.image && (
                        <Link href={`/blog/${article.slugNl}`}>
                          <div className="relative overflow-hidden h-48">
                            <img
                              src={article.image}
                              alt={article.imageAlt || article.titleNl}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                      )}
                      <CardContent className="p-6">
                        {article.categoryNl && (
                          <Link href={`/blog?category=${encodeURIComponent(article.categoryNl)}`}>
                            <Badge variant="secondary" className="mb-3 cursor-pointer hover:bg-secondary/80">
                              {article.categoryNl}
                            </Badge>
                          </Link>
                        )}
                        
                        <Link href={`/blog/${article.slugNl}`}>
                          <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary transition-colors">
                            {article.titleNl}
                          </h2>
                        </Link>
                        
                        {article.excerptNl && (
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {article.excerptNl}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{readingTime} min leestijd</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {article.tagsNl && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(typeof article.tagsNl === 'string' 
                              ? article.tagsNl.split(',').map(t => t.trim()).filter(t => t.length > 0)
                              : Array.isArray(article.tagsNl) ? article.tagsNl : []
                            ).slice(0, 3).map((articleTag, index) => (
                              <Link 
                                key={index} 
                                href={`/blog?tag=${encodeURIComponent(articleTag)}`}
                              >
                                <Badge 
                                  variant="outline" 
                                  className="text-xs cursor-pointer hover:bg-accent"
                                >
                                  {articleTag}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        )}
                        
                        <Link
                          href={`/blog/${article.slugNl}`}
                          className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                        >
                          Lees meer
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
