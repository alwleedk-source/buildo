import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services, blogArticles, teamMembers, partners, testimonials, projects } from '@/lib/db/schema';

export async function POST() {
  try {
    // Seed Services
    await db.insert(services).values([
      {
        titleNl: 'Nieuwbouw',
        titleEn: 'New Construction',
        descriptionNl: 'Complete nieuwbouwprojecten van ontwerp tot oplevering in heel Nederland',
        descriptionEn: 'Complete new construction projects from design to delivery throughout the Netherlands',
        slugNl: 'nieuwbouw',
        slugEn: 'new-construction',
        icon: 'building',
        isActive: true
      },
      {
        titleNl: 'Renovatie & Verbouwing',
        titleEn: 'Renovation & Remodeling',
        descriptionNl: 'Professionele renovatie en verbouwing van woningen en bedrijfspanden',
        descriptionEn: 'Professional renovation and remodeling of homes and commercial buildings',
        slugNl: 'renovatie-verbouwing',
        slugEn: 'renovation-remodeling',
        icon: 'wrench',
        isActive: true
      },
      {
        titleNl: 'Onderhoud & Reparatie',
        titleEn: 'Maintenance & Repair',
        descriptionNl: 'Regelmatig onderhoud en snelle reparaties voor uw gebouw',
        descriptionEn: 'Regular maintenance and quick repairs for your building',
        slugNl: 'onderhoud-reparatie',
        slugEn: 'maintenance-repair',
        icon: 'hammer',
        isActive: true
      },
      {
        titleNl: 'Restauratie',
        titleEn: 'Restoration',
        descriptionNl: 'Specialistische restauratie van monumentale en historische panden',
        descriptionEn: 'Specialist restoration of monumental and historic buildings',
        slugNl: 'restauratie',
        slugEn: 'restoration',
        icon: 'factory',
        isActive: true
      },
      {
        titleNl: 'Duurzaam Bouwen',
        titleEn: 'Sustainable Building',
        descriptionNl: 'Energiezuinige en milieuvriendelijke bouwoplossingen',
        descriptionEn: 'Energy-efficient and environmentally friendly building solutions',
        slugNl: 'duurzaam-bouwen',
        slugEn: 'sustainable-building',
        icon: 'leaf',
        isActive: true
      }
    ]);

    // Seed Blog Articles
    await db.insert(blogArticles).values([
      {
        titleNl: 'Duurzaam Bouwen: De Toekomst van de Bouwsector',
        titleEn: 'Sustainable Building: The Future of Construction',
        excerptNl: 'Ontdek hoe duurzaam bouwen de toekomst van de bouwsector vormgeeft',
        excerptEn: 'Discover how sustainable building is shaping the future of construction',
        contentNl: 'Duurzaam bouwen is niet langer een optie, maar een noodzaak. In dit artikel bespreken we de nieuwste trends en technieken in duurzaam bouwen.',
        contentEn: 'Sustainable building is no longer an option, but a necessity. In this article we discuss the latest trends and techniques in sustainable building.',
        slugNl: 'duurzaam-bouwen-toekomst',
        slugEn: 'sustainable-building-future',
        categoryNl: 'Duurzaamheid',
        categoryEn: 'Sustainability',
        author: 'Jan de Vries',
        isPublished: true
      },
      {
        titleNl: 'Renovatie Tips voor Oude Panden',
        titleEn: 'Renovation Tips for Old Buildings',
        excerptNl: 'Praktische tips voor het renoveren van historische gebouwen',
        excerptEn: 'Practical tips for renovating historic buildings',
        contentNl: 'Het renoveren van oude panden vereist speciale aandacht en expertise. Hier zijn onze beste tips.',
        contentEn: 'Renovating old buildings requires special attention and expertise. Here are our best tips.',
        slugNl: 'renovatie-tips-oude-panden',
        slugEn: 'renovation-tips-old-buildings',
        categoryNl: 'Renovatie',
        categoryEn: 'Renovation',
        author: 'Maria Jansen',
        isPublished: true
      },
      {
        titleNl: 'Moderne Bouwtechnieken in 2025',
        titleEn: 'Modern Building Techniques in 2025',
        excerptNl: 'Een overzicht van de nieuwste bouwtechnieken en innovaties',
        excerptEn: 'An overview of the latest building techniques and innovations',
        contentNl: 'De bouwsector evolueert snel met nieuwe technologieën en methoden. Ontdek wat er nieuw is in 2025.',
        contentEn: 'The construction sector is evolving rapidly with new technologies and methods. Discover what is new in 2025.',
        slugNl: 'moderne-bouwtechnieken-2025',
        slugEn: 'modern-building-techniques-2025',
        categoryNl: 'Innovatie',
        categoryEn: 'Innovation',
        author: 'Piet Bakker',
        isPublished: true
      }
    ]);

    // Seed Team Members
    await db.insert(teamMembers).values([
      {
        nameNl: 'Jan de Vries',
        nameEn: 'Jan de Vries',
        titleNl: 'Directeur',
        titleEn: 'Director',
        bioNl: 'Met meer dan 20 jaar ervaring in de bouwsector',
        bioEn: 'With over 20 years of experience in construction',
        email: 'jan@buildit.nl',
        isActive: true,
        order: 1
      },
      {
        nameNl: 'Maria Jansen',
        nameEn: 'Maria Jansen',
        titleNl: 'Projectmanager',
        titleEn: 'Project Manager',
        bioNl: 'Gespecialiseerd in grootschalige projecten',
        bioEn: 'Specialized in large-scale projects',
        email: 'maria@buildit.nl',
        isActive: true,
        order: 2
      },
      {
        nameNl: 'Piet Bakker',
        nameEn: 'Piet Bakker',
        titleNl: 'Hoofduitvoerder',
        titleEn: 'Chief Executor',
        bioNl: 'Expert in duurzaam bouwen',
        bioEn: 'Expert in sustainable building',
        email: 'piet@buildit.nl',
        isActive: true,
        order: 3
      }
    ]);

    // Seed Partners
    await db.insert(partners).values([
      {
        name: 'Partner A',
        websiteUrl: 'https://partner-a.com',
        isActive: true,
        order: 1
      },
      {
        name: 'Partner B',
        websiteUrl: 'https://partner-b.com',
        isActive: true,
        order: 2
      },
      {
        name: 'Partner C',
        websiteUrl: 'https://partner-c.com',
        isActive: true,
        order: 3
      }
    ]);

    // Seed Projects
    await db.insert(projects).values([
      {
        titleNl: 'Moderne Kantoorruimte Amsterdam',
        titleEn: 'Modern Office Space Amsterdam',
        descriptionNl: 'Complete nieuwbouw van een modern kantoorgebouw in Amsterdam Centrum met duurzame materialen.',
        descriptionEn: 'Complete new construction of a modern office building in Amsterdam Center with sustainable materials.',
        category: 'nieuwbouw',
        location: 'Amsterdam',
        completionDate: new Date('2024-06-15'),
        client: 'ABC Vastgoed BV',
        budget: '€2.5M',
        duration: '18 maanden',
        images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
        featured: true,
        status: 'completed',
        order: 1
      },
      {
        titleNl: 'Luxe Wooncomplex Rotterdam',
        titleEn: 'Luxury Residential Complex Rotterdam',
        descriptionNl: 'Renovatie en uitbreiding van een historisch pand tot luxe appartementen.',
        descriptionEn: 'Renovation and expansion of a historic building into luxury apartments.',
        category: 'renovatie',
        location: 'Rotterdam',
        completionDate: new Date('2024-03-20'),
        client: 'XYZ Ontwikkeling',
        budget: '€1.8M',
        duration: '12 maanden',
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
        featured: true,
        status: 'completed',
        order: 2
      },
      {
        titleNl: 'Duurzaam Schoolgebouw Utrecht',
        titleEn: 'Sustainable School Building Utrecht',
        descriptionNl: 'Energieneutraal schoolgebouw met zonnepanelen en groene daken.',
        descriptionEn: 'Energy-neutral school building with solar panels and green roofs.',
        category: 'duurzaam',
        location: 'Utrecht',
        completionDate: new Date('2024-09-01'),
        client: 'Gemeente Utrecht',
        budget: '€3.2M',
        duration: '24 maanden',
        images: ['https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800'],
        featured: true,
        status: 'completed',
        order: 3
      },
      {
        titleNl: 'Restauratie Monumentaal Pand Den Haag',
        titleEn: 'Restoration Monumental Building The Hague',
        descriptionNl: 'Zorgvuldige restauratie van een 17e-eeuws monument.',
        descriptionEn: 'Careful restoration of a 17th-century monument.',
        category: 'restauratie',
        location: 'Den Haag',
        completionDate: new Date('2023-12-10'),
        client: 'Rijksdienst voor het Cultureel Erfgoed',
        budget: '€1.5M',
        duration: '16 maanden',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
        featured: false,
        status: 'completed',
        order: 4
      },
      {
        titleNl: 'Winkelcentrum Eindhoven',
        titleEn: 'Shopping Center Eindhoven',
        descriptionNl: 'Nieuwbouw van een modern winkelcentrum met parkeergarage.',
        descriptionEn: 'New construction of a modern shopping center with parking garage.',
        category: 'nieuwbouw',
        location: 'Eindhoven',
        completionDate: new Date('2024-11-30'),
        client: 'Retail Partners NV',
        budget: '€4.5M',
        duration: '20 maanden',
        images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'],
        featured: false,
        status: 'in_progress',
        order: 5
      }
    ]);

    // Seed Testimonials
    await db.insert(testimonials).values([
      {
        customerName: 'John Doe',
        customerTitle: 'CEO, ABC Company',
        testimonialNl: 'Uitstekende service en kwaliteit!',
        testimonialEn: 'Excellent service and quality!',
        rating: 5,
        projectType: 'Commercial',
        featured: true,
        isActive: true
      },
      {
        customerName: 'Jane Smith',
        customerTitle: 'Director, XYZ Corp',
        testimonialNl: 'Zeer professioneel en betrouwbaar',
        testimonialEn: 'Very professional and reliable',
        rating: 5,
        projectType: 'Residential',
        featured: true,
        isActive: true
      },
      {
        customerName: 'Bob Johnson',
        customerTitle: 'Owner, Johnson Ltd',
        testimonialNl: 'Geweldig resultaat, zeer tevreden',
        testimonialEn: 'Great result, very satisfied',
        rating: 4,
        projectType: 'Renovation',
        featured: false,
        isActive: true
      }
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      counts: {
        services: 5,
        blogArticles: 3,
        teamMembers: 3,
        partners: 3,
        testimonials: 3,
        projects: 5
      }
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
