import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companyInitiatives } from '@/lib/db/schema';
// import { requireAuth } from '@/lib/auth'; // Disabled for now

export async function GET(request: NextRequest) {
  try {
    // await requireAuth(); // Disabled for now

    const initiatives = await db.select().from(companyInitiatives);
    return NextResponse.json({ data: initiatives, success: true }, { status: 200 });
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
    const result = await db.insert(companyInitiatives).values(data).returning();
    return NextResponse.json({ data: result[0], success: true }, { status: 201 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
