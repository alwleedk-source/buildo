import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';

export async function POST() {
  try {
    const projectsData = [
      {
        titleNl: 'Moderne Kantoorruimte Amsterdam',
        titleEn: 'Modern Office Space Amsterdam',
        descriptionNl: 'Complete nieuwbouw van een modern kantoorgebouw in Amsterdam Centrum met duurzame materialen en moderne faciliteiten.',
        descriptionEn: 'Complete new construction of a modern office building in Amsterdam Center with sustainable materials and modern facilities.',
        categoryNl: 'Nieuwbouw',
        categoryEn: 'New Construction',
        location: 'Amsterdam',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        gallery: [{url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', caption: 'Main building'}],
        featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        status: 'completed',
        isActive: true
      },
      {
        titleNl: 'Luxe Wooncomplex Rotterdam',
        titleEn: 'Luxury Residential Complex Rotterdam',
        descriptionNl: 'Renovatie en uitbreiding van een historisch pand tot luxe appartementen met moderne voorzieningen.',
        descriptionEn: 'Renovation and expansion of a historic building into luxury apartments with modern amenities.',
        categoryNl: 'Renovatie',
        categoryEn: 'Renovation',
        location: 'Rotterdam',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        gallery: [{url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', caption: 'Front view'}],
        featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        status: 'completed',
        isActive: true
      },
      {
        titleNl: 'Duurzaam Schoolgebouw Utrecht',
        titleEn: 'Sustainable School Building Utrecht',
        descriptionNl: 'Energieneutraal schoolgebouw met zonnepanelen, groene daken en moderne leslokalen.',
        descriptionEn: 'Energy-neutral school building with solar panels, green roofs and modern classrooms.',
        categoryNl: 'Duurzaam Bouwen',
        categoryEn: 'Sustainable Building',
        location: 'Utrecht',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800',
        gallery: [{url: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800', caption: 'School building'}],
        featuredImage: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800',
        status: 'completed',
        isActive: true
      },
      {
        titleNl: 'Restauratie Monumentaal Pand Den Haag',
        titleEn: 'Restoration Monumental Building The Hague',
        descriptionNl: 'Zorgvuldige restauratie van een 17e-eeuws monument met behoud van originele details.',
        descriptionEn: 'Careful restoration of a 17th-century monument preserving original details.',
        categoryNl: 'Restauratie',
        categoryEn: 'Restoration',
        location: 'Den Haag',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        gallery: [{url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', caption: 'Historic building'}],
        featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        status: 'completed',
        isActive: true
      },
      {
        titleNl: 'Winkelcentrum Eindhoven',
        titleEn: 'Shopping Center Eindhoven',
        descriptionNl: 'Nieuwbouw van een modern winkelcentrum met parkeergarage en openbare ruimtes.',
        descriptionEn: 'New construction of a modern shopping center with parking garage and public spaces.',
        categoryNl: 'Nieuwbouw',
        categoryEn: 'New Construction',
        location: 'Eindhoven',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
        gallery: [{url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', caption: 'Shopping center'}],
        featuredImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
        status: 'in_progress',
        isActive: true
      }
    ];

    await db.insert(projects).values(projectsData);

    return NextResponse.json({
      success: true,
      message: 'Projects seeded successfully',
      count: projectsData.length
    });
  } catch (error: any) {
    console.error('Seed projects error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
