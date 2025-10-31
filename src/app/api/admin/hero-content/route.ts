import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroContent } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const content = await db.select().from(heroContent).limit(1);
    return NextResponse.json(content[0] || null);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const heroes = await db.select().from(heroContent).limit(1);
    
    if (heroes.length === 0) {
      return NextResponse.json({ error: 'No hero content found' }, { status: 404 });
    }
    
    await db.update(heroContent)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(heroContent.id, heroes[0].id));
    
    const updated = await db.select().from(heroContent)
      .where(eq(heroContent.id, heroes[0].id)).limit(1);
    
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
