import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all published articles with tags
    const articles = await db
      .select({
        tagsNl: blogArticles.tagsNl,
        tagsEn: blogArticles.tagsEn
      })
      .from(blogArticles)
      .where(eq(blogArticles.isPublished, true));

    // Collect all unique tags
    const tagsSet = new Set<string>();
    
    articles.forEach(article => {
      // Add Dutch tags
      if (article.tagsNl && Array.isArray(article.tagsNl)) {
        article.tagsNl.forEach(tag => {
          if (tag) tagsSet.add(tag);
        });
      }
      // Add English tags
      if (article.tagsEn && Array.isArray(article.tagsEn)) {
        article.tagsEn.forEach(tag => {
          if (tag) tagsSet.add(tag);
        });
      }
    });

    const tags = Array.from(tagsSet).sort();

    return NextResponse.json({
      tags,
      success: true
    });
  } catch (error: any) {
    console.error('GET tags error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
