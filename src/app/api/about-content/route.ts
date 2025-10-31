import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aboutContent } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const content = await db
      .select()
      .from(aboutContent)
      .where(eq(aboutContent.isActive, true))
      .limit(1);
    
    return NextResponse.json(content[0] || null);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
