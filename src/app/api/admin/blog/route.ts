import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Helper function to sanitize dates
function sanitizeDates(data: any) {
  const sanitized = { ...data };
  
  // Convert date fields to proper format
  if (sanitized.publishedAt) {
    sanitized.publishedAt = sanitized.publishedAt instanceof Date 
      ? sanitized.publishedAt 
      : new Date(sanitized.publishedAt);
  }
  
  if (sanitized.createdAt) {
    sanitized.createdAt = sanitized.createdAt instanceof Date 
      ? sanitized.createdAt 
      : new Date(sanitized.createdAt);
  }
  
  if (sanitized.updatedAt) {
    sanitized.updatedAt = sanitized.updatedAt instanceof Date 
      ? sanitized.updatedAt 
      : new Date(sanitized.updatedAt);
  }
  
  return sanitized;
}

export async function GET() {
  try {
    const articles = await db.select().from(blogArticles);
    return NextResponse.json({ data: articles, success: true });
  } catch (error: any) {
    console.error('GET /api/admin/blog error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sanitizedData = sanitizeDates(body);
    const [newArticle] = await db.insert(blogArticles).values(sanitizedData).returning();
    return NextResponse.json({ data: newArticle, success: true });
  } catch (error: any) {
    console.error('POST /api/admin/blog error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PUT request body:', body);
    
    const { id, ...data } = body;
    const sanitizedData = sanitizeDates(data);
    
    console.log('Sanitized data:', sanitizedData);
    
    const [updated] = await db
      .update(blogArticles)
      .set(sanitizedData)
      .where(eq(blogArticles.id, id))
      .returning();
      
    console.log('Updated article:', updated);
    
    return NextResponse.json({ data: updated, success: true });
  } catch (error: any) {
    console.error('PUT /api/admin/blog error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.delete(blogArticles).where(eq(blogArticles.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/admin/blog error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
