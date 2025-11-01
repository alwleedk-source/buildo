import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Fetch article by slug (check both NL and EN slugs)
    const articles = await db
      .select()
      .from(blogArticles)
      .where(
        or(
          eq(blogArticles.slugNl, slug),
          eq(blogArticles.slugEn, slug)
        )
      )
      .limit(1);

    if (articles.length === 0) {
      return NextResponse.json(
        { error: 'Article not found', success: false },
        { status: 404 }
      );
    }

    const article = articles[0];

    // Increment view count
    await db
      .update(blogArticles)
      .set({ viewCount: (article.viewCount || 0) + 1 })
      .where(eq(blogArticles.id, article.id));

    return NextResponse.json({
      article: {
        ...article,
        viewCount: (article.viewCount || 0) + 1
      },
      success: true
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
