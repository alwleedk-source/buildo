import Link from 'next/link';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ChevronRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export async function BlogPageServer() {
  // Fetch articles directly on server
  const articles = await db
    .select()
    .from(blogArticles)
    .where(eq(blogArticles.isPublished, true))
    .orderBy(desc(blogArticles.publishedAt))
    .limit(12);

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
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Articles Grid */}
          <div className="lg:col-span-3">
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Geen artikelen gevonden.
                </p>
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
                          <img
                            src={article.image}
                            alt={article.imageAlt || article.titleNl}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          />
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
                              ? article.tagsNl.split(',').map(t => t.trim()) 
                              : article.tagsNl
                            ).slice(0, 3).map((tag, index) => (
                              <Link 
                                key={index} 
                                href={`/blog?tag=${encodeURIComponent(tag)}`}
                              >
                                <Badge 
                                  variant="outline" 
                                  className="text-xs cursor-pointer hover:bg-accent"
                                >
                                  {tag}
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
