import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Find service by slug (either NL or EN)
    const [service] = await db
      .select()
      .from(services)
      .where(
        or(
          eq(services.slugNl, slug),
          eq(services.slugEn, slug)
        )
      )
      .limit(1);
    
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
