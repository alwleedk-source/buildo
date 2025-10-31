import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aboutUsPage } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allPages = await db.select().from(aboutUsPage);
    return NextResponse.json({ data: allPages, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [newPage] = await db.insert(aboutUsPage).values(body).returning();
    return NextResponse.json({ data: newPage, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const [updated] = await db.update(aboutUsPage).set(data).where(eq(aboutUsPage.id, id)).returning();
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
    await db.delete(aboutUsPage).where(eq(aboutUsPage.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
