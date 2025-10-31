import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Helper function to process gallery field
function processGallery(gallery: any) {
  if (!gallery) return null;
  
  // If it's already an array, return it
  if (Array.isArray(gallery)) {
    return gallery;
  }
  
  // If it's a string (comma-separated URLs), convert to array of objects
  if (typeof gallery === 'string') {
    const urls = gallery.split(',').map(url => url.trim()).filter(url => url);
    return urls.map((url, index) => ({
      url,
      alt: `Gallery image ${index + 1}`,
      order: index
    }));
  }
  
  return null;
}

export async function GET() {
  try {
    const allProjects = await db.select().from(projects);
    return NextResponse.json({ data: allProjects, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process gallery field
    if (body.gallery) {
      body.gallery = processGallery(body.gallery);
    }
    
    // Set featuredImage to first gallery image if not set
    if (body.gallery && Array.isArray(body.gallery) && body.gallery.length > 0 && !body.featuredImage) {
      body.featuredImage = body.gallery[0].url;
    }
    
    const [newProject] = await db.insert(projects).values(body).returning();
    return NextResponse.json({ data: newProject, success: true });
  } catch (error: any) {
    console.error('POST /api/admin/projects error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    // Process gallery field
    if (data.gallery) {
      data.gallery = processGallery(data.gallery);
    }
    
    // Set featuredImage to first gallery image if not set
    if (data.gallery && Array.isArray(data.gallery) && data.gallery.length > 0 && !data.featuredImage) {
      data.featuredImage = data.gallery[0].url;
    }
    
    const [updated] = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
    return NextResponse.json({ data: updated, success: true });
  } catch (error: any) {
    console.error('PUT /api/admin/projects error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
