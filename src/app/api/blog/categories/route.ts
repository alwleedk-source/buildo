import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Get categories with count (Dutch)
    const categoriesNl = await db
      .select({
        category: blogArticles.categoryNl,
        count: sql<number>`count(*)::int`
      })
      .from(blogArticles)
      .where(eq(blogArticles.isPublished, true))
      .groupBy(blogArticles.categoryNl)
      .orderBy(sql`count(*) desc`);

    // Filter out null categories and format
    const categories = categoriesNl
      .filter(cat => cat.category)
      .map(cat => ({
        category: cat.category!,
        count: cat.count
      }));

    return NextResponse.json({
      categories,
      success: true
    });
  } catch (error: any) {
    console.error('GET categories error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
