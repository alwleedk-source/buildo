import { NextRequest, NextResponse } from 'next/server';
import { optimizeImage, isValidImageType } from '@/lib/image-utils';

/**
 * Image Optimization Proxy API
 * 
 * Usage: /api/image-proxy?url=<image-url>&w=<width>&h=<height>&q=<quality>&f=<format>
 * 
 * Examples:
 * - /api/image-proxy?url=https://example.com/image.jpg&w=800&q=80&f=webp
 * - /api/image-proxy?url=https://example.com/image.jpg&w=400&h=300&f=jpeg
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    const width = searchParams.get('w');
    const height = searchParams.get('h');
    const quality = searchParams.get('q');
    const format = searchParams.get('f');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 404 }
      );
    }

    const contentType = imageResponse.headers.get('content-type');
    
    if (!contentType || !isValidImageType(contentType)) {
      return NextResponse.json(
        { error: 'Invalid image type' },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Optimize the image
    const optimizedBuffer = await optimizeImage(imageBuffer, {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      quality: quality ? parseInt(quality) : 80,
      format: (format as any) || 'webp'
    });

    // Return optimized image
    return new NextResponse(optimizedBuffer, {
      headers: {
        'Content-Type': `image/${format || 'webp'}`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      }
    });

  } catch (error: any) {
    console.error('Image optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize image' },
      { status: 500 }
    );
  }
}
