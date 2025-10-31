import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
// import { requireAuth } from '@/lib/auth'; // Disabled for now

export async function GET(request: NextRequest) {
  try {
    // await requireAuth(); // Disabled for now

    // TODO: Fetch data
    return NextResponse.json({ data: [], success: true }, { status: 200 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
