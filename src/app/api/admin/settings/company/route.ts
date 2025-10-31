import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companyDetails } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET: Fetch company details
export async function GET(request: NextRequest) {
  try {
    const details = await db
      .select()
      .from(companyDetails)
      .where(eq(companyDetails.isActive, true))
      .limit(1);

    if (details.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json(details[0]);
  } catch (error) {
    console.error('Error fetching company details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company details' },
      { status: 500 }
    );
  }
}

// POST: Create or update company details
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if company details already exist
    const existing = await db
      .select()
      .from(companyDetails)
      .where(eq(companyDetails.isActive, true))
      .limit(1);

    let result;

    if (existing.length > 0) {
      // Update existing record
      result = await db
        .update(companyDetails)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(companyDetails.id, existing[0].id))
        .returning();
    } else {
      // Create new record
      result = await db
        .insert(companyDetails)
        .values({
          ...body,
          isActive: true,
        })
        .returning();
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error saving company details:', error);
    return NextResponse.json(
      { error: 'Failed to save company details' },
      { status: 500 }
    );
  }
}

// PUT: Update company details
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Company details ID is required' },
        { status: 400 }
      );
    }

    const result = await db
      .update(companyDetails)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(companyDetails.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Company details not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating company details:', error);
    return NextResponse.json(
      { error: 'Failed to update company details' },
      { status: 500 }
    );
  }
}
