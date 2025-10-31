import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactFormSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Get all contact form settings
export async function GET() {
  try {
    const settings = await db
      .select()
      .from(contactFormSettings)
      .orderBy(contactFormSettings.order);
    
    return NextResponse.json({ data: settings, success: true });
  } catch (error: any) {
    console.error('GET contact form settings error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}

// POST - Create new field
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const [newField] = await db
      .insert(contactFormSettings)
      .values(body)
      .returning();
    
    return NextResponse.json({ data: newField, success: true });
  } catch (error: any) {
    console.error('POST contact form settings error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}

// PUT - Update field
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required', success: false },
        { status: 400 }
      );
    }
    
    const [updated] = await db
      .update(contactFormSettings)
      .set(data)
      .where(eq(contactFormSettings.id, id))
      .returning();
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Field not found', success: false },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: updated, success: true });
  } catch (error: any) {
    console.error('PUT contact form settings error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}

// DELETE - Delete field
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required', success: false },
        { status: 400 }
      );
    }
    
    await db
      .delete(contactFormSettings)
      .where(eq(contactFormSettings.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE contact form settings error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
