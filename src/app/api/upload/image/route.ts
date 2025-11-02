import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'blog');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const filename = `${nameWithoutExt}-${timestamp}.webp`;
    const filepath = join(uploadsDir, filename);

    // Optimize and convert image to WebP using Sharp
    await sharp(buffer)
      .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(filepath);

    // Create thumbnail
    const thumbnailFilename = `${nameWithoutExt}-${timestamp}-thumb.webp`;
    const thumbnailPath = join(uploadsDir, thumbnailFilename);
    
    await sharp(buffer)
      .resize(400, 300, {
        fit: 'cover'
      })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);

    // Return public URL
    const imageUrl = `/uploads/blog/${filename}`;
    const thumbnailUrl = `/uploads/blog/${thumbnailFilename}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      thumbnailUrl,
      filename,
      size: file.size,
      type: 'image/webp'
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Configure route to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
