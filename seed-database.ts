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
        iconName: 'building',
        displayOrder: 1,
      },
      {
        labelNl: 'Tevreden Klanten',
        labelEn: 'Happy Clients',
        value: '350+',
        iconName: 'users',
        displayOrder: 2,
      },
      {
        labelNl: 'Jaren Ervaring',
        labelEn: 'Years Experience',
        value: '20+',
        iconName: 'award',
        displayOrder: 3,
      },
      {
        labelNl: 'Team Leden',
        labelEn: 'Team Members',
        value: '50+',
        iconName: 'team',
        displayOrder: 4,
      },
    ]);

    // 4. Services
    console.log('🔧 Adding Services...');
    await db.insert(services).values([
      {
        titleNl: 'Nieuwbouw',
        titleEn: 'New Construction',
        slug: 'nieuwbouw',
        descriptionNl: 'Complete nieuwbouwprojecten van ontwerp tot oplevering',
        descriptionEn: 'Complete new construction projects from design to delivery',
        fullDescriptionNl: 'Wij verzorgen het volledige proces van nieuwbouwprojecten, van de eerste schets tot de sleuteloverdracht. Ons ervaren team zorgt voor een naadloze uitvoering met aandacht voor detail en kwaliteit.',
        fullDescriptionEn: 'We handle the entire process of new construction projects, from the first sketch to the handover of keys. Our experienced team ensures seamless execution with attention to detail and quality.',
        iconName: 'building',
        featuredImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
        displayOrder: 1,
        isActive: true,
      },
      {
        titleNl: 'Renovatie',
        titleEn: 'Renovation',
        slug: 'renovatie',
        descriptionNl: 'Professionele renovatie en verbouwing van woningen en bedrijfspanden',
        descriptionEn: 'Professional renovation and remodeling of homes and commercial buildings',
        fullDescriptionNl: 'Van kleine verbouwingen tot complete renovaties, wij transformeren uw ruimte naar uw wensen. Met respect voor de bestaande structuur en met oog voor moderne mogelijkheden.',
        fullDescriptionEn: 'From small remodels to complete renovations, we transform your space to your wishes. With respect for the existing structure and an eye for modern possibilities.',
        iconName: 'wrench',
        featuredImage: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
        displayOrder: 2,
        isActive: true,
      },
      {
        titleNl: 'Onderhoud',
        titleEn: 'Maintenance',
        slug: 'onderhoud',
        descriptionNl: 'Regelmatig onderhoud en reparaties voor uw gebouw',
        descriptionEn: 'Regular maintenance and repairs for your building',
        fullDescriptionNl: 'Preventief onderhoud voorkomt grotere problemen en verlengt de levensduur van uw gebouw. Wij bieden onderhoudscontracten op maat.',
        fullDescriptionEn: 'Preventive maintenance prevents major problems and extends the life of your building. We offer customized maintenance contracts.',
        iconName: 'tools',
        featuredImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
        displayOrder: 3,
        isActive: true,
      },
    ]);

    // 5. Projects
    console.log('🏗️ Adding Projects...');
    await db.insert(projects).values([
      {
        titleNl: 'Luxe Appartementencomplex Amsterdam Zuid',
        titleEn: 'Luxury Apartment Complex Amsterdam South',
        slug: 'luxe-appartementencomplex-amsterdam-zuid',
        descriptionNl: 'Modern appartementencomplex met 50 wooneenheden',
        descriptionEn: 'Modern apartment complex with 50 residential units',
        fullDescriptionNl: 'Een prestigieus project in Amsterdam Zuid met luxe appartementen, ondergrondse parking en groene binnentuin. Voltooid in 2023.',
        fullDescriptionEn: 'A prestigious project in Amsterdam South with luxury apartments, underground parking and green courtyard. Completed in 2023.',
        location: 'Amsterdam Zuid',
        clientName: 'Vastgoed Partners BV',
        completionDate: new Date('2023-06-15'),
        projectValue: '€15.000.000',
        duration: '18 maanden',
        category: 'residential',
        status: 'completed',
        featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
        displayOrder: 1,
        isActive: true,
      },
      {
        titleNl: 'Kantoorgebouw Zuidas',
        titleEn: 'Office Building Zuidas',
        slug: 'kantoorgebouw-zuidas',
        descriptionNl: 'Duurzaam kantoorgebouw met BREEAM Excellent certificaat',
        descriptionEn: 'Sustainable office building with BREEAM Excellent certificate',
        fullDescriptionNl: 'Een modern kantoorgebouw van 8 verdiepingen met focus op duurzaamheid en werknemerswelzijn. Inclusief groene daken en zonnepanelen.',
        fullDescriptionEn: 'A modern 8-story office building focused on sustainability and employee well-being. Including green roofs and solar panels.',
        location: 'Amsterdam Zuidas',
        clientName: 'Office Solutions NV',
        completionDate: new Date('2023-09-30'),
        projectValue: '€25.000.000',
        duration: '24 maanden',
        category: 'commercial',
        status: 'completed',
        featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
        displayOrder: 2,
        isActive: true,
      },
    ]);

    // 6. Blog Articles
    console.log('📰 Adding Blog articles...');
    await db.insert(blogArticles).values([
      {
        titleNl: 'Duurzaam Bouwen: De Toekomst van de Bouwsector',
        titleEn: 'Sustainable Building: The Future of Construction',
        slug: 'duurzaam-bouwen-toekomst',
        excerptNl: 'Ontdek hoe duurzaam bouwen de toekomst van de bouwsector vormgeeft',
        excerptEn: 'Discover how sustainable building shapes the future of construction',
        contentNl: 'Duurzaam bouwen is niet langer een optie, maar een noodzaak. In dit artikel bespreken we de laatste trends en technieken in duurzaam bouwen...',
        contentEn: 'Sustainable building is no longer an option, but a necessity. In this article we discuss the latest trends and techniques in sustainable building...',
        authorName: 'Jan de Vries',
        category: 'sustainability',
        featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
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
        positionNl: 'Directeur',
        positionEn: 'Director',
        department: 'management',
        bioNl: 'Met meer dan 25 jaar ervaring in de bouwsector leidt Jan ons team naar succes.',
        bioEn: 'With more than 25 years of experience in construction, Jan leads our team to success.',
        email: 'jan@bouwmeesters.nl',
        phone: '+31 20 123 4567',
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        displayOrder: 1,
        isActive: true,
      },
    ]);

    // 8. Company Details
    console.log('🏢 Adding Company details...');
    await db.insert(companyDetails).values({
      companyName: 'BouwMeesters Amsterdam BV',
      legalName: 'BouwMeesters Amsterdam BV',
      kvkNumber: '12345678',
      btwNumber: 'NL123456789B01',
      addressStreet: 'Bouwstraat 123',
      addressCity: 'Amsterdam',
      addressPostalCode: '1012 AB',
      addressCountry: 'Nederland',
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
      { sectionKey: 'hero', isVisible: true, showInHeader: false, showInFooter: false, displayOrder: 1 },
      { sectionKey: 'about', isVisible: true, showInHeader: true, showInFooter: true, displayOrder: 2 },
      { sectionKey: 'services', isVisible: true, showInHeader: true, showInFooter: true, displayOrder: 3 },
      { sectionKey: 'projects', isVisible: true, showInHeader: true, showInFooter: true, displayOrder: 4 },
      { sectionKey: 'blog', isVisible: true, showInHeader: true, showInFooter: true, displayOrder: 5 },
      { sectionKey: 'team', isVisible: true, showInHeader: true, showInFooter: false, displayOrder: 6 },
      { sectionKey: 'contact', isVisible: true, showInHeader: true, showInFooter: true, displayOrder: 7 },
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
