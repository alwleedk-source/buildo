import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch data
    return NextResponse.json({ message: 'Not implemented yet' }, { status: 501 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
