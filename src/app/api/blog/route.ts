import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    
    const offset = (page - 1) * limit;
    
    // Build query
    let query = db
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.isPublished, true))
      .orderBy(desc(blogArticles.createdAt))
      .limit(limit)
      .offset(offset);
    
    const articles = await query;
    
    // Get total count for pagination
    const totalResult = await db
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.isPublished, true));
    
    const total = totalResult.length;
    const totalPages = Math.ceil(total / limit);
    
    const response = NextResponse.json({
      data: articles,
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });

    // Add simple cache headers (2 minutes)
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=240'
    );

    return response;
  } catch (error: any) {
    console.error('GET /api/blog error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
