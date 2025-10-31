import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/upload';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Require authentication for uploads
    await requireAuth();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }
    
    const result = await uploadFile({ file });
    
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
