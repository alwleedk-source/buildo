import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogComments } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET - Fetch comments for an article
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required', success: false },
        { status: 400 }
      );
    }

    // Only return approved comments
    const comments = await db
      .select()
      .from(blogComments)
      .where(
        and(
          eq(blogComments.articleId, articleId),
          eq(blogComments.status, 'approved')
        )
      )
      .orderBy(desc(blogComments.createdAt));

    return NextResponse.json({
      comments,
      success: true
    });
  } catch (error: any) {
    console.error('GET comments error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}

// POST - Submit a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, name, email, comment } = body;

    // Validate required fields
    if (!articleId || !name || !email || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', success: false },
        { status: 400 }
      );
    }

    // Insert comment (pending approval)
    const [newComment] = await db
      .insert(blogComments)
      .values({
        articleId,
        authorName: name,
        authorEmail: email,
        content: comment,
        status: 'pending' // Requires admin approval
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Comment submitted successfully. It will be visible after approval.',
      data: { id: newComment.id }
    });
  } catch (error: any) {
    console.error('POST comment error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
