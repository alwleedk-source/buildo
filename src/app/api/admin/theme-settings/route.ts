import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { themeSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch theme settings
export async function GET() {
  try {
    const [settings] = await db.select().from(themeSettings).limit(1);
    
    // If no settings exist, return defaults
    if (!settings) {
      return NextResponse.json({
        success: true,
        data: {
          logoUrl: null,
          logoWidth: 180,
          logoHeight: 60,
          faviconUrl: null,
          primaryColor: '#0066CC',
          secondaryColor: '#FF6B35',
          accentColor: '#4ECDC4',
          backgroundColor: '#FFFFFF',
          textColor: '#1A1A1A',
          fontFamily: 'Inter',
          headingFontFamily: 'Inter',
          fontSize: '16px',
          containerMaxWidth: '1280px',
          borderRadius: '8px',
          darkModeEnabled: false,
          darkPrimaryColor: '#3B82F6',
          darkBackgroundColor: '#1A1A1A',
          darkTextColor: '#F5F5F5',
          customCss: null
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    console.error('Error fetching theme settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theme settings' },
      { status: 500 }
    );
  }
}

// PUT - Update theme settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if settings exist
    const [existing] = await db.select().from(themeSettings).limit(1);
    
    if (existing) {
      // Update existing
      const [updated] = await db
        .update(themeSettings)
        .set({
          ...body,
          updatedAt: new Date()
        })
        .where(eq(themeSettings.id, existing.id))
        .returning();
      
      return NextResponse.json({
        success: true,
        data: updated
      });
    } else {
      // Create new
      const [created] = await db
        .insert(themeSettings)
        .values(body)
        .returning();
      
      return NextResponse.json({
        success: true,
        data: created
      });
    }
  } catch (error: any) {
    console.error('Error updating theme settings:', error);
    return NextResponse.json(
      { error: 'Failed to update theme settings' },
      { status: 500 }
    );
  }
}
