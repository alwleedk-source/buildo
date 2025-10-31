import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuth();

    // TODO: Implement DELETE logic
    return NextResponse.json({ message: 'Deleted successfully' });
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
