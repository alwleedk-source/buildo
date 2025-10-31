import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    // TODO: Fetch data
    return NextResponse.json({ message: 'Not implemented yet' }, { status: 501 });
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
