import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactInquiries } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { firstName, lastName, email, message } = body;
    
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Insert into database
    const [newMessage] = await db
      .insert(contactInquiries)
      .values({
        firstName,
        lastName,
        email,
        phone: body.phone || null,
        company: body.company || null,
        subject: body.subject || 'General Inquiry',
        message,
        projectType: body.projectType || null,
        budget: body.budget || null,
        timeline: body.timeline || null,
        status: 'new',
        isRead: false
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will contact you soon.',
      data: { id: newMessage.id }
    });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}

// GET - Get all contact messages (Admin only)
export async function GET() {
  try {
    const messages = await db
      .select()
      .from(contactInquiries)
      .orderBy(desc(contactInquiries.createdAt));
    
    return NextResponse.json({ data: messages, success: true });
  } catch (error: any) {
    console.error('GET contact messages error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
