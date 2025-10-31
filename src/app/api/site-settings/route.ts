import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    // Get all site settings
    let settings = await db.select().from(siteSettings);
    
    // If no settings exist, create default ones
    if (settings.length === 0) {
      const defaultSettings = [
        { key: 'siteName', value: 'BouwMeesters Amsterdam', category: 'general' },
        { key: 'siteDescription', value: 'Professionele bouwdiensten in Amsterdam', category: 'general' },
        { key: 'logo', value: '/logo.png', category: 'branding' },
        { key: 'headerOverlay', value: 'true', category: 'layout' },
        { key: 'headerTransparent', value: 'false', category: 'layout' },
        { key: 'primaryColor', value: '#1a5490', category: 'branding' },
        { key: 'secondaryColor', value: '#f59e0b', category: 'branding' },
      ];

      await db.insert(siteSettings).values(defaultSettings);
      settings = await db.select().from(siteSettings);
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
