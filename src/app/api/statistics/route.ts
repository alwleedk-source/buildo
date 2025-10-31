import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { statistics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allStats = await db
      .select()
      .from(statistics)
      .where(eq(statistics.isActive, true));
    
    return NextResponse.json(allStats);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
