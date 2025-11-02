import { db } from './src/lib/db';
import { 
  heroContent, 
  aboutContent, 
  services, 
  projects, 
  blogArticles,
  statistics,
  partners,
  testimonials,
  teamMembers,
  companyDetails,
  siteSettings,
  sectionSettings,
  footerSettings
} from './src/lib/db/schema';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Hero Content
    console.log('📝 Adding Hero content...');
    await db.insert(heroContent).values({
      titleNl: 'Welkom bij BouwMeesters Amsterdam',
      titleEn: 'Welcome to BouwMeesters Amsterdam',
      subtitleNl: 'Uw betrouwbare partner voor professionele bouwoplossingen in Amsterdam',
      subtitleEn: 'Your trusted partner for professional construction solutions in Amsterdam',
      primaryCtaNl: 'Neem Contact Op',
      primaryCtaEn: 'Contact Us',
      secondaryCtaNl: 'Bekijk Projecten',
      secondaryCtaEn: 'View Projects',
      backgroundImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920',
      mediaType: 'image',
      textAlign: 'center',
      displayStyle: 'overlay',
      overlayOpacity: 50,
      headerOverlay: true,
    });

    // 2. About Content
    console.log('📝 Adding About content...');
    await db.insert(aboutContent).values({
      titleNl: 'Over BouwMeesters Amsterdam',
      titleEn: 'About BouwMeesters Amsterdam',
      descriptionNl: 'BouwMeesters Amsterdam is een toonaangevend bouwbedrijf gespecialiseerd in residentiële en commerciële projecten. Met meer dan twee decennia aan ervaring leveren wij hoogwaardige bouwoplossingen die voldoen aan de hoogste normen van kwaliteit en duurzaamheid. Onze missie is om duurzame en innovatieve bouwoplossingen te leveren die de verwachtingen van onze klanten overtreffen.',
      descriptionEn: 'BouwMeesters Amsterdam is a leading construction company specializing in residential and commercial projects. With more than two decades of experience, we deliver high-quality construction solutions that meet the highest standards of quality and sustainability. Our mission is to deliver sustainable and innovative construction solutions that exceed our clients\' expectations.',
      featuresNl: [
        { title: 'Kwaliteit', description: 'Hoogwaardige bouwoplossingen' },
        { title: 'Integriteit', description: 'Eerlijk en transparant' },
        { title: 'Innovatie', description: 'Moderne bouwtechnieken' },
        { title: 'Duurzaamheid', description: 'Milieuvriendelijk bouwen' }
      ],
      featuresEn: [
        { title: 'Quality', description: 'High-quality construction solutions' },
        { title: 'Integrity', description: 'Honest and transparent' },
        { title: 'Innovation', description: 'Modern construction techniques' },
        { title: 'Sustainability', description: 'Environmentally friendly construction' }
      ],
    });

    // 3. Statistics
    console.log('📊 Adding Statistics...');
    await db.insert(statistics).values([
      {
        labelNl: 'Voltooide Projecten',
        labelEn: 'Completed Projects',
        value: '500+',
        order: 1,
      },
      {
        labelNl: 'Tevreden Klanten',
        labelEn: 'Happy Clients',
        value: '350+',
        order: 2,
      },
      {
        labelNl: 'Jaren Ervaring',
        labelEn: 'Years Experience',
        value: '20+',
        order: 3,
      },
      {
        labelNl: 'Team Leden',
        labelEn: 'Team Members',
        value: '50+',
        order: 4,
      },
    ]);

    // 4. Services
    console.log('🔧 Adding Services...');
    await db.insert(services).values([
      {
        titleNl: 'Nieuwbouw',
        titleEn: 'New Construction',
        slugNl: 'nieuwbouw',
        slugEn: 'new-construction',
        descriptionNl: 'Complete nieuwbouwprojecten van ontwerp tot oplevering. Wij verzorgen het volledige proces van nieuwbouwprojecten, van de eerste schets tot de sleuteloverdracht.',
        descriptionEn: 'Complete new construction projects from design to delivery. We handle the entire process from the first sketch to the handover of keys.',
        icon: 'building',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
        order: 1,
      },
      {
        titleNl: 'Renovatie',
        titleEn: 'Renovation',
        slugNl: 'renovatie',
        slugEn: 'renovation',
        descriptionNl: 'Professionele renovatie en verbouwing van woningen en bedrijfspanden. Van kleine verbouwingen tot complete renovaties.',
        descriptionEn: 'Professional renovation and remodeling of homes and commercial buildings. From small remodels to complete renovations.',
        icon: 'wrench',
        image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
        order: 2,
      },
      {
        titleNl: 'Onderhoud',
        titleEn: 'Maintenance',
        slugNl: 'onderhoud',
        slugEn: 'maintenance',
        descriptionNl: 'Regelmatig onderhoud en reparaties voor uw gebouw. Preventief onderhoud voorkomt grotere problemen.',
        descriptionEn: 'Regular maintenance and repairs for your building. Preventive maintenance prevents major problems.',
        icon: 'tools',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
        order: 3,
      },
    ]);

    // 5. Projects
    console.log('🏗️ Adding Projects...');
    await db.insert(projects).values([
      {
        titleNl: 'Luxe Appartementencomplex Amsterdam Zuid',
        titleEn: 'Luxury Apartment Complex Amsterdam South',
        descriptionNl: 'Modern appartementencomplex met 50 wooneenheden. Een prestigieus project in Amsterdam Zuid met luxe appartementen, ondergrondse parking en groene binnentuin.',
        descriptionEn: 'Modern apartment complex with 50 residential units. A prestigious project in Amsterdam South with luxury apartments, underground parking and green courtyard.',
        categoryNl: 'Residentieel',
        categoryEn: 'Residential',
        location: 'Amsterdam Zuid',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
        featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
        status: 'completed',
      },
      {
        titleNl: 'Kantoorgebouw Zuidas',
        titleEn: 'Office Building Zuidas',
        descriptionNl: 'Duurzaam kantoorgebouw met BREEAM Excellent certificaat. Een modern kantoorgebouw van 8 verdiepingen met focus op duurzaamheid en werknemerswelzijn.',
        descriptionEn: 'Sustainable office building with BREEAM Excellent certificate. A modern 8-story office building focused on sustainability and employee well-being.',
        categoryNl: 'Commercieel',
        categoryEn: 'Commercial',
        location: 'Amsterdam Zuidas',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
        featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
        status: 'completed',
      },
    ]);

    // 6. Blog Articles
    console.log('📰 Adding Blog articles...');
    await db.insert(blogArticles).values([
      {
        titleNl: 'Duurzaam Bouwen: De Toekomst van de Bouwsector',
        titleEn: 'Sustainable Building: The Future of Construction',
        slugNl: 'duurzaam-bouwen-toekomst',
        slugEn: 'sustainable-building-future',
        excerptNl: 'Ontdek hoe duurzaam bouwen de toekomst van de bouwsector vormgeeft',
        excerptEn: 'Discover how sustainable building shapes the future of construction',
        contentNl: 'Duurzaam bouwen is niet langer een optie, maar een noodzaak. In dit artikel bespreken we de laatste trends en technieken in duurzaam bouwen...',
        contentEn: 'Sustainable building is no longer an option, but a necessity. In this article we discuss the latest trends and techniques in sustainable building...',
        categoryNl: 'Duurzaamheid',
        categoryEn: 'Sustainability',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
        imageAlt: 'Sustainable building',
        publishedAt: new Date('2024-01-15'),
        isPublished: true,
      },
    ]);

    // 7. Team Members
    console.log('👥 Adding Team members...');
    await db.insert(teamMembers).values([
      {
        nameNl: 'Jan de Vries',
        nameEn: 'Jan de Vries',
        titleNl: 'Directeur',
        titleEn: 'Director',
        bioNl: 'Met meer dan 25 jaar ervaring in de bouwsector leidt Jan ons team naar succes.',
        bioEn: 'With more than 25 years of experience in construction, Jan leads our team to success.',
        email: 'jan@bouwmeesters.nl',
        phone: '+31 20 123 4567',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      },
    ]);

    // 8. Company Details
    console.log('🏢 Adding Company details...');
    await db.insert(companyDetails).values({
      companyNameNl: 'BouwMeesters Amsterdam BV',
      companyNameEn: 'BouwMeesters Amsterdam BV',
      kvkNumber: '12345678',
      btwNumber: 'NL123456789B01',
      address: 'Bouwstraat 123',
      city: 'Amsterdam',
      postalCode: '1012 AB',
      country: 'Nederland',
      phone: '+31 20 123 4567',
      email: 'info@bouwmeesters.nl',
      website: 'https://bouwmeesters.nl',
    });

    // 9. Site Settings
    console.log('⚙️ Adding Site settings...');
    await db.insert(siteSettings).values([
      { key: 'site_name', value: 'BouwMeesters Amsterdam', category: 'general' },
      { key: 'site_tagline', value: 'Uw Partner in Bouw', category: 'general' },
      { key: 'logo_url', value: '/logo.png', category: 'branding' },
    ]);

    // 10. Section Settings
    console.log('📑 Adding Section settings...');
    await db.insert(sectionSettings).values([
      { sectionKey: 'hero', titleNl: 'Home', titleEn: 'Home', isVisible: true, showInHeader: false, showInFooter: false, order: 1 },
      { sectionKey: 'about', titleNl: 'Over Ons', titleEn: 'About Us', isVisible: true, showInHeader: true, showInFooter: true, order: 2 },
      { sectionKey: 'services', titleNl: 'Diensten', titleEn: 'Services', isVisible: true, showInHeader: true, showInFooter: true, order: 3 },
      { sectionKey: 'projects', titleNl: 'Projecten', titleEn: 'Projects', isVisible: true, showInHeader: true, showInFooter: true, order: 4 },
      { sectionKey: 'blog', titleNl: 'Blog', titleEn: 'Blog', isVisible: true, showInHeader: true, showInFooter: true, order: 5 },
      { sectionKey: 'team', titleNl: 'Team', titleEn: 'Team', isVisible: true, showInHeader: true, showInFooter: false, order: 6 },
      { sectionKey: 'contact', titleNl: 'Contact', titleEn: 'Contact', isVisible: true, showInHeader: true, showInFooter: true, order: 7 },
    ]);

    // 11. Footer Settings
    console.log('🦶 Adding Footer settings...');
    await db.insert(footerSettings).values({
      copyrightText: '© 2024 BouwMeesters Amsterdam BV. Alle rechten voorbehouden.',
      showSocialLinks: true,
      showNewsletter: true,
      newsletterTitle: 'Blijf op de hoogte',
      newsletterDescription: 'Ontvang onze nieuwsbrief met de laatste projecten en nieuws',
    });

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
