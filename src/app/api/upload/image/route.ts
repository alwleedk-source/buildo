import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadToR2, generateFilename } from '@/lib/r2';

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

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    console.log('Processing image:', file.name, file.size, 'bytes');

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const filename = generateFilename(file.name);
    const thumbnailFilename = generateFilename(file.name, 'webp').replace('.webp', '-thumb.webp');

    console.log('Generated filenames:', { filename, thumbnailFilename });

    // Optimize and convert main image to WebP
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1280, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toBuffer();

    console.log('Optimized image size:', optimizedBuffer.length, 'bytes');

    // Create thumbnail
    const thumbnailBuffer = await sharp(buffer)
      .resize(400, 300, {
        fit: 'cover'
      })
      .webp({ quality: 80 })
      .toBuffer();

    console.log('Thumbnail size:', thumbnailBuffer.length, 'bytes');

    // Upload to R2
    console.log('Uploading to R2...');
    const imageUrl = await uploadToR2(optimizedBuffer, filename, 'image/webp');
    const thumbnailUrl = await uploadToR2(thumbnailBuffer, thumbnailFilename, 'image/webp');

    console.log('Upload successful:', { imageUrl, thumbnailUrl });

    // Return public URLs
    return NextResponse.json({
      success: true,
      url: imageUrl,
      thumbnailUrl,
      filename,
      originalSize: file.size,
      optimizedSize: optimizedBuffer.length,
      compression: Math.round((1 - optimizedBuffer.length / file.size) * 100),
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
