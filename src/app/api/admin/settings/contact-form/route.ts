import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactFormSettings } from '@/lib/db/schema';
// import { requireAuth } from '@/lib/auth'; // Disabled for now

export async function GET(request: NextRequest) {
  try {
    // await requireAuth(); // Disabled for now

    const settings = await db.select().from(contactFormSettings).limit(1);
    return NextResponse.json({ data: settings[0] || {}, success: true }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // await requireAuth(); // Disabled for now

    const data = await request.json();
    const existing = await db.select().from(contactFormSettings).limit(1);
    
    let result;
    if (existing.length > 0) {
      result = await db.update(contactFormSettings)
        .set(data)
        .where(eq(contactFormSettings.id, existing[0].id))
        .returning();
    } else {
      result = await db.insert(contactFormSettings).values(data).returning();
    }
    
    return NextResponse.json({ data: result[0], success: true }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
