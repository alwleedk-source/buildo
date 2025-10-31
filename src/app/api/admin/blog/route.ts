import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const articles = await db.select().from(blogArticles);
    return NextResponse.json({ data: articles, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [newArticle] = await db.insert(blogArticles).values(body).returning();
    return NextResponse.json({ data: newArticle, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const [updated] = await db.update(blogArticles).set(data).where(eq(blogArticles.id, id)).returning();
    return NextResponse.json({ data: updated, success: true });
  } catch (error: any) {
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
