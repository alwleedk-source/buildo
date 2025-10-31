import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroContent } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const content = await db
      .select()
      .from(heroContent)
      .where(eq(heroContent.isActive, true))
      .limit(1);
    
    return NextResponse.json(content[0] || null);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Get first hero content
    const heroes = await db.select().from(heroContent).limit(1);
    
    if (heroes.length === 0) {
      return NextResponse.json(
        { message: 'No hero content found' },
        { status: 404 }
      );
    }
    
    // Update hero content
    await db
      .update(heroContent)
      .set({
        videoUrl: data.videoUrl,
        videoType: data.videoType || 'upload',
        mediaType: data.mediaType || 'video',
        backgroundImage: data.backgroundImage,
        updatedAt: new Date()
      })
      .where(eq(heroContent.id, heroes[0].id));
    
    // Get updated content
    const updated = await db
      .select()
      .from(heroContent)
      .where(eq(heroContent.id, heroes[0].id))
      .limit(1);
    
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
