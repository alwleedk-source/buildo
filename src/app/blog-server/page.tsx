import Link from 'next/link';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogServerPage() {
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
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Blog (Server-Side)
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {articles.length} artikelen gevonden
          </p>
        </div>

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
                    <img
                      src={article.image}
                      alt={article.imageAlt || article.titleNl}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    {article.categoryNl && (
                      <Badge variant="secondary" className="mb-3">
                        {article.categoryNl}
                      </Badge>
                    )}
                    
                    <h2 className="text-xl font-bold mb-3 line-clamp-2">
                      {article.titleNl}
                    </h2>
                    
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
                        <span>{readingTime} min</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/blog/${article.slugNl}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Lees meer →
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
