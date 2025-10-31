import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroContent } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const hero = await db.select().from(heroContent).where(eq(heroContent.isActive, true)).limit(1);
    
    if (hero.length === 0) {
      return NextResponse.json(
        { message: 'Hero content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(hero[0]);
  } catch (error) {
    console.error('Failed to fetch hero content:', error);
    return NextResponse.json(
      { message: 'Failed to fetch hero content' },
      { status: 500 }
    );
  }
}
