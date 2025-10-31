import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allServices = await db.select().from(services).where(eq(services.isActive, true));
    return NextResponse.json(allServices);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json(
      { message: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
