import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroContent } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get the latest hero content
    const content = await db
      .select()
      .from(heroContent)
      .orderBy(desc(heroContent.createdAt))
      .limit(1);
    
    if (content.length === 0) {
      return NextResponse.json(
        { message: 'No hero content found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(content[0]);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
