import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allTestimonials = await db.select().from(testimonials).orderBy(testimonials.order);
    return NextResponse.json(allTestimonials);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const [newTestimonial] = await db.insert(testimonials).values(data).returning();
    return NextResponse.json(newTestimonial);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    await db.update(testimonials)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(testimonials.id, id));
    
    const updated = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
