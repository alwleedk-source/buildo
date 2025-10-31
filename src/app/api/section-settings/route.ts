import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sectionSettings } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    // Get all section settings
    let settings = await db
      .select()
      .from(sectionSettings)
      .orderBy(sectionSettings.order);
    
    // If no sections exist, create default ones
    if (settings.length === 0) {
      const defaultSections = [
        {
          sectionKey: 'hero',
          titleNl: 'Hero Sectie',
          titleEn: 'Hero Section',
          isVisible: true,
          showInHeader: false,
          showInFooter: false,
          order: 1,
          route: '/'
        },
        {
          sectionKey: 'statistics',
          titleNl: 'Statistieken',
          titleEn: 'Statistics',
          isVisible: true,
          showInHeader: false,
          showInFooter: false,
          order: 2,
          route: null
        },
        {
          sectionKey: 'about',
          titleNl: 'Over Ons',
          titleEn: 'About Us',
          isVisible: true,
          showInHeader: true,
          showInFooter: true,
          order: 3,
          route: '/about'
        },
        {
          sectionKey: 'services',
          titleNl: 'Diensten',
          titleEn: 'Services',
          isVisible: true,
          showInHeader: true,
          showInFooter: true,
          order: 4,
          route: '/services'
        },
        {
          sectionKey: 'projects',
          titleNl: 'Projecten',
          titleEn: 'Projects',
          isVisible: true,
          showInHeader: true,
          showInFooter: true,
          order: 5,
          route: '/projects'
        },
        {
          sectionKey: 'blog',
          titleNl: 'Blog',
          titleEn: 'Blog',
          isVisible: true,
          showInHeader: true,
          showInFooter: true,
          order: 6,
          route: '/blog'
        },
        {
          sectionKey: 'partners',
          titleNl: 'Partners',
          titleEn: 'Partners',
          isVisible: true,
          showInHeader: false,
          showInFooter: false,
          order: 7,
          route: null
        },
        {
          sectionKey: 'testimonials',
          titleNl: 'Testimonials',
          titleEn: 'Testimonials',
          isVisible: true,
          showInHeader: false,
          showInFooter: false,
          order: 8,
          route: null
        },
        {
          sectionKey: 'contact',
          titleNl: 'Contact',
          titleEn: 'Contact',
          isVisible: true,
          showInHeader: true,
          showInFooter: true,
          order: 9,
          route: '/contact'
        },
        {
          sectionKey: 'maatschappelijke',
          titleNl: 'Maatschappelijke Verantwoordelijkheid',
          titleEn: 'Corporate Social Responsibility',
          isVisible: true,
          showInHeader: false,
          showInFooter: false,
          order: 10,
          route: null
        }
      ];

      // Insert default sections
      await db.insert(sectionSettings).values(defaultSections);
      
      // Fetch again
      settings = await db
        .select()
        .from(sectionSettings)
        .orderBy(sectionSettings.order);
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
