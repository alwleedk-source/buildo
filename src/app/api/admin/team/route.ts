import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { teamMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const team = await db.select().from(teamMembers).orderBy(teamMembers.order);
    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const [newMember] = await db.insert(teamMembers).values(data).returning();
    return NextResponse.json(newMember);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    await db.update(teamMembers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(teamMembers.id, id));
    
    const updated = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
