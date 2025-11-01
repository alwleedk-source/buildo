import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq, ne, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    const limit = parseInt(searchParams.get('limit') || '3');

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required', success: false },
        { status: 400 }
      );
    }

    // First, get the current article to find its category and tags
    const [currentArticle] = await db
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.id, articleId))
      .limit(1);

    if (!currentArticle) {
      return NextResponse.json(
        { error: 'Article not found', success: false },
        { status: 404 }
      );
    }

    // Find related articles based on same category or tags
    // Exclude the current article
    const relatedArticles = await db
      .select()
      .from(blogArticles)
      .where(
        ne(blogArticles.id, articleId)
      )
      .orderBy(desc(blogArticles.publishedAt))
      .limit(limit * 2); // Get more to filter

    // Filter and score articles by relevance
    const scoredArticles = relatedArticles
      .filter(article => article.isPublished)
      .map(article => {
        let score = 0;
        
        // Same category = +10 points
        if (article.categoryNl === currentArticle.categoryNl) {
          score += 10;
        }
        
        // Shared tags = +5 points per tag
        if (currentArticle.tagsNl && article.tagsNl) {
          const sharedTags = currentArticle.tagsNl.filter(tag => 
            article.tagsNl?.includes(tag)
          );
          score += sharedTags.length * 5;
        }
        
        return { article, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.article);

    return NextResponse.json({
      articles: scoredArticles,
      success: true
    });
  } catch (error: any) {
    console.error('GET related articles error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
